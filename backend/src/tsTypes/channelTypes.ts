import type { ObjectId } from "mongodb";

export interface newChannel { 
  name: string;
  createdByUserId: string;
  topic: string;
  description: string; // stored only in “DB”
  members: string[]; // array of user IDs
}

export interface Channel {
  _id: ObjectId; 
  name: string;
  userId: string;
  topic: string;
  description: string; // stored only in “DB”
  members: string[]; // array of user IDs
}