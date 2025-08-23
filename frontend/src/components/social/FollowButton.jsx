import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FollowButton = ({ profileUserId, initialFollowingState = false, onChange }) => {
  const { user } = useAuth();
  const myId     = user?.id;
  const disabled = !myId || myId === profileUserId;

  const [isFollowing, setIsFollowing] = useState(initialFollowingState);
  const [loading,     setLoading]     = useState(false);

  const toggle = async () => {
    if (disabled || loading) return;
    setLoading(true);
    
    try {
      if (isFollowing) {
        await api.unfollowUser(profileUserId);
        setIsFollowing(false);
      } else {
        await api.followUser(profileUserId);
        setIsFollowing(true);
      }
      
      // Notify parent to refresh profile data
      onChange?.();
      
    } catch (err) {
      console.error('follow/unfollow error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={disabled || loading}
      className={isFollowing ? 'btn btn-secondary' : 'btn btn-primary'}
      style={{ fontSize:'0.8rem', padding:'4px 10px' }}
    >
      {loading
        ? '…'
        : disabled
          ? '—'
          : isFollowing
            ? 'Following ✓'
            : 'Follow'}
    </button>
  );
};

export default FollowButton;
