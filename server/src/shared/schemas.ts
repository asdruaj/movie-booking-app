import z from "zod";

export const paginationSchema = z.object({
    limit: z.coerce.number().int().max(100).positive().default(20),
    offset: z.coerce.number().int().nonnegative().default(0)
})

export const seatsQuerySchema = z.object({
  showtime_id: z.uuid(),
});

export const createBookingSchema = z.object({
  showtime_id: z.uuid(),
  seat_id: z.uuid(),
  user_id: z.uuid(),
  idempotency_key:z.uuid()
});

export const showtimesQuerySchema = z.object({
  movie_id: z.uuid().optional(),
});