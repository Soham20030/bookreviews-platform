import express from 'express';
import {
  getReviewComments,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import { authenticateToken, authenticateOptional } from '../middleware/auth.js';

const router = express.Router();

// Get all comments for a specific review
router.get('/reviews/:reviewId/comments', authenticateOptional, getReviewComments);

// Create a new comment on a review
router.post('/reviews/:reviewId/comments', authenticateToken, createComment);

// Update a comment (user's own comment only)
router.put('/comments/:commentId', authenticateToken, updateComment);

// Delete a comment (user's own comment only)
router.delete('/comments/:commentId', authenticateToken, deleteComment);

export default router;
