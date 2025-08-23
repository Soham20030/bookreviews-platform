import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import FollowButton from '../../components/social/FollowButton';
import { useAuth } from '../../context/AuthContext';
import '../../styles/users/profile.css';

const UserProfile = () => {
  const { id } = useParams();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getUserProfile(id);
      setProfile(data.user);
      setRecentReviews(data.recentReviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [id]);

  if (loading)  return <p style={{ padding:'2rem' }}>Loading…</p>;
  if (error)    return <p style={{ padding:'2rem' }}>{error}</p>;
  if (!profile) return <p style={{ padding:'2rem' }}>User not found.</p>;

  const canFollow = me && me.id !== profile.id;

  return (
    <div className="page-container profile-page">
      <Link to="/books" className="btn btn-secondary" style={{ marginBottom:'1rem' }}>
        ← Community Books
      </Link>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="default-avatar">
          {profile.username[0].toUpperCase()}
        </div>

        <h1>{profile.display_name || profile.username}</h1>

        {profile.bio && (
          <p className="profile-bio">{profile.bio}</p>
        )}

        {/* Clickable follower/following counts */}
        <p className="profile-meta">
          <Link 
            to={`/users/${profile.id}/followers`} 
            style={{ 
              textDecoration: 'none', 
              color: 'var(--primary-brown)',
              fontWeight: '500'
            }}
          >
            {profile.followers_count} followers
          </Link>
          {' · '}
          <Link 
            to={`/users/${profile.id}/following`} 
            style={{ 
              textDecoration: 'none', 
              color: 'var(--primary-brown)',
              fontWeight: '500'
            }}
          >
            {profile.following_count} following
          </Link>
        </p>

        {canFollow && (
          <FollowButton
            profileUserId={profile.id}
            initialFollowingState={profile.is_following}
            onChange={fetchProfile}
          />
        )}
      </div>

      {/* Recent Reviews Section */}
      {recentReviews && recentReviews.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ 
            color: 'var(--dark-brown)', 
            borderBottom: '2px solid var(--light-brown)', 
            paddingBottom: '0.5rem',
            marginBottom: '1rem'
          }}>
            Recent Reviews
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentReviews.map(review => (
              <div 
                key={review.id} 
                style={{
                  background: 'var(--parchment)',
                  border: '1px solid var(--light-brown)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem' 
                }}>
                  <Link 
                    to={`/books/${review.book_id}`} 
                    style={{ textDecoration: 'none', color: 'var(--dark-brown)' }}
                  >
                    <strong>{review.title}</strong>
                    {review.author && (
                      <span style={{ color: 'var(--text-light)', marginLeft: '0.5rem' }}>
                        by {review.author}
                      </span>
                    )}
                  </Link>
                  <div style={{ 
                    background: 'var(--primary-brown)', 
                    color: 'var(--paper-white)', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem'
                  }}>
                    ★ {review.rating}
                  </div>
                </div>

                <p style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--text-light)', 
                  margin: 0,
                  textAlign: 'right'
                }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!recentReviews || recentReviews.length === 0) && (
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          padding: '2rem',
          background: 'var(--parchment)',
          border: '1px solid var(--light-brown)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h3 style={{ color: 'var(--text-light)' }}>No Reviews Yet</h3>
          <p style={{ color: 'var(--text-light)' }}>
            {me && me.id === profile.id 
              ? "Start reviewing books you've read!"
              : `${profile.display_name || profile.username} hasn't written any reviews yet.`}
          </p>
        </div>
      )}

      <hr style={{ margin:'3rem 0' }} />
      <p style={{ color:'var(--text-light)', textAlign:'center' }}>
        Reading statistics will appear here in future updates.
      </p>
    </div>
  );
};

export default UserProfile;
