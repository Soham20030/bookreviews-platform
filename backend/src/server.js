import app from './app.js';
import dotenv from 'dotenv';
import pool from './database/connection.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Test database connection on startup
async function startServer() {
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully!');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
      console.log(`💾 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('💡 Make sure PostgreSQL is running and credentials are correct in .env');
    process.exit(1);
  }
}

startServer();


