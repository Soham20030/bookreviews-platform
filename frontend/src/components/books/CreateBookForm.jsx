import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import apiService from '../../services/api';
import '../../components/books.css';

const CreateBookForm = ({ onBookCreated, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.createBook(data);
      console.log('✅ Book created:', response.book);
      
      if (onBookCreated) {
        onBookCreated(response.book);
      }
    } catch (error) {
      console.error('❌ Book creation failed:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-book-form">
      <div className="book-form-header">
        <h3>📚 Add a New Book</h3>
        <p>Share a book with the community</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">Book Title *</label>
          <input
            type="text"
            className="form-input"
            {...register('title', { 
              required: 'Book title is required',
              minLength: { value: 2, message: 'Title must be at least 2 characters' }
            })}
            placeholder="Enter the book title"
          />
          {errors.title && (
            <span className="form-error">{errors.title.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-input"
            {...register('author')}
            placeholder="Author name (optional)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Genre</label>
          <select className="form-input" {...register('genre')}>
            <option value="">Select a genre (optional)</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows="4"
            {...register('description')}
            placeholder="Brief description of the book (optional)"
          />
        </div>

        {error && (
          <div className="form-error-box">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Adding Book...' : 'Add Book'}
          </button>
          
          {onCancel && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateBookForm;
