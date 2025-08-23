import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const LikeButton = ({ reviewId, initialLikeCount = 0, initialIsLiked = false }) => {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  const handleLikeToggle = async () => {
    if (!user) {
      alert('Please sign in to like reviews');
      return;
    }

    setLoading(true);
    setJustClicked(true);
    
    // Reset animation after a short delay
    setTimeout(() => setJustClicked(false), 300);

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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <button
        onClick={handleLikeToggle}
        disabled={loading || !user}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: user ? 'pointer' : 'not-allowed',
          padding: '0.5rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: isLiked ? '#e91e63' : 'var(--text-light)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: justClicked ? 'scale(0.95)' : 'scale(1)',
          position: 'relative',
          minWidth: '60px',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          if (user && !loading) {
            e.currentTarget.style.background = isLiked 
              ? 'rgba(233, 30, 99, 0.1)' 
              : 'var(--parchment)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (user && !loading) {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.transform = justClicked ? 'scale(0.95)' : 'scale(1)';
          }
        }}
      >
        {/* Heart Icon with Animation */}
        <span 
          style={{
            fontSize: '1.2rem',
            transform: justClicked ? 'scale(1.3)' : 'scale(1)',
            transition: 'transform 0.2s ease-out',
            filter: isLiked ? 'drop-shadow(0 0 8px rgba(233, 30, 99, 0.4))' : 'none'
          }}
        >
          {loading ? (
            <span style={{ 
              animation: 'pulse 1s infinite',
              color: 'var(--text-light)'
            }}>
              💗
            </span>
          ) : isLiked ? (
            '❤️'
          ) : (
            '🤍'
          )}
        </span>

        {/* Like Count */}
        <span style={{
          fontSize: '0.9rem',
          fontWeight: '600',
          color: isLiked ? '#e91e63' : 'var(--text-dark)',
          transition: 'color 0.3s ease'
        }}>
          {likeCount}
        </span>
      </button>

      {/* Tooltip for non-authenticated users */}
      {!user && (
        <div style={{
          position: 'absolute',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          opacity: 0,
          visibility: 'hidden',
          transform: 'translateY(-10px)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          top: '-45px',
          left: '50%',
          marginLeft: '-50px'
        }}
        className="like-tooltip"
      >
        Sign in to like reviews
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          marginLeft: '-5px',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid rgba(0, 0, 0, 0.8)'
        }} />
      </div>
      )}

      {/* Floating Like Animation */}
      {justClicked && isLiked && (
        <div style={{
          position: 'absolute',
          fontSize: '1rem',
          color: '#e91e63',
          animation: 'floatUp 1s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 100,
          left: '20px',
          top: '-20px'
        }}>
          +1 ❤️
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1.2); }
          75% { transform: scale(1.1); }
        }

        .like-button:hover .like-tooltip {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }

        @media (max-width: 768px) {
          .like-button {
            padding: 0.6rem 1rem;
            min-width: 70px;
          }
        }
      `}</style>
    </div>
  );
};

export default LikeButton;
