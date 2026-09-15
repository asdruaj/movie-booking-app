import redisClient from "../shared/redis.js";
import { getAllSeats } from "./model.js";

export async function fetchAllSeats(showtimeId:string) {
    const cacheKey = `seats:showtime:${showtimeId}`

    const cached = await redisClient.get(cacheKey)

    if (cached) return JSON.parse(cached)

    const seats = await getAllSeats(showtimeId)

    await redisClient.set(
        cacheKey,
        JSON.stringify(seats),
        {
            expiration:{
                type: 'EX',
                value: 60
            }
        }
    )

    return seats
}