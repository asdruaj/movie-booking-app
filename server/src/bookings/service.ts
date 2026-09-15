import { getAllSeats } from "../seats/model.js";
import redisClient from "../shared/redis.js";
import { createBookingWithLock } from "./model.js";

export async function bookSeat(showtime_id: string, seat_id: string, user_id: string, idempotency_key: string) {
  const booking = await createBookingWithLock(showtime_id, seat_id, user_id, idempotency_key)

  const freshSeats = await getAllSeats(showtime_id)

  const cacheKey = `seats:showtime:${showtime_id}`

  await redisClient.set(
    cacheKey,
    JSON.stringify(freshSeats),
    {
      expiration: {
        type: 'EX',
        value: 60
      }
    }
  )

  return booking
}