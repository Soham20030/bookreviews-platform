import pool from '../database/connection.js';

/* ───────── GET /api/reviews/:reviewId/comments ───────── */
export const getReviewComments = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const viewerId = req.user?.id || 0;

    const result = await pool.query(
      `SELECT c.id,
              c.comment_text,
              c.created_at,
              c.updated_at,
              c.user_id,
              u.username,
              u.display_name,
              (c.user_id = $2) AS is_my_comment
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.review_id = $1
       ORDER BY c.created_at ASC`,
      [reviewId, viewerId]
    );

    return res.json({ comments: result.rows });
  } catch (err) {
    console.error('getReviewComments error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ───────── POST /api/reviews/:reviewId/comments ───────── */
export const createComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment_text } = req.body;
    const userId = req.user.id;

    if (!comment_text || comment_text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    if (comment_text.length > 500) {
      return res.status(400).json({ message: 'Comment must be 500 characters or less' });
    }

    const result = await pool.query(
      `INSERT INTO comments (user_id, review_id, comment_text)
       VALUES ($1, $2, $3)
       RETURNING id, comment_text, created_at, updated_at, user_id`,
      [userId, reviewId, comment_text.trim()]
    );

    // Get the full comment with user info
    const commentResult = await pool.query(
      `SELECT c.id,
              c.comment_text,
              c.created_at,
              c.updated_at,
              c.user_id,
              u.username,
              u.display_name,
              true AS is_my_comment
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = $1`,
      [result.rows[0].id]
    );

    return res.status(201).json({ comment: commentResult.rows[0] });
  } catch (err) {
    console.error('createComment error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ───────── PUT /api/comments/:commentId ───────── */
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment_text } = req.body;
    const userId = req.user.id;

    if (!comment_text || comment_text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    if (comment_text.length > 500) {
      return res.status(400).json({ message: 'Comment must be 500 characters or less' });
    }

    // Check if user owns this comment
    const ownerCheck = await pool.query(
      'SELECT user_id FROM comments WHERE id = $1',
      [commentId]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (ownerCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'You can only edit your own comments' });
    }

    const result = await pool.query(
      `UPDATE comments
       SET comment_text = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING id, comment_text, created_at, updated_at, user_id`,
      [comment_text.trim(), commentId, userId]
    );

    // Get the full comment with user info
    const commentResult = await pool.query(
      `SELECT c.id,
              c.comment_text,
              c.created_at,
              c.updated_at,
              c.user_id,
              u.username,
              u.display_name,
              true AS is_my_comment
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = $1`,
      [result.rows[0].id]
    );

    return res.json({ comment: commentResult.rows[0] });
  } catch (err) {
    console.error('updateComment error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ───────── DELETE /api/comments/:commentId ───────── */
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Check if user owns this comment
    const ownerCheck = await pool.query(
      'SELECT user_id FROM comments WHERE id = $1',
      [commentId]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (ownerCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    await pool.query(
      'DELETE FROM comments WHERE id = $1 AND user_id = $2',
      [commentId, userId]
    );

    return res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('deleteComment error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
