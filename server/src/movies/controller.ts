import { Request, Response } from "express";
import { fetchAllMovies } from "./service.js";
import { paginationSchema } from "../shared/schemas.js";
import { ValidationError } from "../shared/errors.js";

export async function getMovies(req:Request, res: Response) {
    const parsed = paginationSchema.safeParse(req.query)

    if (!parsed.success){
        throw new ValidationError('Invalid pagination parameters')
    }

        const movies = await fetchAllMovies(parsed.data.limit, parsed.data.offset)
        res.status(200).json(movies)
}