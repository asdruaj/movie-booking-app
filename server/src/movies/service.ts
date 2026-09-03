import { getAllMovies } from "./model.js";

export async function fetchAllMovies(limit: number, offset: number) {
   return getAllMovies(limit, offset)
}