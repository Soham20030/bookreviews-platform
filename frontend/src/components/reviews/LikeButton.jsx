import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const LikeButton = ({ reviewId, initialLikeCount = 0, initialIsLiked = false }) => {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);

  const handleLikeToggle = async () => {
    if (!user) {
      alert('Please sign in to like reviews');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isLiked) {
        result = await api.unlikeReview(reviewId);
      } else {
        result = await api.likeReview(reviewId);
      }
      
      setLikeCount(result.likeCount);
      setIsLiked(result.isLiked);
    } catch (err) {
      console.error('Like toggle failed:', err);
      alert('Failed to update like. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={loading || !user}
      style={{
        background: 'none',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        cursor: user ? 'pointer' : 'not-allowed',
        color: isLiked ? '#d32f2f' : 'var(--text-light)',
        fontSize: '0.9rem',
        padding: '0.25rem 0.5rem',
        borderRadius: 'var(--radius-sm)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (user && !loading) {
          e.target.style.background = 'var(--parchment)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'none';
      }}
    >
      <span style={{ fontSize: '1rem' }}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span>{likeCount}</span>
      {loading && <span style={{ fontSize: '0.8rem' }}>...</span>}
    </button>
  );
};

export default LikeButton;
