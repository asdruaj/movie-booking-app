import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { createBooking, getSeats } from "../api"

export const SeatMapPage = () => {
    const {showtimeId} = useParams()
    const queryClient = useQueryClient()

    const {data, isLoading, error} = useQuery({
        queryKey: ['seats', showtimeId],
        queryFn: () => getSeats(showtimeId!)
    })

    const bookingMutation = useMutation({
        mutationFn: createBooking,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ['seats', showtimeId]})
        },
        onError: (error)=>{
            alert(error.message)
        }
    })

if (isLoading) return <p>Loading...</p>
 if (error) return <p>Something went wrong</p>

  return (
    <>
    <h2>Seats</h2>
    {
        data?.map(seat=>(
            <div key={seat.id}>
                <span>Row: {seat.row_label}</span><br />
                <span>Number: {seat.seat_number}</span><br />
           
                <span>{seat.booking_id === null ? 'Available' : 'Occupied'}</span>
                <br />
                {seat.booking_id === null && 
                <button onClick={()=> {bookingMutation.mutate({
                    showtime_id: showtimeId!,
                    seat_id: seat.id,
                    user_id: '9330f3c5-9916-4191-987e-21ef3ce20f00',
                    idempotency_key: crypto.randomUUID()
                })}}>
                Book seat</button>}
                <br />
                <br />

            </div>
            
        ))
    }
    </>
  )
}
