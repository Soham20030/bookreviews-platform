import express from 'express';
import {
  setReadingStatus,
  getBookStatus,
  removeFromLibrary
} from '../controllers/readingStatusController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', setReadingStatus);
router.get('/book/:bookId', getBookStatus);
router.delete('/:bookId', removeFromLibrary);

export default router;
