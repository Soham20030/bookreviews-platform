import express from 'express';
import { updateReview, deleteReview, createReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Handle full paths instead of nested mounting
router.post('/:id/reviews', authenticateToken, createReview);
router.put('/:id/reviews/:rid', authenticateToken, updateReview);
router.delete('/:id/reviews/:rid', authenticateToken, deleteReview);

export default router;
