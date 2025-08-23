import express from 'express';
import { createBook, getAllBooks, getBookById } from '../controllers/bookController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createBook);
router.get('/', getAllBooks); // Public - anyone can see books
router.get('/:id', getBookById); // Public - anyone can see book details

export default router;
