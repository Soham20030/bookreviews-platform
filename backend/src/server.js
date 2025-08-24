import app from './app.js';
import pool from './database/connection.js';
import createTables from './database/init.js'; 

// Add debug logging to verify environment variables
console.log('🔍 DEBUG - Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'MISSING');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'MISSING');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'MISSING');
console.log('PORT:', process.env.PORT || 'MISSING');

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
    await createTables();
    
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
