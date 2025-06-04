const fetchMovieDetails = require('./utils/fetchMovieDetails');

(async () => {
  const movieId = '550'; // TMDB ID for "Fight Club"
  const movie = await fetchMovieDetails(movieId);
  console.log(movie);
})();
