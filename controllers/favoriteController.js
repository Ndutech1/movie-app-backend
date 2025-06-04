import Favorite from '../models/favorite.js';

export const addFavorite = async (req, res) => {
  try {
    const { movieId, movieTitle, posterPath } = req.body;

    const favorite = new Favorite({
      userId: req.user.id,
      movieId,
      movieTitle,
      posterPath,
    });

    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: 'Error saving favorite', error: err.message });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favorites', error: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    await Favorite.findOneAndDelete({ userId, movieId });
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing favorite', error: err.message });
  }
};
