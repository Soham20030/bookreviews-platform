import express from 'express';
import { updateReview, deleteReview, createReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.post('/',   authenticateToken, createReview);
router.put('/:rid', authenticateToken, updateReview);
router.delete('/:rid', authenticateToken, deleteReview);

export default router;
