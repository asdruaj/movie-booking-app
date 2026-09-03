import { Request, Response } from "express";
import { createBookingSchema } from "../shared/schemas.js";
import { bookSeat } from "./service.js";
import { parse } from "dotenv";

export async function postBooking(req:Request, res: Response) {
    const parsed = createBookingSchema.safeParse(req.body)

    if (!parsed.success){
        console.log(parsed.error)
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid booking data',
                status: 400
            }
        })
    }

    try {
        const booking = await bookSeat(parsed.data.showtime_id, parsed.data.seat_id, parsed.data.user_id)
        res.status(201).json(booking)
    } catch (error) {
        console.log(error)
        if(error instanceof Error && error.message === 'SEAT_UNAVAILABLE') {
            return res.status(409).json({
                error: {
                    code: 'SEAT_UNAVAILABLE',
                    message: 'This seat is already booked for this showtime',
                    status: 409,
                }
            })
        }

    res.status(500).json({
        error:{
            code: 'INTERNAL_ERROR',
            message: 'Failed to fetch movies',
            status: 500
        }
    })
    }
}