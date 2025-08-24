import app from './app.js';
import pool from './database/connection.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('📊 Environment:', process.env.NODE_ENV);
    console.log('🔗 Database URL configured:', process.env.DATABASE_URL ? 'Yes' : 'No');
    
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully!');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('💡 Check Railway environment variables and database connection');
    process.exit(1);
  }
}

startServer();
