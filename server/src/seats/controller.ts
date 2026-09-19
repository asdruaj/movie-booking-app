import { Request, Response } from "express";
import { seatsQuerySchema } from "../shared/schemas.js";
import { fetchAllSeats } from "./service.js";
import { ValidationError } from "../shared/errors.js";

export async function getSeats(req: Request, res: Response) {
    const parsed = seatsQuerySchema.safeParse(req.query)

    if(!parsed.success){
       throw new ValidationError('A valid showtime_id is required')
    }

        const seats = await fetchAllSeats(parsed.data.showtime_id)
        res.status(200).json(seats)
}