import pool from './connection.js';

async function testDatabase() {
  try {
    console.log('🔌 Testing database connection...');
    
    const client = await pool.connect();
    
    // Test basic connection
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connected!');
    console.log('📅 Current time:', timeResult.rows[0].current_time);
    
    // Check all tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Available tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    client.release();
    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    process.exit(0);
  }
}

testDatabase();
