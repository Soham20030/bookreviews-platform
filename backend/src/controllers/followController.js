import pool from '../database/connection.js';

/* POST /api/follows/:userId  ── follow */
export const followUser = async (req, res) => {
  try {
    const followerId  = req.user.id;          // authenticated user
    const followingId = parseInt(req.params.userId, 10);

    if (followerId === followingId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    /* insert-or-ignore */
    await pool.query(
      `INSERT INTO follows (follower_id, following_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [followerId, followingId]
    );

    return res.json({ message: 'User followed' });
  } catch (err) {
    console.error('followUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* DELETE /api/follows/:userId  ── unfollow */
export const unfollowUser = async (req, res) => {
  try {
    const followerId  = req.user.id;
    const followingId = parseInt(req.params.userId, 10);

    await pool.query(
      `DELETE FROM follows
        WHERE follower_id  = $1
          AND following_id = $2`,
      [followerId, followingId]
    );

    return res.json({ message: 'User unfollowed' });
  } catch (err) {
    console.error('unfollowUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const rows = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url,
              f.created_at AS followed_at
         FROM follows f
         JOIN users u ON u.id = f.follower_id
        WHERE f.following_id = $1
        ORDER BY f.created_at DESC`,
      [userId]
    );

    return res.json({ followers: rows.rows });
  } catch (err) {
    console.error('getFollowers error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* GET /api/follows/:userId/following ─ list accounts :userId follows */
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const rows = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url,
              f.created_at AS followed_at
         FROM follows f
         JOIN users u ON u.id = f.following_id
        WHERE f.follower_id = $1
        ORDER BY f.created_at DESC`,
      [userId]
    );

    return res.json({ following: rows.rows });
  } catch (err) {
    console.error('getFollowing error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
