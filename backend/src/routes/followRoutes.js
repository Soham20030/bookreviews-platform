import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { followUser, unfollowUser,  getFollowers, getFollowing } from '../controllers/followController.js';

const router = express.Router();

router.use(authenticateToken);          // every route requires login
router.post('/:userId',    followUser); // POST  → follow
router.delete('/:userId',  unfollowUser); // DELETE → unfollow
router.get('/:userId/followers',  getFollowers);
router.get('/:userId/following',  getFollowing);

export default router;
