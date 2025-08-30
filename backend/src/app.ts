import express from "express";
import cors from "cors";
import 'dotenv/config';

import {hashPassword} from "./utils/hash_passwords.js";
import { signAccessToken } from "./utils/jwt.js";
import { verifyPassword } from "./utils/hash_passwords.js";

import { requireAuth } from "./middlewares/requireAuth.js";
import isMemberInChannel from "./middlewares/requireMember.js";

import saveUser from "./services/saveUser.js";
import { retrieveUserByEmail } from "./services/retrieveUsers.js";
import { addUserToChannel, createChannel, retrieveChannels, retrieveChannelById } from "./services/channels.js";
import { getMessagesbyChannelId, postMessagebyChannelId } from "./services/messages.js";
import { create } from "domain";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,               // only if you want cookies
  })
);



app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.post("/api/auth/register" ,async (req, res) => { 
    try{
        // Validate input data here if needed
        const email= req.body.email.toString();
        const name= req.body.name.toString();
        const password = req.body.password.toString();
        const hashedPassword= await hashPassword(password); 
        await saveUser(email, name, hashedPassword);
        res.status(201).json({ message: "User registered successfully", email, name });
    }
    catch(err){
      res.status(400).json({ message: "Error: Missing data or incorrect format", err });
      return;
    }
});



app.post("/api/auth/login", async (req, res) => {
  try {
        // Validate input data here if needed
        const email= req.body.email.toString();
        const password= req.body.password.toString();
        const user= await retrieveUserByEmail(email);
        if (!user) {
          return res.status(401).json({ message: "Invalid email" });;
        }

        const hashedPassword= user.passwordHash;
        const name= user.name;
        const id=user._id.toHexString();

        const isPasswordValid= await verifyPassword(hashedPassword, password);

        if (!isPasswordValid) {
          res.status(401).json({ message: "Invalid password" });
          return;
        }

            // Generate JWT token here if needed
        const token= signAccessToken({ user_id: id, email: email});
        res.status(200).json({ message: "User logged in successfully", email, name, token });
       
  }
    catch(err){
        res.status(400).json({ message: "Error: Missing data or incorrect format", err });
        return;
        }

});



app.get("/api/auth/me", requireAuth, async (req, res) => {
  // trae de DB si necesitas datos frescos
  res.json({ message:"Autorizado",user: req.user });
});


app.post("/api/channels",requireAuth, async (req,res)=>{
  try{

const name= req.body.name.toString();
const createdByUserId=req.user?.user_id;
const topic=req.body.topic.toString();
const description= req.body.description.toString();
await createChannel(name, createdByUserId, topic, description); 
res.status(201).json({ message: "Channel created successfully", name, topic, description });
  }
  catch(err){
    res.status(400).json({ message: "Error: Missing data or incorrect format", err });
    return;
  }

});

app.get("/api/channels",requireAuth, async (req,res)=>{
  try{
  // Implement channel retrieval logic here
  const channels= await retrieveChannels();
  res.json({ channels: channels });
  }
  catch(err){
    res.status(500).json({ message: "Error retrieving channels", err });
    return;
  }
});

app.get("/api/channels/:id", requireAuth, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Channel ID is required" });
    }
    const channelId = req.params.id;
    const channel = await retrieveChannelById(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving channel" });
  }
});

app.post("/api/channels/:id/join", requireAuth, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Channel ID is required" });
    }
    const channelId = req.params.id;
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user.user_id; 
    addUserToChannel(channelId, userId);
    res.json({ message: "Joined channel successfully" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error joining channel" });
  }
});


app.get("/api/channels/:id/messages", requireAuth,isMemberInChannel, async (req, res) => {
  
  try{

    const messages= await getMessagesbyChannelId(req.params.id!);
    res.json({ messages: messages });
  
  }
  catch(err){
    res.status(500).json({ message: "Error retrieving messages", err });
    return;
  }
});


app.post("/api/channels/:id/messages", requireAuth,isMemberInChannel, async (req, res) => {
  try{
    const channelId=req.params.id;
    const userId=req.user?.user_id;
    const message= req.body.message.toString();

    if (!channelId || !userId) {
      return res.status(400).json({ error: "Channel ID and User ID are required" });
    }
    await postMessagebyChannelId(channelId, userId, message);

    res.json({ message: "Message sent to channel "+ req.params.id });
  }
  catch(err){
    res.status(500).json({ message: "Error sending message", err });
    return;
  }
});






app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(4000, () => console.log("Server running on port 4000"));
