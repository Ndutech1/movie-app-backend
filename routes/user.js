const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const fetchMovieDetails = require('../utils/fetchMovieDetails');
const bcrypt = require('bcryptjs');

// Save favorite movie using movieId
router.post('/favorites', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: "Movie ID is required" });

    const movie = await fetchMovieDetails(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found in TMDB" });

    const user = await User.findById(req.user.id);
    const isDuplicate = user.favorites.some(fav => fav.id === movie.id.toString());
    if (isDuplicate) return res.status(400).json({ message: "Movie already in favorites" });

    user.favorites.push({
      title: movie.title,
      id: movie.id.toString()
    });

    await user.save();
    res.json({ message: "Movie added to favorites", movie: movie.title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get favorite movies
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get query params
    const { page = 1, limit = 10, search = "" } = req.query;

    // Filter favorites based on search
    const filtered = user.favorites.filter(movie =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + parseInt(limit));

    res.json({
      page: parseInt(page),
      total: filtered.length,
      favorites: paginated,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Remove movie from favorites
router.delete('/favorites/:movieId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const originalLength = user.favorites.length;
    user.favorites = user.favorites.filter(m => m.id !== req.params.movieId);

    if (user.favorites.length === originalLength) {
      return res.status(404).json({ message: "Movie not found in favorites" });
    }

    await user.save();
    res.json({ message: "Movie removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a new watchlist
router.post('/watchlists', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Watchlist name required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.watchlists.some(list => list.name === name)) {
      return res.status(400).json({ message: "Watchlist already exists" });
    }

    user.watchlists.push({ name, movies: [] });
    await user.save();
    res.json({ message: "Watchlist created" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add movie to a watchlist
router.post('/watchlists/:name', authMiddleware, async (req, res) => {
  try {
    const { movie } = req.body;
    const { name } = req.params;

    if (!movie || !movie.id || !movie.title) {
      return res.status(400).json({ message: "Invalid movie data" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const watchlist = user.watchlists.find(list => list.name === name);
    if (!watchlist) return res.status(404).json({ message: "Watchlist not found" });

    const duplicate = watchlist.movies.some(m => m.id === movie.id);
    if (duplicate) return res.status(400).json({ message: "Movie already in watchlist" });

    watchlist.movies.push(movie);
    await user.save();
    res.json({ message: "Movie added to watchlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/watchlists/:name', authMiddleware, async (req, res) => {
  const { name } = req.params;
  const { page = 1, limit = 10, search = "" } = req.query;

  const user = await User.findById(req.user.id);
  const watchlist = user.watchlists.find(w => w.name === name);

  if (!watchlist) return res.status(404).json({ message: "Watchlist not found" });

  const filtered = watchlist.movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + parseInt(limit));

  res.json({
    page: parseInt(page),
    total: filtered.length,
    movies: paginated
  });
});


// ✅ Add or update rating
router.post('/ratings', authMiddleware, async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    if (!movieId || typeof rating !== 'number') {
      return res.status(400).json({ message: "Movie ID and numeric rating required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = user.ratings.find(r => r.movieId === movieId);

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
    } else {
      user.ratings.push({ movieId, rating, comment });
    }

    await user.save();
    res.json({ message: "Rating saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all ratings
router.get('/ratings', authMiddleware, async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const user = await User.findById(req.user.id);
  const filtered = user.ratings.filter(r =>
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + parseInt(limit));

  res.json({
    page: parseInt(page),
    total: filtered.length,
    ratings: paginated
  });
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findById(req.user.id);

    if (email) {
      user.email = email.toLowerCase();
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
