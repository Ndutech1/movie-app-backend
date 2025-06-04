const axios = require('axios');

const fetchMovieDetails = async (movieId) => {
  const apiKey = 'bd3a027dee12f7f128d9a8a49c71da54'; // your TMDB API key

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: { api_key: apiKey }
    });

    return {
      id: response.data.id.toString(),
      title: response.data.title,
      overview: response.data.overview,
      poster: response.data.poster_path,
      releaseDate: response.data.release_date,
    };
  } catch (error) {
    console.error("TMDB fetch error:", error.message);
    return null;
  }
};

module.exports = fetchMovieDetails;
