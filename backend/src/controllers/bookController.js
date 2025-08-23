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
    const { search, limit = 20, offset = 0 } = req.query;

    let sql = `
      SELECT b.*,
             u.username AS created_by_username,
             COUNT(r.id)            AS review_count,
             ROUND(AVG(r.rating),1) AS average_rating
        FROM books b
   LEFT JOIN users   u ON b.created_by = u.id
   LEFT JOIN reviews r ON b.id = r.book_id
    `;
    const params = [];

    if (search) {
      sql += `
        WHERE to_tsvector(
                'english',
                b.title || ' ' || COALESCE(b.author,'') || ' ' || COALESCE(b.description,'')
              ) @@ plainto_tsquery('english', $1)
      `;
      params.push(search);
    }

    sql += `
      GROUP BY b.id, u.username
      ORDER BY b.created_at DESC
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const { rows } = await pool.query(sql, params);

    return res.json({ books: rows, total: rows.length });
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

    /* Book + aggregate stats */
    const bookSql = `
      SELECT b.*,
             u.username AS created_by_username,
             COUNT(r.id)            AS review_count,
             ROUND(AVG(r.rating),1) AS average_rating
        FROM books b
   LEFT JOIN users   u ON b.created_by = u.id
   LEFT JOIN reviews r ON b.id = r.book_id
       WHERE b.id = $1
    GROUP BY b.id, u.username
    `;
    const bookRes = await pool.query(bookSql, [id]);
    if (!bookRes.rows.length) {
      return res.status(404).json({ message: 'Book not found' });
    }

    /* Reviews for this book */
    const reviewSql = `
      SELECT r.*,
             u.username,
             u.display_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
       WHERE r.book_id = $1
    ORDER BY r.created_at DESC
    `;
    const revRes = await pool.query(reviewSql, [id]);

    return res.json({ book: bookRes.rows[0], reviews: revRes.rows });
  } catch (err) {
    console.error('Get book by ID error:', err);
    return res.status(500).json({ message: 'Server error while fetching book' });
  }
};
