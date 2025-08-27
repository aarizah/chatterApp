import express from "express";
import cors from "cors";
import 'dotenv/config';

import {hashPassword} from "./utils/hash_passwords.js";
import { signAccessToken } from "./utils/jwt.js";
import { verifyPassword } from "./utils/hash_passwords.js";

import { requireAuth } from "./middlewares/requireAuth.js";

import saveUser from "./services/saveUser.js";
import { retrieveUserByEmail } from "./services/retrieveUsers.js";

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
        const token= signAccessToken({ sub: id, email: email});
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

  
});


app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(4000, () => console.log("Server running on port 4000"));
