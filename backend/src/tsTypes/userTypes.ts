export type Role = 'user' | 'admin';
import { ObjectId } from "mongodb";

export interface newUser { 
  name: string;
  email: string;
  //role: Role;
  passwordHash: string; // stored only in “DB”
}

export interface User {
  _id: ObjectId; 
  name: string;
  email: string;
  //role: Role;
  passwordHash: string; // stored only in “DB”
}

export interface AuthPayload {
  user_id: string;        // user id
  email?: string;
  role?: Role;
  iat?: number;
  exp?: number;
}