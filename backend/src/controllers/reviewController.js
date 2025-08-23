import pool from '../database/connection.js';

/* ─────────────────────────────────────────
 * POST /api/books/:id/reviews (auth required)
 * ───────────────────────────────────────── */
export const createReview = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    // ✅ FIX: Changed from "body" to "review_text" to match frontend
    const { rating, review_text } = req.body;
    const userId = req.user.id;

    /* ---------- simple validation ---------- */
    // ✅ FIX: Updated validation to use "review_text"
    if (!rating || rating < 1 || rating > 5 || !review_text || review_text.length < 10) {
      return res.status(400).json({ message: 'Invalid review data' });
    }

    /* ---------- insert review ---------- */
    const insertSql = `
      INSERT INTO reviews (user_id, book_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING id, rating, review_text, created_at
    `;

    const { rows } = await pool.query(insertSql, [
      userId,
      bookId,
      rating,
      review_text, // ✅ FIX: Use review_text instead of body
    ]);

    /* ---------- shape response ---------- */
    const saved = {
      id: rows[0].id,
      rating: rows.rating, // ✅ FIX: Added  index
      review_text: rows.review_text, // ✅ FIX: Keep consistent field names
      created_at: rows.created_at,
      user_id: userId,
      username: req.user.username,
      display_name: req.user.display_name,
    };

    return res.status(201).json({
      message: 'Review created successfully',
      review: saved,
    });

  } catch (err) {
    console.error('Create review error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateReview = async (req, res) => {
  const { id: bookId, rid } = req.params;
  // ✅ FIX: Changed from "body" to "review_text"
  const { rating, review_text } = req.body;
  const userId = Number(req.user.id);

  /* 1 – basic validation */
  // ✅ FIX: Updated validation to use "review_text"
  if (!rating || rating < 1 || rating > 5 || !review_text || review_text.length < 10) {
    return res.status(400).json({ message: 'Invalid review data' });
  }

  try {
    /* 2 – ownership check */
    const own = await pool.query(
      'SELECT user_id FROM reviews WHERE id = $1 AND book_id = $2',
      [rid, bookId]
    );

    if (!own.rows.length || Number(own.rows[0].user_id) !== userId) {
      return res.status(403).json({ message: 'Not your review' });
    }

    /* 3 – update */
    await pool.query(
      `UPDATE reviews 
       SET rating = $1, 
           review_text = $2, 
           updated_at = NOW() 
       WHERE id = $3`,
      [rating, review_text, rid] // ✅ FIX: Use review_text instead of body
    );

    res.json({ 
      message: 'Review updated', 
      review: { 
        id: rid, 
        rating, 
        review_text // ✅ FIX: Return review_text for consistency
      } 
    });

  } catch (err) {
    console.error('Update review err:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReview = async (req, res) => {
  const { id: bookId, rid } = req.params;
  const userId = Number(req.user.id);

  try {
    const { rows } = await pool.query(
      'SELECT user_id FROM reviews WHERE id = $1 AND book_id = $2',
      [rid, bookId]
    );

    if (!rows.length || Number(rows[0].user_id) !== userId) {
      return res.status(403).json({ message: 'Not your review' });
    }

    await pool.query('DELETE FROM reviews WHERE id = $1', [rid]);

    return res.json({ message: 'Review deleted' });

  } catch (err) {
    console.error('Delete review err:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
