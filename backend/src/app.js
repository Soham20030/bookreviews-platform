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

const app = express();

console.log('🔧 Setting up middleware...');

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'your-frontend-domain.com' 
    : 'http://localhost:3001',
  credentials: true
}));

console.log('✅ CORS configured for http://localhost:3001');

// Rate limiting - RELAXED for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,     // 15 minutes
  max: 1000,                    // Allow 1000 requests per 15 minutes (increased from 100)
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.round(15 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in development for auth routes
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reading-status', readingStatusRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/users', userProfileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check called');
  res.json({ status: 'OK', message: 'BookReviews API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 handler
app.use('/*catchall', (req, res) => {
  console.log(`❓ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

export default app;
