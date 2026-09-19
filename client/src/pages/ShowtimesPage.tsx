import { useQuery } from "@tanstack/react-query"
import { getShowtimes } from "../api"
import { Link, useParams } from "react-router-dom"

function ShowtimesPage() {
const {movieId} = useParams()

 const {data, isLoading, error} = useQuery({
    queryKey:['showtimes', movieId],
    queryFn: ()=>getShowtimes(movieId!)
 })

 if (isLoading) return <p>Loading...</p>
 if (error) return <p>Something went wrong</p>

  return (
    <>
<h2>Showtimes:</h2>

    {
        data?.map(showtime => (
            <Link to={`/showtimes/${showtime.id}/seats`} key={showtime.id}>
                <span>Movie: {showtime.movie_name}</span>
                <span>Start time: {showtime.start_time}</span>
                <span>Room Label: {showtime.room_label}</span>
            </Link>
        ))
    }

    </>
  )
  
}

export default ShowtimesPage