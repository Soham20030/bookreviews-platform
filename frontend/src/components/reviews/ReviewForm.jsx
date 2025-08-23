import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ReviewForm = ({ 
  bookId, 
  reviewId = null, 
  initial = { rating: 0, review_text: '' }, 
  onSuccess, 
  onCancel 
}) => {
  const [rating, setRating] = useState(Number(initial.rating) || 0);
  const [body, setBody] = useState(initial.review_text || initial.body || '');
  const [err, setErr] = useState('');
  const [submitting, setSubmit] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const isEditing = !!reviewId;
  const charCount = body.length;
  const charLimit = 1000;
  const minCharLimit = 10;
  const isNearLimit = charCount > charLimit * 0.8;
  const isOverLimit = charCount > charLimit;
  const isTooShort = charCount < minCharLimit;

  // Update state when initial values change (for edit mode)
  useEffect(() => {
    setRating(Number(initial.rating) || 0);
    setBody(initial.review_text || initial.body || '');
  }, [initial.rating, initial.review_text, initial.body]);

  const submit = async (e) => {
    e.preventDefault();
    
    const numRating = Number(rating);
    const trimmedBody = body.trim();

    if (!numRating || numRating < 1 || numRating > 5) {
      setErr('Please select a rating from 1 to 5 stars');
      return;
    }

    if (trimmedBody.length < minCharLimit) {
      setErr(`Review must be at least ${minCharLimit} characters (current: ${trimmedBody.length})`);
      return;
    }

    if (trimmedBody.length > charLimit) {
      setErr(`Review must be ${charLimit} characters or less (current: ${trimmedBody.length})`);
      return;
    }

    setSubmit(true);
    setErr('');

    try {
      const payload = { rating: numRating, review_text: trimmedBody };
      const res = reviewId 
        ? await api.updateReview(bookId, reviewId, payload)
        : await api.createReview(bookId, payload);
      
      onSuccess(res.review || { ...payload, id: reviewId });
      
      if (!reviewId) {
        // Clear form for new review
        setRating(0);
        setBody('');
      }
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSubmit(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= rating;
      const isHovered = starValue <= hoveredStar;
      
      return (
        <button
          key={starValue}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            color: isActive || isHovered ? '#f39c12' : '#ddd',
            transition: 'all 0.2s ease',
            padding: '0.25rem',
            borderRadius: '4px',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
          disabled={submitting}
        >
          ★
        </button>
      );
    });
  };

  return (
    <form 
      onSubmit={submit} 
      style={{ 
        background: 'var(--paper-white)', 
        padding: '2rem', 
        borderRadius: '16px',
        border: '2px solid var(--light-brown)',
        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)',
        maxWidth: '100%',
        margin: '0 auto'
      }}
    >
      {/* Form Header */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <h3 style={{
            margin: 0,
            color: 'var(--dark-brown)',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}>
            {isEditing ? 'Edit Your Review' : 'Write Your Review'}
          </h3>
        </div>
        <p style={{
          color: 'var(--text-light)',
          fontSize: '0.95rem',
          margin: 0
        }}>
          Share your thoughts and help others discover great books
        </p>
      </div>

      {/* Rating Section */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '1rem',
          fontWeight: '600',
          color: 'var(--dark-brown)',
          fontSize: '1.1rem'
        }}>
          Your Rating
        </label>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          {renderStars()}
          {rating > 0 && (
            <span style={{
              marginLeft: '1rem',
              color: 'var(--text-light)',
              fontSize: '0.9rem'
            }}>
              {rating} out of 5 stars
            </span>
          )}
        </div>
        
        {rating === 0 && (
          <p style={{
            color: 'var(--text-light)',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            margin: '0.5rem 0 0 0'
          }}>
            Click on a star to rate this book
          </p>
        )}
      </div>

      {/* Review Text Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '1rem',
          fontWeight: '600',
          color: 'var(--dark-brown)',
          fontSize: '1.1rem'
        }}>
          Your Review
        </label>
        
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you think about this book? Share your thoughts, favorite moments, or what others should know before reading..."
          rows="6"
          style={{
            width: '100%',
            padding: '1.25rem',
            border: `2px solid ${isOverLimit ? '#d32f2f' : isTooShort && body.length > 0 ? '#f39c12' : 'var(--light-brown)'}`,
            borderRadius: '12px',
            resize: 'vertical',
            fontSize: '1rem',
            lineHeight: '1.6',
            fontFamily: 'inherit',
            transition: 'border-color 0.3s ease',
            minHeight: '150px',
            boxSizing: 'border-box',
            background: 'var(--parchment)'
          }}
          disabled={submitting}
          onFocus={(e) => {
            if (!isOverLimit) {
              e.target.style.borderColor = 'var(--primary-brown)';
              e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
            }
          }}
          onBlur={(e) => {
            if (!isOverLimit) {
              e.target.style.borderColor = 'var(--light-brown)';
              e.target.style.boxShadow = 'none';
            }
          }}
        />
        
        {/* Character Counter and Tips */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.75rem',
          fontSize: '0.85rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ color: 'var(--text-light)' }}>
            💡 Be specific and honest in your review
          </div>
          <div style={{
            color: isOverLimit ? '#d32f2f' : isNearLimit ? '#f39c12' : isTooShort && body.length > 0 ? '#f39c12' : 'var(--text-light)',
            fontWeight: isNearLimit || isTooShort ? '600' : 'normal'
          }}>
            {charCount}/{charLimit} 
            {isTooShort && body.length > 0 && (
              <span style={{ marginLeft: '0.5rem', color: '#f39c12' }}>
                (min {minCharLimit})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {err && (
        <div style={{
          background: '#ffebee',
          border: '1px solid #ffcdd2',
          color: '#d32f2f',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'shake 0.3s ease-in-out'
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          {err}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          type="submit"
          disabled={submitting || rating === 0 || isTooShort || isOverLimit}
          style={{
            background: submitting || rating === 0 || isTooShort || isOverLimit 
              ? 'var(--text-light)' 
              : 'var(--primary-brown)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: submitting || rating === 0 || isTooShort || isOverLimit ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            minWidth: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            if (!submitting && rating > 0 && !isTooShort && !isOverLimit) {
              e.target.style.background = 'var(--dark-brown)';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!submitting && rating > 0 && !isTooShort && !isOverLimit) {
              e.target.style.background = 'var(--primary-brown)';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {submitting && <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>}
          {submitting ? 'Publishing...' : isEditing ? 'Update Review' : 'Publish Review'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            style={{
              background: 'transparent',
              color: 'var(--text-light)',
              border: '2px solid var(--text-light)',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '150px'
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.target.style.borderColor = 'var(--primary-brown)';
                e.target.style.color = 'var(--primary-brown)';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.target.style.borderColor = 'var(--text-light)';
                e.target.style.color = 'var(--text-light)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-container {
            padding: 1.5rem;
          }
          
          .form-buttons {
            flex-direction: column;
          }
          
          .form-buttons button {
            width: 100%;
          }
          
          .star-rating {
            justify-content: center;
          }
        }
      `}</style>
    </form>
  );
};

export default ReviewForm;
