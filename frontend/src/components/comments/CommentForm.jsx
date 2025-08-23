import React, { useState } from 'react';
import api from '../../services/api';

const CommentForm = ({ reviewId, onCommentAdded, onCancel, initialComment = '', commentId = null }) => {
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!commentId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (comment.length > 500) {
      setError('Comment must be 500 characters or less');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      if (isEditing) {
        result = await api.updateComment(commentId, comment.trim());
        onCommentAdded(result.comment);
      } else {
        result = await api.createComment(reviewId, comment.trim());
        onCommentAdded(result.comment);
      }
      
      setComment('');
      if (onCancel) onCancel();
    } catch (err) {
      setError(err.message || 'Failed to save comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      background: 'var(--parchment)', 
      padding: '1rem', 
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--light-brown)',
      marginBottom: '1rem'
    }}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        rows="3"
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid var(--light-brown)',
          borderRadius: 'var(--radius-sm)',
          resize: 'vertical',
          fontSize: '0.9rem'
        }}
        disabled={loading}
      />
      
      {error && (
        <p style={{ color: 'red', fontSize: '0.8rem', margin: '0.5rem 0 0' }}>
          {error}
        </p>
      )}
      
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginTop: '0.5rem',
        fontSize: '0.8rem'
      }}>
        <button
          type="submit"
          disabled={loading || !comment.trim()}
          className="btn btn-primary"
          style={{ padding: '0.25rem 0.75rem' }}
        >
          {loading ? 'Saving...' : isEditing ? 'Update' : 'Comment'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.75rem' }}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
      
      <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', margin: '0.5rem 0 0' }}>
        {comment.length}/500 characters
      </p>
    </form>
  );
};

export default CommentForm;
