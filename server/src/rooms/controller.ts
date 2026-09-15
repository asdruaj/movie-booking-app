import { Request, Response } from 'express';
import { fetchAllRooms } from './service.js';

export async function getRooms(req: Request, res: Response) {
    const rooms = await fetchAllRooms()
    res.status(200).json(rooms)

}