import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getMovies } from '../api';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 12;

 const MoviesPage = () => {
  const [page, setPage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', page],
    queryFn: () => getMovies(PAGE_SIZE, page * PAGE_SIZE),
  });

  if (isLoading) return <p className="text-stone">Loading...</p>;
  if (error) return <p className="text-destructive">Something went wrong</p>;

  const hasNextPage = (data?.length ?? 0) === PAGE_SIZE;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        Now Showing
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((movie) => (
          <div
            key={movie.id}
            className="overflow-hidden rounded-lg border border-stone/20 bg-surface"
          >
            <div className="relative h-56">
              <img
                src={movie.poster_url ?? undefined}
                alt={movie.name}
                className="h-full w-full object-cover"
              />
              {!movie.has_showtimes && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/60">
                  <span className="font-display text-lg font-semibold text-surface">
                    Coming Soon
                  </span>
                </div>
              )}
              <span className="absolute bottom-3 left-4 rounded bg-ink/80 px-2 py-1 text-xs font-medium text-surface">
                {movie.genre}
              </span>
              <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="h-3 w-3 rounded-full bg-paper" />
                ))}
              </div>
            </div>

            <div className="p-4 pt-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                {movie.name}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-stone">
                {movie.description}
              </p>
              <p className="mt-2 text-xs text-stone">{movie.duration} min</p>
              
                {movie.has_showtimes ? (
                  <Button
                    render={<Link to={`/movies/${movie.id}/showtimes`} />}
                    className="mt-4 w-full bg-garnet hover:bg-garnet/90"
                  >
                    See showtimes
                  </Button>
                ) : (
                  <Button disabled className="mt-4 w-full bg-stone/30 text-stone">
                    Coming Soon
                  </Button>
                )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="bg-surface text-ink border border-stone/40 hover:bg-paper disabled:opacity-40"
        >
          Previous
        </Button>
        <span className="text-sm text-stone">Page {page + 1}</span>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNextPage}
          className="bg-surface text-ink border border-stone/40 hover:bg-paper disabled:opacity-40"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MoviesPage