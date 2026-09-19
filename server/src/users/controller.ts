import { Request, Response } from 'express';
import { fetchAllUsers } from './service.js';

export async function getUsers(req: Request, res: Response) {
  const users = await fetchAllUsers();
  res.status(200).json(users);
}