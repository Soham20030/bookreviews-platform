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
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [followingData, profileData] = await Promise.all([
        api.getUserFollowing(id),
        api.getUserProfile(id)
      ]);
      setFollowing(followingData.following || []);
      setProfileUser(profileData.user);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshFollowing = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--light-brown)',
          borderTop: '3px solid var(--primary-brown)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Loading following...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: '#ffebee',
          border: '2px solid #ffcdd2',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😞</div>
          <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Error Loading Following</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--primary-brown)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--paper-white)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--light-brown)',
        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)'
      }}>
        <Link
          to={`/users/${id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--primary-brown)',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--dark-brown)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--primary-brown)'}
        >
          ← Back to Profile
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: '2rem' }}>🌟</span>
          <div>
            <h1 style={{
              color: 'var(--dark-brown)',
              fontSize: '1.8rem',
              fontWeight: '700',
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              Following
            </h1>
            <p style={{
              color: 'var(--text-light)',
              fontSize: '1rem',
              margin: 0
            }}>
              {profileUser && `People ${profileUser.display_name || profileUser.username} follows`}
            </p>
          </div>
        </div>

        <div style={{
          background: 'var(--primary-brown)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '600',
          display: 'inline-block'
        }}>
          {following.length} Following
        </div>
      </div>

      {/* Following List */}
      {following.length === 0 ? (
        <div style={{
          background: 'var(--parchment)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '1px solid var(--light-brown)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
          <h3 style={{
            color: 'var(--dark-brown)',
            fontSize: '1.4rem',
            marginBottom: '0.5rem'
          }}>
            Not following anyone yet
          </h3>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            {profileUser && `${profileUser.display_name || profileUser.username} hasn't started following other readers yet.`}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {following.map((user, index) => (
            <div
              key={user.id}
              style={{
                background: 'var(--paper-white)',
                border: '1px solid var(--light-brown)',
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(139, 69, 19, 0.08)',
                animation: `slideIn 0.4s ease-out ${index * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 69, 19, 0.15)';
                e.currentTarget.style.borderColor = 'var(--primary-brown)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 69, 19, 0.08)';
                e.currentTarget.style.borderColor = 'var(--light-brown)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {/* User Avatar */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--primary-brown)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/users/${user.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'var(--dark-brown)',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      display: 'block',
                      marginBottom: '0.25rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-brown)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--dark-brown)'}
                  >
                    {user.display_name || user.username}
                  </Link>

                  {user.username && user.display_name && (
                    <p style={{
                      color: 'var(--text-light)',
                      fontSize: '0.9rem',
                      margin: 0,
                      marginBottom: '0.5rem'
                    }}>
                      @{user.username}
                    </p>
                  )}

                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-light)',
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    <span>{user.followers_count || 0} followers</span>
                    <span>{user.following_count || 0} following</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p style={{
                  color: 'var(--text-dark)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {user.bio}
                </p>
              )}

              {/* Follow Button */}
              <div style={{
                borderTop: '1px solid var(--light-brown)',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <FollowButton
                  profileUserId={user.id}
                  initialFollowingState={user.isFollowing || false}
                  onChange={refreshFollowing}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .following-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserFollowing;
