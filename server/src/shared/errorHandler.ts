import { NextFunction, Request, Response } from "express";
import { AppError } from "./errors.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
    console.log(err)

    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                status: err.statusCode
            }
        })
    }

    res.status(500).json({
        error: {
                code: 'INTERNAL_ERROR',
                message: 'Something went wrong',
                status: 500
            }
    })
}