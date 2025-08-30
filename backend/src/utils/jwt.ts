import jwt from 'jsonwebtoken';
import type { AuthPayload } from '../tsTypes/userTypes.js';

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = '2h'; //const EXPIRES_IN = process.env.JWT_EXPIRES || '15m';

export function signAccessToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyAccessToken(token: string): AuthPayload {
  return jwt.verify(token, SECRET) as unknown as AuthPayload; // More professional in the future
}

