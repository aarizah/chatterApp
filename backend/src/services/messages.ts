import {connectDB} from '../db/connection.js';
import { ObjectId } from "mongodb";


export async function getMessagesbyChannelId(channelId: string) {
  const db = await connectDB();
  const messages = db.collection('messages');

  const channelMessages = await messages.aggregate([
    { $match: { channelId: new ObjectId(channelId) } },
    { $sort: { timestamp: 1 } },

    // 1) convertir userId (string u ObjectId) a ObjectId nuevo campo
    { 
      $addFields: { 
        userIdObj: { 
          $convert: { input: "$userId", to: "objectId", onError: null, onNull: null }
        } 
      } 
    },

    // 2) lookup usando el campo convertido
    {
      $lookup: {
        from: "users",
        localField: "userIdObj",
        foreignField: "_id",
        as: "sender"
      }
    },

    // 3) no tires el mensaje si no hay user (evita quedarte en blanco)
    { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },

    // 4) proyecta lo necesario
    {
      $project: {
        _id: 1,
        content: 1,
        timestamp: 1,
        username: "$sender.name",
      }
    }
  ]).toArray();

  return channelMessages;
}


export async function postMessagebyChannelId (channelId: string, userId: string, content: string) {  
  const db = await connectDB();
  const messages = db.collection('messages');
  const newMessage = {
    channelId: new ObjectId(channelId),
    userId,
    content,
    timestamp: new Date()
  };
  const result = await messages.insertOne(newMessage);
  return

}