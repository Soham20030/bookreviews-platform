import React, { useState } from 'react';
import api from '../../services/api';

const CommentForm = ({ reviewId, onCommentAdded, onCancel, initialComment = '', commentId = null }) => {
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!commentId;
  const charCount = comment.length;
  const charLimit = 500;
  const isNearLimit = charCount > charLimit * 0.8;
  const isOverLimit = charCount > charLimit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (comment.length > charLimit) {
      setError(`Comment must be ${charLimit} characters or less`);
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
      background: 'var(--paper-white)',
      border: '1px solid var(--light-brown)',
      borderRadius: '8px',
      padding: '1rem'
    }}>
      {error && (
        <div style={{
          background: '#ffebee',
          border: '1px solid #ffcdd2',
          color: '#d32f2f',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={isEditing ? 'Edit your comment...' : 'Share your thoughts...'}
        rows={3}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: `1px solid ${isOverLimit ? '#d32f2f' : 'var(--light-brown)'}`,
          borderRadius: '6px',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          resize: 'vertical',
          background: 'var(--parchment)',
          boxSizing: 'border-box',
          fontFamily: 'inherit'
        }}
        disabled={loading}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.75rem'
      }}>
        <span style={{
          fontSize: '0.75rem',
          color: isOverLimit ? '#d32f2f' : isNearLimit ? '#f39c12' : 'var(--text-light)'
        }}>
          {charCount}/{charLimit} characters
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                background: 'none',
                border: '1px solid var(--text-light)',
                color: 'var(--text-light)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading || !comment.trim() || isOverLimit}
            style={{
              background: loading || !comment.trim() || isOverLimit 
                ? 'var(--text-light)' 
                : 'var(--primary-brown)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '500',
              cursor: loading || !comment.trim() || isOverLimit ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {loading && (
              <div style={{
                width: '12px',
                height: '12px',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Comment'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
};

export default CommentForm;
