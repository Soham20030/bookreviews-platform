import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import FollowButton from '../../components/social/FollowButton';
import { useAuth } from '../../context/AuthContext';

const UserFollowing = () => {
  const { id } = useParams();
  const { user: me } = useAuth();
  
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const data = await api.getUserFollowing(id);  // NOW ACTUALLY CALLS API
        setFollowing(data.following || []);
      } catch (err) {
        console.error('Error fetching following:', err);
        setError(err.message);
        setFollowing([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFollowing();
  }, [id]);

  const refreshFollowing = () => {
    const fetchFollowing = async () => {
      const data = await api.getUserFollowing(id);
      setFollowing(data.following || []);
    };
    fetchFollowing();
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading following...</p>;
  if (error) return <p style={{ padding: '2rem' }}>Error: {error}</p>;

  return (
    <div className="page-container">
      <Link to={`/users/${id}`} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
        ← Back to Profile
      </Link>
      
      <h2>Following</h2>
      
      {following.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '2rem' }}>
          Not following anyone yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {following.map(user => (
            <div key={user.id} className="book-card" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem'
            }}>
              <div style={{ flex: 1 }}>
                <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
                  <strong>{user.display_name || user.username}</strong>
                </Link>
                {user.bio && (
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    {user.bio}
                  </p>
                )}
              </div>
              {me && me.id !== user.id && (
                <FollowButton 
                  profileUserId={user.id} 
                  initialFollowingState={user.is_following}
                  onChange={refreshFollowing}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFollowing;
