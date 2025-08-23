import pool from '../database/connection.js';

export const createBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: 'Book title is required' });
    }

    // Check if book already exists (by title and author)
    const existingBook = await pool.query(
      'SELECT id FROM books WHERE LOWER(title) = LOWER($1) AND LOWER(COALESCE(author, \'\')) = LOWER(COALESCE($2, \'\'))',
      [title, author || '']
    );

    if (existingBook.rows.length > 0) {
      return res.status(400).json({ 
        message: 'This book already exists in our database',
        bookId: existingBook.rows[0].id 
      });
    }

    // Create new book
    const result = await pool.query(`
      INSERT INTO books (title, author, genre, description, created_by) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, title, author, genre, description, created_by, created_at
    `, [title, author, genre, description, userId]);

    res.status(201).json({
      message: 'Book created successfully',
      book: result.rows[0]
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error while creating book' });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const { search, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT b.*, u.username as created_by_username,
             COUNT(r.id) as review_count,
             ROUND(AVG(r.rating), 1) as average_rating
      FROM books b
      LEFT JOIN users u ON b.created_by = u.id
      LEFT JOIN reviews r ON b.id = r.book_id
    `;
    
    let params = [];
    
    if (search) {
      query += ` WHERE to_tsvector('english', b.title || ' ' || COALESCE(b.author, '') || ' ' || COALESCE(b.description, '')) 
                 @@ plainto_tsquery('english', $1)`;
      params.push(search);
    }
    
    query += ` GROUP BY b.id, u.username ORDER BY b.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    res.json({
      books: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const bookQuery = `
      SELECT b.*, u.username as created_by_username,
             COUNT(r.id) as review_count,
             ROUND(AVG(r.rating), 1) as average_rating
      FROM books b
      LEFT JOIN users u ON b.created_by = u.id
      LEFT JOIN reviews r ON b.id = r.book_id
      WHERE b.id = $1
      GROUP BY b.id, u.username
    `;

    const bookResult = await pool.query(bookQuery, [id]);
    
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get reviews for this book
    const reviewsQuery = `
      SELECT r.*, u.username, u.display_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.book_id = $1
      ORDER BY r.created_at DESC
    `;

    const reviewsResult = await pool.query(reviewsQuery, [id]);

    res.json({
      book: bookResult.rows[0],
      reviews: reviewsResult.rows
    });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching book' });
  }
};
