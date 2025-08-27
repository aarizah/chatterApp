import {connectDB} from '../db/connection.js';
import type { User } from '../tsTypes/userTypes.js';


export async function retrieveUserByEmail(email: string): Promise<User | null> {
    const db = await connectDB();
    const users = db.collection<User>('users');
    const user = await users.findOne({ email });
    return user;
}

