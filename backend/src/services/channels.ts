import {connectDB} from '../db/connection.js';
import type { newChannel } from '../tsTypes/channelTypes.js';
import { ObjectId } from "mongodb";

export async function createChannel(channelName: string, userId: string | undefined, topic: string, description: string) {
    // Logic to create a channel in the database
        const db = await connectDB();
        const channels = db.collection('channels');
        if (!userId) {
            throw new Error("User ID is required to create a channel");
        }
        const newChannel:newChannel = { name: channelName, createdByUserId: userId , topic, description, members: [userId] };
        await channels.insertOne(newChannel);

    console.log(`Channel Created: ${channelName}, by User: ${userId}, Topic: ${topic}, Description: ${description}`);
}

export async function retrieveChannels() {
    // Logic to retrieve channels from the database
    const db = await connectDB();
    const channels = db.collection('channels');
    const allChannels = await channels.aggregate([
      { $match: {} },
      { $project: { _id: { $toString: "$_id" }, name: 1 } }
    ]).toArray();
    //console.log('Retrieved Channels:', allChannels);
    return allChannels ;
}

export async function retrieveChannelById(channelId: string) {
  const db = await connectDB();
  const channels = db.collection('channels');
  const channel = await channels.findOne({ _id: new ObjectId(channelId) });
  return channel;
}


export async function addUserToChannel(channelId: string, userId: string) {
  const db = await connectDB();
  const channels = db.collection('channels');
  const result = await channels.updateOne(
    { _id: new ObjectId(channelId) },
    { $addToSet: { members: userId } } // addToSet prevents duplicates
  );
  return result.modifiedCount > 0;
} 

export async function isUserInChannel(channelId: string, userId: string): Promise<boolean> {
  const db = await connectDB();
  const channels = db.collection('channels');
  const channel = await channels.findOne({ _id: new ObjectId(channelId), members: userId }); // This returns an object or null
  return !!channel; // returns true if channel and the member is found in that channel, false otherwise
}