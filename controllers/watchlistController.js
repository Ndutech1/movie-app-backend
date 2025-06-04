import Watchlist from '../models/watchlist.js';

export const createWatchlist = async (req, res) => {
  try {
    const { title } = req.body;
    const watchlist = new Watchlist({
      userId: req.user.id,
      title,
      movies: [],
    });
    await watchlist.save();
    res.status(201).json(watchlist);
  } catch (err) {
    res.status(500).json({ message: 'Error creating watchlist', error: err.message });
  }
};

export const getUserWatchlists = async (req, res) => {
  try {
    const { userId } = req.params;
    const lists = await Watchlist.find({ userId });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching watchlists', error: err.message });
  }
};

export const addMovieToWatchlist = async (req, res) => {
  try {
    const { watchlistId } = req.params;
    const { movieId, movieTitle, posterPath } = req.body;

    const watchlist = await Watchlist.findById(watchlistId);
    watchlist.movies.push({ movieId, movieTitle, posterPath });
    await watchlist.save();
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: 'Error adding movie', error: err.message });
  }
};

export const removeMovieFromWatchlist = async (req, res) => {
  try {
    const { watchlistId } = req.params;
    const { movieId } = req.body;

    const watchlist = await Watchlist.findById(watchlistId);
    watchlist.movies = watchlist.movies.filter((m) => m.movieId !== movieId);
    await watchlist.save();
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: 'Error removing movie', error: err.message });
  }
};
