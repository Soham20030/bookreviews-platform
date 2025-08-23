import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const CommentSection = ({ reviewId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const fetchComments = async () => {
    try {
      const data = await api.getReviewComments(reviewId);
      setComments(data.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [...prev, newComment]);
    setShowForm(false);
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem',
        color: 'var(--text-light)'
      }}>
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid var(--light-brown)',
          borderTop: '2px solid var(--primary-brown)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        Loading comments...
      </div>
    );
  }

  return (
    <div className="comment-section" style={{
      marginTop: '1.5rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid var(--light-brown)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <h4 style={{
          color: 'var(--dark-brown)',
          fontSize: '1rem',
          fontWeight: '600',
          margin: 0
        }}>
          Comments ({comments.length})
        </h4>
        
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'var(--primary-brown)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--dark-brown)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--primary-brown)';
            }}
          >
            Add Comment
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showForm && (
        <div style={{ marginBottom: '1.5rem' }}>
          <CommentForm
            reviewId={reviewId}
            onCommentAdded={handleCommentAdded}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'var(--parchment)',
          borderRadius: '8px',
          border: '1px solid var(--light-brown)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
          <h5 style={{
            color: 'var(--dark-brown)',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            No comments yet.
          </h5>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '0.9rem',
            margin: 0
          }}>
            {user ? 'Be the first to share your thoughts!' : 'Sign in to join the conversation.'}
          </p>
        </div>
      ) : (
        <div className="comments-list">
          {/* ✅ FIX: Added key prop to each mapped comment */}
          {comments.map((comment) => (
            <CommentItem
              key={comment.id} // ✅ Added unique key prop
              comment={comment}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      )}

      {/* ✅ FIX: Moved CSS to regular style tag without jsx attribute */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .comment-section {
          margin-top: 1.5rem;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Responsive design using CSS classes instead of inline @media */
        @media (max-width: 768px) {
          .comment-section {
            margin-top: 1rem;
          }
          
          .comments-list {
            gap: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .comment-section h4 {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CommentSection;
