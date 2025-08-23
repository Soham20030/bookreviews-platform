import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FollowButton = ({ profileUserId, initialFollowingState = false, onChange }) => {
  const { user } = useAuth();
  const myId = user?.id;
  const disabled = !myId || myId === profileUserId;
  
  const [isFollowing, setIsFollowing] = useState(initialFollowingState);
  const [loading, setLoading] = useState(false);
  const [hasLocalUpdate, setHasLocalUpdate] = useState(false); // Track local updates

  // Only update from props if we haven't made a local update recently
  useEffect(() => {
    if (!hasLocalUpdate) {
      setIsFollowing(initialFollowingState);
    }
  }, [initialFollowingState, hasLocalUpdate]);

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled || loading) return;

    const previousState = isFollowing;
    setLoading(true);
    setHasLocalUpdate(true); // Mark that we've made a local update
    
    // Optimistic update
    setIsFollowing(!isFollowing);
    
    try {
      if (isFollowing) {
        await api.unfollowUser(profileUserId);
      } else {
        await api.followUser(profileUserId);
      }
      
      // Wait longer before allowing parent to refresh and override our state
      setTimeout(() => {
        setHasLocalUpdate(false); // Allow props to update state again
        onChange?.(); // Refresh parent data
      }, 2000); // Wait 2 seconds for server to update
      
    } catch (err) {
      console.error('Follow/unfollow error:', err);
      // Revert on error
      setIsFollowing(previousState);
      setHasLocalUpdate(false);
      alert(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      style={{
        background: isFollowing ? 'transparent' : 'var(--primary-brown)',
        color: isFollowing ? 'var(--primary-brown)' : 'white',
        border: '2px solid var(--primary-brown)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        minWidth: '100px',
        height: '36px',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '12px',
            height: '12px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </>
      ) : isFollowing ? (
        '✓ Following'
      ) : (
        '+ Follow'
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default FollowButton;
