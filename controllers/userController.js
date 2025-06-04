import User from '../models/User.js';

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ This comes from your verifyToken middleware
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          bio: req.body.bio,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user profile',
      error: error.message,
    });
  }
};

export const addToWatchHistory = async (req, res) => {
  try {
    const { movieId, title, watchedAt } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newEntry = {
      movieId,
      title,
      watchedAt: watchedAt || new Date(),
    };

    user.watchHistory.push(newEntry);
    await user.save();

    res.status(200).json({ message: 'Watch history updated', watchHistory: user.watchHistory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating watch history', error: error.message });
  }
};


export const getWatchHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.json(user.watchHistory || []);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching watch history', error: err.message });
  }
};
