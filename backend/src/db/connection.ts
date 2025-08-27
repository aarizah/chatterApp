import {MongoClient, ServerApiVersion} from "mongodb";
import type { Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();


let db: Db;

export async function connectDB(): Promise<Db> {
  if (!db) {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in .env");
    }

    const client = new MongoClient(process.env.MONGO_URI, {
        serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }});


    await client.connect();
    db = client.db(process.env.DB_NAME || "chatterbox");
    console.log("✅ Connected to MongoDB:", db.databaseName);

    await db.collection("users").createIndex({ email: 1 }, { unique: true });
  }
  return db;
}