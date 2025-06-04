import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  movieId:    String,
  movieTitle: String,
  posterPath: String,
});

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:  { type: String, required: true },
  movies: [movieSchema],
}, { timestamps: true });

export default mongoose.model('Watchlist', watchlistSchema);
