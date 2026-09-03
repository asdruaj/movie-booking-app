import { Request, Response } from "express";
import { fetchAllMovies } from "./service.js";
import { paginationSchema } from "../shared/schemas.js";

export async function getMovies(req:Request, res: Response) {
    const parsed = paginationSchema.safeParse(req.query)

    if (!parsed.success){
        return res.status(400).json({
            errror: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid pagination parameters',
                status: 400
            }
        })
    }

    try {
        const movies = await fetchAllMovies(parsed.data.limit, parsed.data.offset)
        res.status(200).json(movies)
    } catch (error) {
        return res.status(500).json({
            errror: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch movies',
                status: 500
            }
        })
    }
}