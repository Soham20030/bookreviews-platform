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

  if (loading) return <p>Loading comments...</p>;

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--light-brown)', paddingTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: 'var(--dark-brown)' }}>
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h4>
        {user && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
          >
            {showForm ? 'Cancel' : 'Add Comment'}
          </button>
        )}
      </div>

      {showForm && (
        <CommentForm 
          reviewId={reviewId}
          onCommentAdded={handleCommentAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      {comments.length === 0 ? (
        <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
          No comments yet. {user ? 'Be the first to comment!' : 'Sign in to add a comment.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
