import pool from '../database/connection.js';

/* ───────── POST /api/reviews/:reviewId/like ───────── */
export const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Check if review exists
    const reviewCheck = await pool.query(
      'SELECT id FROM reviews WHERE id = $1',
      [reviewId]
    );

    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already liked this review
    const existingLike = await pool.query(
      'SELECT id FROM review_likes WHERE user_id = $1 AND review_id = $2',
      [userId, reviewId]
    );

    if (existingLike.rows.length > 0) {
      return res.status(400).json({ message: 'Review already liked' });
    }

    // Add like
    await pool.query(
      'INSERT INTO review_likes (user_id, review_id) VALUES ($1, $2)',
      [userId, reviewId]
    );

    // Get updated like count
    const likeCount = await pool.query(
      'SELECT COUNT(*) as count FROM review_likes WHERE review_id = $1',
      [reviewId]
    );

    return res.json({ 
      message: 'Review liked',
      likeCount: parseInt(likeCount.rows[0].count),
      isLiked: true
    });
  } catch (err) {
    console.error('likeReview error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ───────── DELETE /api/reviews/:reviewId/like ───────── */
export const unlikeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Remove like
    const result = await pool.query(
      'DELETE FROM review_likes WHERE user_id = $1 AND review_id = $2',
      [userId, reviewId]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Review not liked yet' });
    }

    // Get updated like count
    const likeCount = await pool.query(
      'SELECT COUNT(*) as count FROM review_likes WHERE review_id = $1',
      [reviewId]
    );

    return res.json({ 
      message: 'Review unliked',
      likeCount: parseInt(likeCount.rows[0].count),
      isLiked: false
    });
  } catch (err) {
    console.error('unlikeReview error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ───────── GET /api/reviews/:reviewId/likes ───────── */
export const getReviewLikes = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const viewerId = req.user?.id || 0;

    // Get like count and check if current user liked it
    const result = await pool.query(
      `SELECT 
         COUNT(*) as like_count,
         BOOL_OR(rl.user_id = $2) as is_liked
       FROM review_likes rl
       WHERE rl.review_id = $1`,
      [reviewId, viewerId]
    );

    const { like_count, is_liked } = result.rows[0];

    return res.json({
      likeCount: parseInt(like_count) || 0,
      isLiked: !!is_liked
    });
  } catch (err) {
    console.error('getReviewLikes error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
