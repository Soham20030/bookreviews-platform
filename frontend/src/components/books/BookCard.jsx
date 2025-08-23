import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => (
  <Link
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
        flexDirection: 'column'
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
          {book.description.length > 120 
            ? `${book.description.substring(0, 120)}...` 
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
);

export default BookCard;
