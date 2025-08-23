import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom'; // ✅ Added useLocation to check for success message
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BookSearchFilter from '../../components/books/BookSearchFilter';

const BooksPage = () => {
  const { user } = useAuth();
  const location = useLocation(); // ✅ Added to receive navigation state
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // ✅ Added success message state

  // ✅ Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      // Clear the navigation state to prevent showing message on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Memoized callback to prevent infinite re-renders
  const handleFiltersChange = useCallback(async (filters) => {
    console.log('🔍 Applying filters:', filters);
    setLoading(true);
    setError('');
    
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
      
      console.log('📚 API response:', response);
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

  // Skeleton loading component
  const BookCardSkeleton = () => (
    <div style={{
      background: 'var(--paper-white)',
      border: '1px solid var(--light-brown)',
      borderRadius: '16px',
      padding: '1.5rem',
      height: '300px',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}>
      <div style={{
        height: '20px',
        background: 'var(--parchment)',
        borderRadius: '4px',
        marginBottom: '1rem'
      }} />
      <div style={{
        height: '16px',
        background: 'var(--parchment)',
        borderRadius: '4px',
        marginBottom: '1rem',
        width: '70%'
      }} />
      <div style={{
        height: '60px',
        background: 'var(--parchment)',
        borderRadius: '4px',
        marginBottom: '1rem'
      }} />
      <div style={{
        height: '16px',
        background: 'var(--parchment)',
        borderRadius: '4px',
        width: '50%'
      }} />
    </div>
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: 'var(--dark-brown)',
          marginBottom: '1rem'
        }}>
          Discover Books
        </h1>
        <p style={{
          color: 'var(--text-light)',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Discover and share amazing books with the community
        </p>
      </div>

      {/* ✅ Success Message Display */}
      {successMessage && (
        <div style={{
          background: '#e8f5e8',
          border: '2px solid #4caf50',
          color: '#2e7d32',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          fontSize: '0.9rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'slideIn 0.5s ease-out'
        }}>
          <span style={{ fontSize: '1.2rem' }}>✅</span>
          {successMessage}
        </div>
      )}

      {/* Search and Filter */}
      <BookSearchFilter
        onFiltersChange={handleFiltersChange}
        genres={genres}
        totalResults={books.length}
      />

      {/* Error State */}
      {error && (
        <div style={{
          background: '#ffebee',
          border: '2px solid #ffcdd2',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          color: '#d32f2f',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😞</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Oops! Something went wrong</h3>
          <p style={{ marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {[...Array(6)].map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && books.length === 0 && (
        <div style={{
          background: 'var(--parchment)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '1px solid var(--light-brown)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{
            color: 'var(--dark-brown)',
            fontSize: '1.4rem',
            marginBottom: '1rem'
          }}>
            No books found
          </h3>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Try adjusting your search criteria or be the first to add a new book to the community!
          </p>
          {user && (
            <Link
              to="/books/add"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--primary-brown)',
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--dark-brown)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--primary-brown)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ➕ Add a Book
            </Link>
          )}
        </div>
      )}

      {/* Books Grid */}
      {!loading && books.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {books.map((book, index) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'var(--paper-white)',
                  border: '1px solid var(--light-brown)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(139, 69, 19, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 69, 19, 0.15)';
                  e.currentTarget.style.borderColor = 'var(--primary-brown)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 69, 19, 0.08)';
                  e.currentTarget.style.borderColor = 'var(--light-brown)';
                }}
              >
                {/* Book Title */}
                <h3 style={{
                  color: 'var(--dark-brown)',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '2.6rem'
                }}>
                  {book.title}
                </h3>

                {/* Author */}
                {book.author && (
                  <p style={{
                    color: 'var(--primary-brown)',
                    fontSize: '1rem',
                    fontWeight: '500',
                    marginBottom: '0.75rem',
                    fontStyle: 'italic'
                  }}>
                    by {book.author}
                  </p>
                )}

                {/* Genre Badge */}
                {book.genre && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'var(--parchment)',
                    color: 'var(--primary-brown)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    border: '1px solid var(--light-brown)',
                    alignSelf: 'flex-start'
                  }}>
                    📚 {book.genre}
                  </div>
                )}

                {/* Description */}
                {book.description && (
                  <p style={{
                    color: 'var(--text-dark)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    marginBottom: '1.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    {book.description.length > 150 
                      ? `${book.description.substring(0, 150)}...` 
                      : book.description
                    }
                  </p>
                )}

                {/* Stats Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--light-brown)',
                  fontSize: '0.85rem',
                  marginTop: 'auto'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-light)'
                  }}>
                    <span style={{ color: '#f39c12', fontSize: '1rem' }}>★</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
                      {book.average_rating || 'No ratings'}
                    </span>
                  </div>
                  
                  <div style={{ color: 'var(--text-light)' }}>
                    {book.review_count || 0} review{book.review_count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BooksPage;
