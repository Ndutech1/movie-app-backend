import express from 'express';
import authRoutes from './AuthRoutes.js';
import favoriteRoutes from './Favorites.js';
import watchlistRoutes from './watchlists.js';
import reviewRoutes from './reviews.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/watchlists', watchlistRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);

export default router;
