import type { Booking, CreateBookingInput, Movie, Seat, Showtime, User } from "./types"

const API_URL = import.meta.env.VITE_API_URL
export async function getMovies(limit: number, offset: number): Promise<Movie[]> {
  const res = await fetch(`${API_URL}/movies?limit=${limit}&offset=${offset}`)
  if (!res.ok) throw new Error('Failed to fetch movies')

  return res.json()
}

export async function getShowtimes(movieId:string) : Promise<Showtime[]> {
    
    const res = await fetch(`${API_URL}/showtimes?movie_id=${movieId}`)

    if (!res.ok) throw new Error('Failed to fetch showtimes')
    
    return res.json()
}

export async function getSeats(showtimeId:string): Promise<Seat[]> {
    const res = await fetch(`${API_URL}/seats?showtime_id=${showtimeId}`)

    if (!res.ok) throw new Error('Failed to fetch seats')
    return res.json()
}

export async function createBooking(payload: CreateBookingInput) : Promise<Booking[]>{
    
    const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(payload)
    })

    if(!res.ok){
        const errorBody = await res.json()
        throw new Error(errorBody.error.message)
    }

    return res.json()
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
}