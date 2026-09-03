import express from 'express'
import cors from 'cors'
import roomsRouter from './src/rooms/routes.js'
import moviesRouter from './src/movies/routes.js'
import showtimesRouter from './src/showtimes/routes.js'
import seatsRouter from './src/seats/routes.js'
import bookingRouter from './src/bookings/routes.js'

export const app = express()

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
