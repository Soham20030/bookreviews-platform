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
    // Add validation for the dateString
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date received:', dateString);
      return 'Unknown date';
    }
    
    try {
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Unknown date';
    }
  };

  if (isEditing) {
    return (
      <CommentForm
        commentId={comment.id}
        initialComment={comment.comment_text}
        onCommentAdded={handleCommentUpdated}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div style={{
      background: 'var(--paper-white)',
      border: '1px solid var(--light-brown)',
      borderRadius: 'var(--radius-sm)',
      padding: '0.75rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '0.5rem'
      }}>
        <div>
          <Link 
            to={`/users/${comment.user_id}`}
            style={{ 
              textDecoration: 'none', 
              fontWeight: 'bold',
              color: 'var(--primary-brown)',
              fontSize: '0.9rem'
            }}
          >
            {comment.display_name || comment.username}
          </Link>
          <span style={{ 
            color: 'var(--text-light)', 
            fontSize: '0.8rem',
            marginLeft: '0.5rem'
          }}>
            {formatDate(comment.created_at)}
            {comment.updated_at !== comment.created_at && (
              <span> (edited)</span>
            )}
          </span>
        </div>

        {comment.is_my_comment && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleEdit}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-brown)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '0.25rem'
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
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '0.25rem'
              }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <p style={{ 
        margin: 0, 
        fontSize: '0.9rem',
        lineHeight: '1.4',
        whiteSpace: 'pre-wrap'
      }}>
        {comment.comment_text}
      </p>
    </div>
  );
};

export default CommentItem;
