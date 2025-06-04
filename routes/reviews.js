import express from 'express';
import {
  addReview,
  getReviewsForMovie,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, addReview);
router.get('/:movieId', getReviewsForMovie);
router.put('/:reviewId', verifyToken, updateReview);
router.delete('/:reviewId', verifyToken, deleteReview);

export default router;
