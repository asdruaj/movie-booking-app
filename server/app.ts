import express, { Request, Response } from 'express'
import cors from 'cors'
import roomsRouter from './src/rooms/routes.js'
import moviesRouter from './src/movies/routes.js'
import showtimesRouter from './src/showtimes/routes.js'
import seatsRouter from './src/seats/routes.js'
import bookingRouter from './src/bookings/routes.js'
import pool from './src/shared/db.js'
import redisClient from './src/shared/redis.js'
import {errorHandler} from './src/shared/errorHandler.js'

export const app = express()
function timeOutAfter(ms: number){
    return new Promise((_, reject) => setTimeout(() => {
        reject(new Error('Timeout'))
    }, ms))
}


app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use('/api/v1/rooms', roomsRouter)
app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/showtimes', showtimesRouter);
app.use('/api/v1/seats', seatsRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use('/api/v1/health', async (req: Request, res: Response)=>{

    const [redisResult, pgResult] = await Promise.allSettled([
        Promise.race([redisClient.ping(), timeOutAfter(2000)]),
        Promise.race([pool.query('SELECT 1'), timeOutAfter(2000)])
     ])

    const isRedisHealthy = redisResult.status === 'fulfilled'
    const isPgHealty = pgResult.status === 'fulfilled'
    const isSystemReady = isRedisHealthy && isPgHealty

    res.status(isSystemReady ? 200 : 503).json({
        healthy: isSystemReady,
        instance: process.env.PORT,
        redis: isRedisHealthy ? 'ok' : 'down',
        postgres: isPgHealty ? 'ok' : 'down',
        error: {

            redis: !isRedisHealthy ? 
            (redisResult as PromiseRejectedResult).reason.message :
             null,
            
             postgres: !isPgHealty ? 
            (pgResult as PromiseRejectedResult).reason.message : 
            null
        }
    })
    
})

app.use(errorHandler)
