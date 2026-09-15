import { Request, Response } from "express";
import { fetchAllShowtimes } from "./service.js";
import { showtimesQuerySchema } from "../shared/schemas.js";
import { ValidationError } from "../shared/errors.js";

export async function getShowtimes(req: Request, res: Response) {
    const parsed = showtimesQuerySchema.safeParse(req.query)
    
    if (!parsed.success){
        throw new ValidationError('Invalid movie_id')
    }

        const showtimes = await fetchAllShowtimes(parsed.data.movie_id)
        res.status(200).json(showtimes)
}