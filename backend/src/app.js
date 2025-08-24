import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import readingStatusRoutes from './routes/readingStatusRoutes.js';
import followRoutes from './routes/followRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

console.log('🔧 Setting up middleware...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://bookreviews-platform.vercel.app'
    : 'http://localhost:3001',
  credentials: true
}));

console.log(`✅ CORS configured for ${process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3001'}`);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.round(15 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV !== 'production' && req.path.startsWith('/api/auth/');
  }
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reading-status', readingStatusRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);
app.use('/api/books', reviewRoutes); 

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check called');
  res.json({ status: 'OK', message: 'BookReviews API is running!' });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // ✅ FIXED: Express 5 compatible 404 handler
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`❓ 404 - API route not found: ${req.method} ${req.originalUrl}`);
      res.status(404).json({ message: 'API route not found' });
    } else {
      next();
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

export default app;
