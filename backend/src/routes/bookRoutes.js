import express from 'express';
import { createBook, getAllBooks, getBookById } from '../controllers/bookController.js';
import { authenticateToken } from '../middleware/auth.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

// POST route for creating books
router.post('/', authenticateToken, createBook);

// Public routes
router.get('/', getAllBooks); // Public - anyone can see books

// ✅ SPECIFIC ROUTES MUST COME BEFORE GENERIC /:id ROUTE
router.get('/add', authenticateToken, (req, res) => {
  // Return data needed for the add book form (like available genres)
  res.json({ 
    message: 'Add book form data',
    availableGenres: [
      'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
      'Fantasy', 'Biography', 'History', 'Self-Help', 'Poetry',
      'Drama', 'Adventure', 'Horror', 'Comedy', 'Philosophy'
    ]
  });
});

// Generic route MUST come after specific routes
router.get('/:id', getBookById); // Public - anyone can see book details

router.use('/:id/reviews', reviewRoutes);

export default router;
