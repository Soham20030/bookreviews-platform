import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // ✅ Added navigation import
import apiService from '../../services/api';

const CreateBookForm = ({ onBookCreated, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate(); // ✅ Added navigation hook
  
  const descriptionLength = watch('description')?.length || 0;
  const maxDescriptionLength = 1000;

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.createBook(data);
      console.log('✅ Book created:', response.book);
      
      if (onBookCreated) {
        onBookCreated(response.book);
      }
      
      // ✅ Added navigation to books page after successful creation
      navigate('/books', { 
        state: { 
          message: `"${response.book.title}" has been added successfully!` 
        }
      });
      
    } catch (error) {
      console.error('❌ Book creation failed:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem',
      background: 'var(--paper-white)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(139, 69, 19, 0.15)',
      border: '1px solid var(--light-brown)'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          animation: 'float 3s ease-in-out infinite'
        }}>
          📖
        </div>
        <h2 style={{
          color: 'var(--dark-brown)',
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Add New Book
        </h2>
        <p style={{
          color: 'var(--text-light)',
          fontSize: '1rem',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Share a book with the community
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#ffebee',
          border: '1px solid #ffcdd2',
          color: '#d32f2f',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        {/* Title Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.95rem'
          }}>
            Book Title *
          </label>
          <input
            type="text"
            {...register('title', { 
              required: 'Book title is required',
              minLength: {
                value: 1,
                message: 'Title must not be empty'
              }
            })}
            placeholder="Enter the book title"
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: `2px solid ${errors.title ? '#d32f2f' : 'var(--light-brown)'}`,
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              background: 'var(--parchment)',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
            onFocus={(e) => {
              if (!errors.title) {
                e.target.style.borderColor = 'var(--primary-brown)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.title) {
                e.target.style.borderColor = 'var(--light-brown)';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.title && (
            <p style={{
              color: '#d32f2f',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
              marginBottom: 0
            }}>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Author Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.95rem'
          }}>
            Author
          </label>
          <input
            type="text"
            {...register('author')}
            placeholder="Enter the author's name"
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: `2px solid ${errors.author ? '#d32f2f' : 'var(--light-brown)'}`,
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              background: 'var(--parchment)',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary-brown)';
              e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--light-brown)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Genre Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.95rem'
          }}>
            Genre
          </label>
          <input
            type="text"
            {...register('genre')}
            placeholder="e.g., Fiction, Mystery, Romance, Non-fiction"
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: '2px solid var(--light-brown)',
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              background: 'var(--parchment)',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary-brown)';
              e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--light-brown)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Description Field */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.95rem'
          }}>
            Description
          </label>
          <textarea
            {...register('description')}
            placeholder="Tell us about this book - plot, themes, or why others should read it..."
            rows="5"
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: `2px solid ${descriptionLength > maxDescriptionLength ? '#d32f2f' : 'var(--light-brown)'}`,
              borderRadius: '12px',
              fontSize: '1rem',
              lineHeight: '1.5',
              resize: 'vertical',
              transition: 'all 0.3s ease',
              background: 'var(--parchment)',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
            disabled={isLoading}
            onFocus={(e) => {
              if (descriptionLength <= maxDescriptionLength) {
                e.target.style.borderColor = 'var(--primary-brown)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (descriptionLength <= maxDescriptionLength) {
                e.target.style.borderColor = 'var(--light-brown)';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            fontSize: '0.8rem'
          }}>
            <span style={{ color: 'var(--text-light)' }}>
              💡 Optional but helpful for other readers
            </span>
            <span style={{
              color: descriptionLength > maxDescriptionLength ? '#d32f2f' : 'var(--text-light)',
              fontWeight: descriptionLength > maxDescriptionLength ? '600' : 'normal'
            }}>
              {descriptionLength}/{maxDescriptionLength}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            type="submit"
            disabled={isLoading || descriptionLength > maxDescriptionLength}
            style={{
              background: isLoading || descriptionLength > maxDescriptionLength 
                ? 'var(--text-light)' 
                : 'var(--primary-brown)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading || descriptionLength > maxDescriptionLength ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              minWidth: '150px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading && descriptionLength <= maxDescriptionLength) {
                e.target.style.background = 'var(--dark-brown)';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && descriptionLength <= maxDescriptionLength) {
                e.target.style.background = 'var(--primary-brown)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading && (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {isLoading ? 'Adding Book...' : 'Add Book'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                background: 'none',
                border: '2px solid var(--text-light)',
                color: 'var(--text-light)',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '150px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = 'var(--primary-brown)';
                  e.target.style.color = 'var(--primary-brown)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
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
      </form>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-buttons {
            flex-direction: column;
          }
          
          .form-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateBookForm;
