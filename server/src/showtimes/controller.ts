import { Request, Response } from "express";
import { fetchAllShowtimes } from "./service.js";

export async function getShowtimes(req: Request, res: Response) {
    try {
        const showtimes = await fetchAllShowtimes()
        res.status(200).json(showtimes)
    } catch (error) {
         console.error(error);
        res.status(500).json({
            error: {
                code: 'INTERNAL ERROR',
                message: 'Failed to fetch showtimes',
                status: 500
            }
        })
    }
}