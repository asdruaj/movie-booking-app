import { findExistingBooking, createBooking } from './model.js';

export async function bookSeat(showtime_id: string, seat_id: string, user_id: string) {
  const existing = await findExistingBooking(showtime_id, seat_id);

  if (existing) {
    throw new Error('SEAT_UNAVAILABLE');
  }

  return createBooking(showtime_id, seat_id, user_id);
}