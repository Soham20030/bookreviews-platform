import express from 'express';
import {
  setReadingStatus,
  getBooksByStatus,
  getAllReadingStatuses,
  getBookStatus,
  removeFromLibrary
} from '../controllers/readingStatusController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', setReadingStatus);
router.get('/', getAllReadingStatuses);
router.get('/:status', getBooksByStatus);
router.get('/book/:bookId', getBookStatus);
router.delete('/:bookId', removeFromLibrary);

export default router;
