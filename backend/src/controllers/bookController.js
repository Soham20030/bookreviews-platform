import pool from '../database/connection.js';

/* ─────────────────────────────────────────
 *  POST /api/books          (auth required)
 * ───────────────────────────────────────── */
export const createBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: 'Book title is required' });
    }

    /* Check for duplicates (title + author) */
    const dup = await pool.query(
      `SELECT id
         FROM books
        WHERE LOWER(title)  = LOWER($1)
          AND LOWER(COALESCE(author, '')) = LOWER(COALESCE($2, ''))`,
      [title, author || '']
    );
    if (dup.rows.length) {
      return res.status(400).json({
        message: 'This book already exists in our database',
        bookId: dup.rows[0].id,
      });
    }

    /* Insert */
    const result = await pool.query(
      `INSERT INTO books (title, author, genre, description, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, author, genre, description, created_by, created_at`,
      [title, author, genre, description, userId]
    );

    return res.status(201).json({
      message: 'Book created successfully',
      book: result.rows[0],
    });
  } catch (err) {
    console.error('Create book error:', err);
    return res.status(500).json({ message: 'Server error while creating book' });
  }
};

/* ─────────────────────────────────────────
 *  GET /api/books
 * ───────────────────────────────────────── */
export const getAllBooks = async (req, res) => {
  try {
    console.log('📋 Query params received:', req.query);
    const {
      search = '',
      genre = '',
      minRating = '',
      maxRating = '',
      sortBy = 'newest',
      limit = 20,
      offset = 0
    } = req.query;

    let sql = `
      SELECT b.*,
             u.username AS created_by_username,
             COUNT(r.id)::INTEGER AS review_count,
             ROUND(AVG(r.rating), 1) AS average_rating
        FROM books b
   LEFT JOIN users   u ON b.created_by = u.id
   LEFT JOIN reviews r ON b.id = r.book_id
    `;
    
    const conditions = [];
    const params = [];
    let paramCount = 0;

    // Text search across title, author, description
    if (search) {
      paramCount++;
      conditions.push(`
        (LOWER(b.title) LIKE LOWER($${paramCount}) OR
         LOWER(COALESCE(b.author, '')) LIKE LOWER($${paramCount}) OR
         LOWER(COALESCE(b.description, '')) LIKE LOWER($${paramCount}))
      `);
      params.push(`%${search}%`);
    }

    // Genre filter
    if (genre) {
      paramCount++;
      conditions.push(`LOWER(b.genre) = LOWER($${paramCount})`);
      params.push(genre);
    }

    // Rating range filter (needs subquery since we're grouping)
    if (minRating || maxRating) {
      const ratingConditions = [];
      if (minRating) {
        paramCount++;
        ratingConditions.push(`AVG(r.rating) >= $${paramCount}`);
        params.push(parseFloat(minRating));
      }
      if (maxRating) {
        paramCount++;
        ratingConditions.push(`AVG(r.rating) <= $${paramCount}`);
        params.push(parseFloat(maxRating));
      }
      // We'll handle this in HAVING clause after GROUP BY
    }

    // Add WHERE clause if we have conditions
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` GROUP BY b.id, u.username`;

    // Add HAVING for rating filters
    if (minRating || maxRating) {
      const havingConditions = [];
      if (minRating) havingConditions.push(`AVG(r.rating) >= ${parseFloat(minRating)}`);
      if (maxRating) havingConditions.push(`AVG(r.rating) <= ${parseFloat(maxRating)}`);
      sql += ` HAVING ${havingConditions.join(' AND ')}`;
    }

    // Sort options
    switch (sortBy) {
      case 'title':
        sql += ` ORDER BY b.title ASC`;
        break;
      case 'author':
        sql += ` ORDER BY b.author ASC`;
        break;
      case 'rating':
        sql += ` ORDER BY average_rating DESC NULLS LAST`;
        break;
      case 'popular':
        sql += ` ORDER BY review_count DESC`;
        break;
      case 'oldest':
        sql += ` ORDER BY b.created_at ASC`;
        break;
      default: // newest
        sql += ` ORDER BY b.created_at DESC`;
    }

    paramCount++;
    sql += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    paramCount++;
    sql += ` OFFSET $${paramCount}`;
    params.push(parseInt(offset));

    const { rows } = await pool.query(sql, params);

    // Get unique genres for filter dropdown
    const genresResult = await pool.query(`
      SELECT DISTINCT genre 
      FROM books 
      WHERE genre IS NOT NULL AND genre != '' 
      ORDER BY genre ASC
    `);

    return res.json({
      books: rows,
      total: rows.length,
      genres: genresResult.rows.map(row => row.genre)
    });
  } catch (err) {
    console.error('Get books error:', err);
    return res.status(500).json({ message: 'Server error while fetching books' });
  }
};


/* ─────────────────────────────────────────
 *  GET /api/books/:id
 * ───────────────────────────────────────── */
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const viewerId = req.user?.id || 0;  // Get current user ID

    // Get book info
    const bookResult = await pool.query(
      `SELECT b.*,
              COALESCE(AVG(r.rating), 0) AS average_rating,
              COUNT(r.id) AS review_count
         FROM books b
    LEFT JOIN reviews r ON r.book_id = b.id
        WHERE b.id = $1
     GROUP BY b.id`,
      [id]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

const reviewsResult = await pool.query(
  `SELECT r.id,
          r.rating,
          r.review_text,
          r.created_at,
          r.user_id,
          u.username,
          u.display_name,
          COALESCE(
            (SELECT COUNT(*)::INTEGER FROM review_likes WHERE review_id = r.id), 0
          ) AS like_count,
          COALESCE(
            (SELECT COUNT(*)::INTEGER FROM review_likes WHERE review_id = r.id AND user_id = $2), 0
          ) > 0 AS is_liked,
          EXISTS (
            SELECT 1 FROM follows 
            WHERE follower_id = $2 AND following_id = r.user_id
          ) AS is_following_reviewer
     FROM reviews r
     JOIN users u ON u.id = r.user_id
    WHERE r.book_id = $1
 ORDER BY r.created_at DESC`,
  [id, viewerId]
);


    const book = {
      ...bookResult.rows[0],
      average_rating: parseFloat(bookResult.rows.average_rating).toFixed(1)
    };

    return res.json({
      book,
      reviews: reviewsResult.rows
    });

  } catch (error) {
    console.error('Get book by ID error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
