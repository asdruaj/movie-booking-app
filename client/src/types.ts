export type Movie = {
  id: string;
  name: string;
  description: string;
  genre: string;
  duration: number;
  poster_url: string | null;
};

export type Showtime = {
  id: string;
  start_time: string;
  end_time: string;
  movie_name: string;
  movie_id: string;
  room_label: string;
};

export type Seat = {
  id: string;
  row_label: string;
  seat_number: number;
  booking_id: string | null;
}

export type Booking = {
  id: string;
  showtime_id: string;
  seat_id: string;
  status?: string,
  user_id: string
}

export type CreateBookingInput = {
  showtime_id: string;
  seat_id: string;
  user_id: string;
  idempotency_key: string
};