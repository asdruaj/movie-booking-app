import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getShowtimes } from '../api';
import { Button } from '@/components/ui/button';

const ShowtimesPage = () => {
  const { movieId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['showtimes', movieId],
    queryFn: () => getShowtimes(movieId!),
  });

  if (isLoading) return <p className="text-stone">Loading...</p>;
  if (error) return <p className="text-destructive">Something went wrong</p>;

  const movieName = data?.[0]?.movie_name;

  return (
    <div>
      {movieName && (
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          {movieName}
        </h1>
      )}
      <p className="mt-1 text-stone">Choose a showtime</p>

      <div className="mt-6 flex flex-col gap-3">
        {data?.map((showtime) => {
          const start = new Date(showtime.start_time);
          const time = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
          const date = start.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

          return (
            <div
              key={showtime.id}
              className="flex flex-col overflow-hidden rounded-lg border border-stone/20 bg-surface sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4 bg-ink px-5 py-4 sm:w-48">
                <div>
                  <p className="font-display text-xl font-semibold text-surface">{time}</p>
                  <p className="text-xs text-surface/70">{date}</p>
                </div>
              </div>

              <div className="relative flex flex-1 items-center justify-between px-5 py-4">
                <div className="absolute -left-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rounded-full bg-paper sm:block" />
                <span className="text-sm text-stone">{showtime.room_label}</span>
                <Button
                  render={<Link to={`/showtimes/${showtime.id}/seats`} />}
                  className="bg-garnet hover:bg-garnet/90"
                >
                  Select seats
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShowtimesPage