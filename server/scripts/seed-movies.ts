import pool from "../src/shared/db.js"

const movies = [
  {
    name: 'The Last Horizon',
    description: 'A crew of deep-space engineers must repair a failing station before a coronal storm hits.',
    genre: 'Sci-Fi',
    duration: 128,
  },
  {
    name: 'Quiet Streets',
    description: 'A detective returns to her hometown to investigate a string of unsolved disappearances.',
    genre: 'Thriller',
    duration: 111,
  },
  {
    name: 'Paper Lanterns',
    description: 'Two estranged siblings reconnect during a road trip across the country for their father\'s funeral.',
    genre: 'Drama',
    duration: 104,
  },
  {
    name: 'The Wrong Recipe',
    description: 'A chaotic wedding weekend spirals out of control when the wrong cake shows up at the wrong wedding.',
    genre: 'Comedy',
    duration: 96,
  },
  {
    name: 'Iron Tide',
    description: 'A salvage crew race against a rival company to recover a sunken treasure before a hurricane hits.',
    genre: 'Action',
    duration: 133,
  },
  {
    name: 'Midnight Ferry',
    description: 'A late-night ferry crossing turns tense when a passenger goes missing mid-voyage.',
    genre: 'Mystery',
    duration: 102,
  },
  {
    name: 'Glass Orchard',
    description: 'A family winery faces ruin unless three siblings can set aside decades of resentment.',
    genre: 'Drama',
    duration: 118,
  },
  {
    name: 'Neon Static',
    description: "A hacker uncovers a conspiracy buried inside a city's abandoned broadcast network.",
    genre: 'Sci-Fi',
    duration: 121,
  },
  {
    name: 'Comet Season',
    description: 'Two rival astronomers fall for each other while racing to name a newly discovered comet.',
    genre: 'Romance',
    duration: 99,
  },
  {
    name: 'The Long Applause',
    description: 'A retired concert pianist is coaxed out of hiding for one final performance.',
    genre: 'Drama',
    duration: 109,
  },
  {
    name: 'Hollow Pines',
    description: "A group of campers realize the forest they entered doesn't want to let them leave.",
    genre: 'Horror',
    duration: 97,
  },
  {
    name: 'Second Wind',
    description: 'An aging sled dog gets one last shot at the championship race alongside a rookie musher.',
    genre: 'Family',
    duration: 94,
  },
  {
    name: 'The Auditors',
    description: 'Two mismatched accountants stumble onto a company-wide fraud scheme during a routine audit.',
    genre: 'Comedy',
    duration: 101,
  },
  {
    name: 'Salt and Static',
    description: "A radio operator on a remote island picks up a distress signal that shouldn't exist.",
    genre: 'Thriller',
    duration: 106,
  },
  {
    name: 'Painted Doors',
    description: 'A young muralist discovers her paintings open into other worlds.',
    genre: 'Animation',
    duration: 92,
  },
  {
    name: 'The Quiet Line',
    description: 'A veteran union organizer navigates a factory strike that threatens to turn violent.',
    genre: 'Drama',
    duration: 124,
  },
  {
    name: 'Red Harbor',
    description: 'A former smuggler is pulled back into the underworld to save her estranged brother.',
    genre: 'Action',
    duration: 116,
  },
  {
    name: 'Ashfall',
    description: 'Survivors of a volcanic apocalypse navigate the ash-choked ruins of a coastal city.',
    genre: 'Sci-Fi',
    duration: 131,
  },
  {
    name: "The Cartographer's Wife",
    description: "In the 1800s, a mapmaker's wife secretly redraws his charts to protect a hidden village.",
    genre: 'Romance',
    duration: 113,
  },
  {
    name: 'Static Bloom',
    description: "A botanist investigating a rare flower's disappearance uncovers a decades-old cover-up.",
    genre: 'Mystery',
    duration: 108,
  },
  {
    name: 'Borrowed Time',
    description: 'A father and estranged son are forced to confront the past during a cross-country drive.',
    genre: 'Drama',
    duration: 115,
  },
  {
    name: 'The Understudy',
    description: 'A perpetually overlooked understudy finally gets her shot when the lead vanishes before opening night.',
    genre: 'Comedy',
    duration: 98,
  },
  {
    name: 'Fathom Line',
    description: "A deep-sea research crew loses contact with the surface after finding something they shouldn't have.",
    genre: 'Thriller',
    duration: 119,
  },
  {
    name: 'Winter Larks',
    description: "Three siblings try to save their grandmother's struggling bird sanctuary before winter.",
    genre: 'Family',
    duration: 91,
  },
  {
    name: 'The Last Cartridge',
    description: 'A washed-up arcade champion is pulled into one final, high-stakes tournament.',
    genre: 'Action',
    duration: 103,
  },
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function seedMovies() {
  const insertedMovies = [];
  for (const movie of movies) {
    const poster_url = `https://picsum.photos/seed/${slugify(movie.name)}/400/600`;
    const result = await pool.query(
      "INSERT INTO movies (name, description, genre, duration, poster_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, duration",
      [movie.name, movie.description, movie.genre, movie.duration, poster_url]
    );
    insertedMovies.push(result.rows[0]);
  }
  return insertedMovies;
}