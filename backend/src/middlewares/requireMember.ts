import type { Request, Response, NextFunction } from 'express';
import { isUserInChannel } from '../services/channels.js';


export default async function isMemberInChannel(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.user_id;
  const channelId = req.params.id;
  if (!channelId || !userId)
  {return res.status(400).json({ error: 'Channel ID and User ID are required' });}
  const userInChannel= await isUserInChannel(channelId,userId);
  if(!userInChannel){
  return res.status(403).json({ error: 'User is not a member of this channel' });
  }
  next();
}
