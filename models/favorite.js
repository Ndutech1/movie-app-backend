import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId:  { type: String, required: true },
  movieTitle: String,
  posterPath: String,
}, { timestamps: true });

export default mongoose.model('Favorite', favoriteSchema);
