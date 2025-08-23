import express from 'express';
import {
  getUserProfile,
  searchUsers,
  getUserFollowers,     // NEW
  getUserFollowing      // NEW
} from '../controllers/userProfileController.js';
import { authenticateOptional } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', authenticateOptional, searchUsers);
router.get('/:id/profile', authenticateOptional, getUserProfile);
router.get('/:id/followers', authenticateOptional, getUserFollowers);  // NEW
router.get('/:id/following', authenticateOptional, getUserFollowing);  // NEW

export default router;
