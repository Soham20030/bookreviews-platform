import pool from '../database/connection.js';

/* ─────────────────────────────────────────
 *  POST /api/reading-status    (auth required)
 * ───────────────────────────────────────── */
export const setReadingStatus = async (req, res) => {
  try {
    const { bookId, status, startedDate, finishedDate } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['want_to_read', 'currently_reading', 'finished', 'did_not_finish'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid reading status' });
    }

    // Check if status already exists
    const existing = await pool.query(
      'SELECT id FROM reading_status WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing status
      result = await pool.query(
        `UPDATE reading_status 
         SET status = $1, started_date = $2, finished_date = $3, updated_at = NOW()
         WHERE user_id = $4 AND book_id = $5
         RETURNING *`,
        [status, startedDate || null, finishedDate || null, userId, bookId]
      );
    } else {
      // Insert new status
      result = await pool.query(
        `INSERT INTO reading_status (user_id, book_id, status, started_date, finished_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, bookId, status, startedDate || null, finishedDate || null]
      );
    }

    return res.json({
      message: 'Reading status updated successfully',
      readingStatus: result.rows[0]
    });
  } catch (err) {
    console.error('Set reading status error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ─────────────────────────────────────────
 *  GET /api/reading-status/book/:bookId
 * ───────────────────────────────────────── */
export const getBookStatus = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const { rows } = await pool.query(
      'SELECT * FROM reading_status WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
    );

    return res.json({ 
      readingStatus: rows.length > 0 ? rows[0] : null 
    });
  } catch (err) {
    console.error('Get book status error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ─────────────────────────────────────────
 *  DELETE /api/reading-status/:bookId
 * ───────────────────────────────────────── */
export const removeFromLibrary = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    await pool.query(
      'DELETE FROM reading_status WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
    );

    return res.json({ message: 'Book removed from library' });
  } catch (err) {
    console.error('Remove from library error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
