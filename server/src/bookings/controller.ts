import { Request, Response } from "express";
import { createBookingSchema } from "../shared/schemas.js";
import { bookSeat } from "./service.js";
import { parse } from "dotenv";
import { AppError, ValidationError } from "../shared/errors.js";

export async function postBooking(req:Request, res: Response) {
    const parsed = createBookingSchema.safeParse(req.body)

    if (!parsed.success){
        console.log(parsed.error)
        throw new ValidationError('Invalid booking data')
    }
    
        const booking = await bookSeat(parsed.data.showtime_id, parsed.data.seat_id, parsed.data.user_id, parsed.data.idempotency_key)
        res.status(201).json(booking)

}