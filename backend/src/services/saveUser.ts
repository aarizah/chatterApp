import type { newUser } from '../tsTypes/userTypes.js';
import {connectDB} from '../db/connection.js';



export default async function saveUser(email: string, name: string, passwordHash: string): Promise<void> {
    const db = await connectDB();
    const users = db.collection('users');
    const newUser:newUser = { name, email, passwordHash };
    await users.insertOne(newUser);
}