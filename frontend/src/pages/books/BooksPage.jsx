import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BookSearchFilter from '../../components/books/BookSearchFilter';
import '../../components/books.css';
import '../../components/search-filter.css';

const BooksPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Memoized callback to prevent infinite re-renders
 // In BooksPage.jsx - update handleFiltersChange
const handleFiltersChange = useCallback(async (filters) => {
  console.log('🔍 Applying filters:', filters); // Add this
  setLoading(true);
  try {
    const response = await api.getAllBooks({
      search: filters.search,
      genre: filters.genre,
      minRating: filters.minRating,
      maxRating: filters.maxRating,
      sortBy: filters.sortBy,
      limit: 50,
      page: 1
    });
    
    console.log('📚 API response:', response); // Add this
    setBooks(response.books || []);
    if (response.genres) {
      setGenres(response.genres);
    }
  } catch (err) {
    console.error('❌ Filter error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, []);


  // Initial load
  useEffect(() => {
    handleFiltersChange({
      search: '',
      genre: '',
      minRating: '',
      maxRating: '',
      sortBy: 'newest'
    });
  }, [handleFiltersChange]);

  if (error) {
    return (
      <div className="page-container">
        <p style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="books-header">
        <div>
          <h1>Community Books</h1>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>
            Discover and share amazing books with the community
          </p>
        </div>
        
        <Link to="/" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Search & Filters */}
      <BookSearchFilter
        onFiltersChange={handleFiltersChange}
        genres={genres}
        totalResults={books.length}
      />

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>Searching books...</p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && (
        <div className="books-grid">
          {books.length === 0 ? (
            <div className="no-results">
              <h3>No books found</h3>
              <p>Try adjusting your search criteria or add a new book to get started!</p>
            </div>
          ) : (
            books.map(book => (
              <Link key={book.id} to={`/books/${book.id}`} className="book-card">
                <h3 className="book-title">{book.title}</h3>
                {book.author && <p className="book-author">by {book.author}</p>}
                
                <div className="book-meta">
                  <span>{book.review_count || 0} reviews</span>
                  {book.average_rating && (
                    <span>★ {book.average_rating}</span>
                  )}
                  {book.genre && (
                    <span className="book-genre">{book.genre}</span>
                  )}
                </div>

                {book.description && (
                  <p className="book-description">
                    {book.description.length > 150
                      ? `${book.description.substring(0, 150)}...`
                      : book.description
                    }
                  </p>
                )}

                <div className="book-footer">
                  <small>Added by {book.created_by_username}</small>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
