import { Request, Response } from "express";
import { seatsQuerySchema } from "../shared/schemas.js";
import { fetchAllSeats } from "./service.js";

export async function getSeats(req: Request, res: Response) {
    const parsed = seatsQuerySchema.safeParse(req.query)

    if(!parsed.success){
        return res.status(400).json({
            error:{
                code: 'VALIDATION ERROR',
                message: 'A valid showtime_id is required',
                status: 400
            }
        })
    }

    try {
        const seats = await fetchAllSeats(parsed.data.showtime_id)
        res.status(200).json(seats)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            
            error:{
                code: 'INTERNAL ERROR',
                message: 'Failed fetching seats',
                status: 500
            }
        })
    }
}