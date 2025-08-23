import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import FollowButton from '../../components/social/FollowButton';
import { useAuth } from '../../context/AuthContext';

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

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '70vh',
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
          Loading profile...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '70vh',
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
          <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Profile Not Found</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>{error}</p>
          <Link
            to="/books"
            style={{
              display: 'inline-block',
              background: 'var(--primary-brown)',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px'
            }}
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
          <h2 style={{ color: 'var(--dark-brown)' }}>User not found</h2>
        </div>
      </div>
    );
  }

  const canFollow = me && me.id !== profile.id;
  const isOwnProfile = me && me.id === profile.id;

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      {/* Profile Header */}
      <div style={{
        background: 'var(--paper-white)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--light-brown)',
        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Avatar */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-brown), var(--dark-brown))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            fontWeight: 'bold',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(139, 69, 19, 0.3)'
          }}>
            {(profile.display_name || profile.username || 'U').charAt(0).toUpperCase()}
          </div>

          {/* Profile Info */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              <h1 style={{
                color: 'var(--dark-brown)',
                fontSize: '2rem',
                fontWeight: '700',
                margin: 0
              }}>
                {profile.display_name || profile.username}
              </h1>

              {canFollow && (
                <FollowButton
                  profileUserId={profile.id}
                  initialFollowingState={profile.isFollowing || false}
                  onChange={fetchProfile}
                />
              )}
            </div>

            {profile.username && profile.display_name && (
              <p style={{
                color: 'var(--text-light)',
                fontSize: '1.1rem',
                margin: '0 0 1rem 0'
              }}>
                @{profile.username}
              </p>
            )}

            {profile.bio && (
              <p style={{
                color: 'var(--text-dark)',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                background: 'var(--parchment)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--light-brown)'
              }}>
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <Link
                to={`/users/${profile.id}/followers`}
                style={{
                  textDecoration: 'none',
                  color: 'var(--dark-brown)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  minWidth: '80px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--parchment)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--primary-brown)'
                }}>
                  {profile.followers_count || 0}
                </span>
                <span style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-light)'
                }}>
                  Followers
                </span>
              </Link>

              <Link
                to={`/users/${profile.id}/following`}
                style={{
                  textDecoration: 'none',
                  color: 'var(--dark-brown)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  minWidth: '80px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--parchment)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--primary-brown)'
                }}>
                  {profile.following_count || 0}
                </span>
                <span style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-light)'
                }}>
                  Following
                </span>
              </Link>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                minWidth: '80px'
              }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--primary-brown)'
                }}>
                  {recentReviews.length}
                </span>
                <span style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-light)'
                }}>
                  Reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div style={{
        background: 'var(--paper-white)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid var(--light-brown)',
        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <h2 style={{
            color: 'var(--dark-brown)',
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0
          }}>
            Recent Reviews
          </h2>
        </div>

        {recentReviews.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'var(--parchment)',
            borderRadius: '12px',
            border: '1px solid var(--light-brown)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{
              color: 'var(--dark-brown)',
              fontSize: '1.2rem',
              marginBottom: '0.5rem'
            }}>
              No reviews yet
            </h3>
            <p style={{
              color: 'var(--text-light)',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              {isOwnProfile 
                ? "Start reviewing books you've read!" 
                : `${profile.display_name || profile.username} hasn't written any reviews yet.`
              }
            </p>
          </div>
        ) : (
          <div className="reviews-grid">
            {recentReviews.map((review, index) => (
              <div
                key={review.id}
                className="review-card"
              >
                <div style={{ marginBottom: '1rem' }}>
                  <Link
                    to={`/books/${review.book_id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'var(--dark-brown)',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      lineHeight: '1.3',
                      display: 'block',
                      marginBottom: '0.5rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--primary-brown)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--dark-brown)';
                    }}
                  >
                    {review.book_title}
                  </Link>
                  
                  {review.book_author && (
                    <p style={{
                      color: 'var(--primary-brown)',
                      fontSize: '1rem',
                      fontStyle: 'italic',
                      margin: 0,
                      marginBottom: '1rem'
                    }}>
                      by {review.book_author}
                    </p>
                  )}
                  
                  {/* Rating and Date */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: 'var(--paper-white)',
                    borderRadius: '8px',
                    border: '1px solid var(--light-brown)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', gap: '0.1rem' }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < review.rating ? '#f39c12' : '#ddd',
                              fontSize: '1.2rem'
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span style={{
                        fontWeight: '600',
                        color: 'var(--text-dark)',
                        fontSize: '1rem'
                      }}>
                        {review.rating}/5
                      </span>
                    </div>
                    
                    <span style={{
                      color: 'var(--text-light)',
                      fontSize: '0.85rem'
                    }}>
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div style={{
                  background: 'var(--paper-white)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--light-brown)',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{
                    color: 'var(--dark-brown)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    💭 Review
                  </h4>
                  <p style={{
                    color: 'var(--text-dark)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {review.review_text}
                  </p>
                  
                  {/* Read More Link for Long Reviews */}
                  {review.review_text && review.review_text.length > 200 && (
                    <Link
                      to={`/books/${review.book_id}`}
                      style={{
                        color: 'var(--primary-brown)',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginTop: '0.5rem',
                        display: 'inline-block',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--dark-brown)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--primary-brown)';
                      }}
                    >
                      Read full review →
                    </Link>
                  )}
                </div>

                {/* Action Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--light-brown)'
                }}>
                  <Link
                    to={`/books/${review.book_id}`}
                    style={{
                      color: 'var(--primary-brown)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--dark-brown)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--primary-brown)';
                    }}
                  >
                    📖 View Book Details
                  </Link>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-light)'
                  }}>
                    {review.like_count > 0 && (
                      <span>❤️ {review.like_count}</span>
                    )}
                    {review.comment_count > 0 && (
                      <span>💬 {review.comment_count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ FIX: Regular <style> tag without jsx attribute */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .review-card {
          background: var(--parchment);
          border: 1px solid var(--light-brown);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          height: auto;
          box-shadow: 0 2px 8px rgba(139, 69, 19, 0.08);
          animation: slideIn 0.4s ease-out;
        }

        .review-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(139, 69, 19, 0.15);
          border-color: var(--primary-brown);
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
          .reviews-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
