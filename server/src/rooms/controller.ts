import { Request, Response } from 'express';
import { fetchAllRooms } from './service.js';

export async function getRooms(req: Request, res: Response) {
  try {
    const rooms = await fetchAllRooms()
    res.status(200).json(rooms)
  } catch (error) {
    res.status(500).json({
        error:{
            code: 'INTERNAL ERROR',
            message: 'Failed to fetch rooms',
            status: 500
        }
    })
  }
}