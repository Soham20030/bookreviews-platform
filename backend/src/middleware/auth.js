import jwt  from 'jsonwebtoken';
import pool from '../database/connection.js';

/* ─────────────────────────  strict – token required ───────────────────────── */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token      = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result  = await pool.query(
      'SELECT id, username, email, display_name FROM users WHERE id = $1',
      [decoded.userId]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ message: 'User not found' });

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('auth middleware error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/* ─────────────────────────  optional – token if present ───────────────────── */
export const authenticateOptional = async (req, _res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];
  if (!token) return next();                       // anonymous allowed

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result  = await pool.query(
      'SELECT id, username, email, display_name FROM users WHERE id = $1',
      [decoded.userId]
    );
    if (result.rows.length) req.user = result.rows[0];
  } catch (err) {
    /* ignore bad token – behave as anonymous */
    console.warn('optionalAuth: invalid token ignored');
  }
  next();
};
