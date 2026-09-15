import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../api";
import type { Movie } from "../types";
import { Link } from "react-router-dom";

function MoviesPage() {
 const {data, isLoading, error} = useQuery({
    queryKey:['movies'],
    queryFn: getMovies
 })

 if (isLoading) return <p>Loading...</p>
 if (error) return <p>Something went wrong</p>

 return(
    <ul>
        {
            data?.map((movie: Movie)=>(
                <li key={movie.id}>
                <Link to={`/movies/${movie.id}/showtimes`}>{movie.name}</Link>
                </li>
            ))
        }
    </ul>
 )
}

export default MoviesPage