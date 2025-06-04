import express from 'express';
import {
  createWatchlist,
  getUserWatchlists,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
} from '../controllers/watchlistController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createWatchlist);
router.get('/:userId', verifyToken, getUserWatchlists);
router.put('/:watchlistId/add', verifyToken, addMovieToWatchlist);
router.put('/:watchlistId/remove', verifyToken, removeMovieFromWatchlist);

export default router;
