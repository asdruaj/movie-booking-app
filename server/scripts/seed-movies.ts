import pool from "../src/shared/db"

const movies = [
  {
    name: 'The Last Horizon',
    description: 'A crew of deep-space engineers must repair a failing station before a coronal storm hits.',
    genre: 'Sci-Fi',
    duration: 128,
    poster_url: '/posters/the-last-horizon.jpg',
  },
  {
    name: 'Quiet Streets',
    description: 'A detective returns to her hometown to investigate a string of unsolved disappearances.',
    genre: 'Thriller',
    duration: 111,
    poster_url: '/posters/quiet-streets.jpg',
  },
  {
    name: 'Paper Lanterns',
    description: 'Two estranged siblings reconnect during a road trip across the country for their father\'s funeral.',
    genre: 'Drama',
    duration: 104,
    poster_url: '/posters/paper-lanterns.jpg',
  },
  {
    name: 'The Wrong Recipe',
    description: 'A chaotic wedding weekend spirals out of control when the wrong cake shows up at the wrong wedding.',
    genre: 'Comedy',
    duration: 96,
    poster_url: '/posters/the-wrong-recipe.jpg',
  },
  {
    name: 'Iron Tide',
    description: 'A salvage crew race against a rival company to recover a sunken treasure before a hurricane hits.',
    genre: 'Action',
    duration: 133,
    poster_url: '/posters/iron-tide.jpg',
  },
];

export async function seedMovies() {
    const insertedMovies = []
  for (const movie of movies) {
    const result = await pool.query(
        "INSERT INTO movies (name, description, genre, duration, poster_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, duration",
        [movie.name, movie.description, movie.genre, movie.duration, movie.poster_url]
    )
    insertedMovies.push(result.rows[0])
  }
  return insertedMovies
}


