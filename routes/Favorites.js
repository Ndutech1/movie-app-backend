import express from 'express';
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from '../controllers/favoriteController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, addFavorite);
router.get('/:userId', verifyToken, getUserFavorites);
router.delete('/:userId/:movieId', verifyToken, removeFavorite);

export default router;
