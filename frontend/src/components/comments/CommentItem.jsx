import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, onCommentUpdated, onCommentDeleted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCommentUpdated = (updatedComment) => {
    onCommentUpdated(updatedComment);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setDeleting(true);
    try {
      await api.deleteComment(comment.id);
      onCommentDeleted(comment.id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date received:', dateString);
      return 'Unknown date';
    }

    try {
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInHours < 168) { // 7 days
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Unknown date';
    }
  };

  if (isEditing) {
    return (
      <CommentForm
        reviewId={comment.review_id}
        commentId={comment.id}
        initialComment={comment.comment_text}
        onCommentAdded={handleCommentUpdated}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="comment-item" style={{
      background: 'var(--parchment)',
      border: '1px solid var(--light-brown)',
      borderRadius: '8px',
      padding: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary-brown)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {(comment.display_name || comment.username || 'U').charAt(0).toUpperCase()}
          </div>
          
          <div>
            <Link
              to={`/users/${comment.user_id}`}
              style={{
                color: 'var(--primary-brown)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              {comment.display_name || comment.username}
            </Link>
            <div style={{
              color: 'var(--text-light)',
              fontSize: '0.75rem',
              marginTop: '0.25rem'
            }}>
              {formatDate(comment.created_at)}
            </div>
          </div>
        </div>

        {user && user.id === comment.user_id && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleEdit}
              disabled={deleting}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-brown)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                background: 'none',
                border: 'none',
                color: '#d32f2f',
                fontSize: '0.75rem',
                cursor: deleting ? 'not-allowed' : 'pointer',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <p style={{
        color: 'var(--text-dark)',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        margin: 0,
        whiteSpace: 'pre-wrap'
      }}>
        {comment.comment_text}
      </p>

      <style>{`
        .comment-item:hover {
          border-color: var(--primary-brown);
        }
        
        @media (max-width: 768px) {
          .comment-item {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CommentItem;
