import { getAllSeats } from "./model.js";

export async function fetchAllSeats(showtimeId:string) {
    return getAllSeats(showtimeId)
}