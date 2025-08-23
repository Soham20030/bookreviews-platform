import jwt from 'jsonwebtoken';
import pool from '../database/connection.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    // Decode and log the token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 Decoded JWT payload:', decoded);
    console.log('🔍 Looking for user ID:', decoded.userId);
    
    // Check if user exists
    const result = await pool.query(
      'SELECT id, username, email, display_name FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    console.log('🔍 Database query result:', result.rows);
    
    if (result.rows.length === 0) {
      console.error('❌ No user found with ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = result.rows[0];
    console.log('✅ User found:', req.user);
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
