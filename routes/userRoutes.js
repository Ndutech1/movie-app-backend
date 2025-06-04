import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  addToWatchHistory,
  getWatchHistory,
} from '../controllers/userController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/:userId', verifyToken, getUserProfile);
router.put('/:userId', verifyToken, updateUserProfile);
router.post('/:userId/history', verifyToken, addToWatchHistory);
router.get('/:userId/history', verifyToken, getWatchHistory);
router.put('/profile', verifyToken, updateUserProfile);
router.post('/watch-history', verifyToken, addToWatchHistory);
router.get('/watch-history', verifyToken, getWatchHistory);

export default router;
