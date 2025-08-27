import type { AuthPayload } from './userTypes.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};


