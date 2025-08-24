import pool from '../database/connection.js';

/* ───────────────────────── GET /api/users/:id/profile ───────────────────────── */
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const viewerId = req.user?.id || 0;

    // Get basic profile info - only using columns that exist
    const profileResult = await pool.query(
      `SELECT u.id,
              u.username,
              u.display_name,
              u.created_at,
              (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS followers_count,
              (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count,
              EXISTS (
                SELECT 1 FROM follows
                WHERE follower_id = $2 AND following_id = u.id
              ) AS is_following
       FROM users u
       WHERE u.id = $1`,
      [id, viewerId]
    );

    if (profileResult.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    // Get recent reviews - simplified query
    let recentReviews = [];
    try {
      const reviewsResult = await pool.query(
        `SELECT r.id,
                r.rating,
                r.created_at,
                b.id as book_id,
                b.title,
                b.author
         FROM reviews r
         JOIN books b ON b.id = r.book_id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC
         LIMIT 5`,
        [id]
      );
      recentReviews = reviewsResult.rows;
    } catch (reviewError) {
      console.log('Reviews query failed, returning empty array:', reviewError.message);
    }

    return res.json({
      user: profileResult.rows[0],
      recentReviews: recentReviews
    });
  } catch (err) {
    console.error('getUserProfile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ───────────────────────── PUT /api/users/profile ───────────────────────── */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { display_name } = req.body;

    // Only update fields that exist in the database
    const result = await pool.query(
      `UPDATE users
       SET display_name = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING id, username, display_name, created_at, updated_at`,
      [display_name, userId]
    );

    return res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (err) {
    console.error('updateUserProfile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ───────────────────────── GET /api/users/search ───────────────────────── */
export const searchUsers = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q || q.trim().length < 2) return res.json({ users: [] });

    // Simplified search without reading_status table references
    const result = await pool.query(
      `SELECT u.id,
              u.username,
              u.display_name,
              COUNT(DISTINCT r.id) AS total_reviews
       FROM users u
       LEFT JOIN reviews r ON r.user_id = u.id
       WHERE LOWER(u.username) LIKE LOWER($1)
          OR LOWER(u.display_name) LIKE LOWER($1)
       GROUP BY u.id
       ORDER BY total_reviews DESC
       LIMIT $2`,
      [`%${q}%`, limit]
    );

    return res.json({ users: result.rows });
  } catch (err) {
    console.error('searchUsers error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ───────────────────────── GET /api/users/:id/followers ───────────────────────── */
export const getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const viewerId = req.user?.id || 0;

    const result = await pool.query(
      `SELECT u.id,
              u.username,
              u.display_name,
              EXISTS (
                SELECT 1 FROM follows
                WHERE follower_id = $2 AND following_id = u.id
              ) AS is_following
       FROM follows f
       JOIN users u ON u.id = f.follower_id
       WHERE f.following_id = $1
       ORDER BY f.created_at DESC`,
      [id, viewerId]
    );

    return res.json({ followers: result.rows });
  } catch (err) {
    console.error('getUserFollowers error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ───────────────────────── GET /api/users/:id/following ───────────────────────── */
export const getUserFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const viewerId = req.user?.id || 0;

    const result = await pool.query(
      `SELECT u.id,
              u.username,
              u.display_name,
              EXISTS (
                SELECT 1 FROM follows
                WHERE follower_id = $2 AND following_id = u.id
              ) AS is_following
       FROM follows f
       JOIN users u ON u.id = f.following_id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC`,
      [id, viewerId]
    );

    return res.json({ following: result.rows });
  } catch (err) {
    console.error('getUserFollowing error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
