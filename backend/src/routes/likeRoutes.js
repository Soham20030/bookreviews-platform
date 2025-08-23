import express from 'express';
import {
  likeReview,
  unlikeReview,
  getReviewLikes
} from '../controllers/likeController.js';
import { authenticateToken, authenticateOptional } from '../middleware/auth.js';

const router = express.Router();

// Get like info for a review
router.get('/reviews/:reviewId/likes', authenticateOptional, getReviewLikes);

// Like a review
router.post('/reviews/:reviewId/like', authenticateToken, likeReview);

// Unlike a review
router.delete('/reviews/:reviewId/like', authenticateToken, unlikeReview);

export default router;
