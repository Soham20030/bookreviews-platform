import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReadingStatusButton from '../../components/books/ReadingStatusButton';
import FollowButton from '../../components/social/FollowButton';
import CommentSection from '../../components/comments/CommentSection';
import LikeButton from '../../components/reviews/LikeButton';
import { useAuth } from '../../context/AuthContext';
import '../../components/books.css';
import '../../components/reading-status.css';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  /* ───────── load book data ───────── */
  const fetchBookData = async () => {
    try {
      const res = await api.getBookById(id);
      setBook(res.book);
      setReviews((res.reviews || []).map(r => ({ ...r, editing: false })));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchBookData();
  }, [id]);

  /* ───────── helpers ───────── */
  const recalcStats = (list) => {
    const count = list.length;
    const avg = count ? (list.reduce((s, r) => s + r.rating, 0) / count).toFixed(1) : null;
    setBook(b => ({ ...b, review_count: count, average_rating: avg }));
  };

  const addReview = (newRev) => {
    setReviews(list => {
      const next = [newRev, ...list];
      recalcStats(next);
      return next;
    });
  };

  const updateReview = (revId, updated) => {
    setReviews(list => {
      const next = list.map(r => (r.id === revId ? { ...r, ...updated, editing: false } : r));
      recalcStats(next);
      return next;
    });
  };

  const toggleEdit = (rid) => setReviews(list => list.map(r => (r.id === rid ? { ...r, editing: !r.editing } : r)));

  const handleDelete = async (rid) => {
    if (!window.confirm('Delete this review?')) return;
    await api.deleteReview(id, rid);
    setReviews(list => {
      const next = list.filter(r => r.id !== rid);
      recalcStats(next);
      return next;
    });
  };

  const handleStatusChange = (status) => {
    console.log('Reading status updated:', status);
  };

  /* ───────── rendering ───────── */
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
          <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Book Not Found</h2>
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

  if (!book) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--light-brown)',
          borderTop: '4px solid var(--primary-brown)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Loading book details...
        </span>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '1rem',
      background: 'linear-gradient(135deg, var(--parchment) 0%, var(--paper-white) 100%)',
      minHeight: 'calc(100vh - 4rem)'
    }}>
      {/* Book Header */}
      <div style={{
        background: 'var(--paper-white)',
        borderRadius: '20px',
        padding: '2.5rem',
        marginBottom: '2rem',
        border: '1px solid var(--light-brown)',
        boxShadow: '0 8px 32px rgba(139, 69, 19, 0.12)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Book Cover Placeholder */}
          <div style={{
            width: '150px',
            height: '200px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary-brown), var(--dark-brown))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            fontWeight: 'bold',
            flexShrink: 0,
            boxShadow: '0 6px 20px rgba(139, 69, 19, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: '4rem', opacity: 0.8 }}>📖</span>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.3))'
            }} />
          </div>

          {/* Book Info */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{
              color: 'var(--dark-brown)',
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              lineHeight: '1.2'
            }}>
              {book.title}
            </h1>

            {book.author && (
              <p style={{
                color: 'var(--primary-brown)',
                fontSize: '1.3rem',
                fontWeight: '500',
                marginBottom: '1rem',
                fontStyle: 'italic'
              }}>
                by {book.author}
              </p>
            )}

            {/* Genre Badge */}
            {book.genre && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--parchment)',
                color: 'var(--primary-brown)',
                padding: '0.5rem 1rem',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                border: '1px solid var(--light-brown)'
              }}>
                📚 {book.genre}
              </div>
            )}

            {/* Book Stats */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem', color: '#f39c12' }}>⭐</span>
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-dark)'
                }}>
                  {book.average_rating || 'No ratings'}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>💬</span>
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-dark)'
                }}>
                  {book.review_count || 0} review{book.review_count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Reading Status Button */}
            <ReadingStatusButton 
              bookId={id} 
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div style={{
            background: 'var(--parchment)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--light-brown)',
            marginTop: '2rem'
          }}>
            <h3 style={{
              color: 'var(--dark-brown)',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📝 Description
            </h3>
            <p style={{
              color: 'var(--text-dark)',
              fontSize: '1rem',
              lineHeight: '1.7',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>
              {book.description}
            </p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div style={{
        background: 'var(--paper-white)',
        borderRadius: '20px',
        padding: '2.5rem',
        border: '1px solid var(--light-brown)',
        boxShadow: '0 8px 32px rgba(139, 69, 19, 0.12)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 style={{
            color: 'var(--dark-brown)',
            fontSize: '2rem',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            💭 Reviews
          </h2>
        </div>

        {/* Review Form */}
        {user && (
          <div style={{ marginBottom: '2rem' }}>
            <ReviewForm
              bookId={id}
              onSuccess={addReview}
            />
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--parchment)',
            borderRadius: '16px',
            border: '1px solid var(--light-brown)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{
              color: 'var(--dark-brown)',
              fontSize: '1.3rem',
              marginBottom: '0.5rem'
            }}>
              No reviews yet
            </h3>
            <p style={{
              color: 'var(--text-light)',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              {user ? "Be the first to share your thoughts about this book!" : "Sign in to write the first review."}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {reviews.map((r, index) => (
              <div
                key={r.id}
                style={{
                  background: 'var(--parchment)',
                  border: '1px solid var(--light-brown)',
                  borderRadius: '16px',
                  padding: '2rem',
                  transition: 'all 0.3s ease',
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {r.editing ? (
                  <ReviewForm
                    bookId={id}
                    reviewId={r.id}
                    initial={{ rating: r.rating, review_text: r.review_text }}
                    onSuccess={(updated) => updateReview(r.id, updated)}
                    onCancel={() => toggleEdit(r.id)}
                  />
                ) : (
                  <>
                    {/* Review Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'var(--primary-brown)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          {(r.display_name || r.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        
                        <div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap'
                          }}>
                            <Link
                              to={`/users/${r.user_id}`}
                              style={{
                                color: 'var(--primary-brown)',
                                textDecoration: 'none',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                              }}
                            >
                              {r.display_name || r.username}
                            </Link>
                            
                            {user && user.id !== r.user_id && (
                              <FollowButton
                                profileUserId={r.user_id}
                                initialFollowingState={r.is_following_reviewer || false}
                                onChange={fetchBookData}
                              />
                            )}
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginTop: '0.5rem'
                          }}>
                            {/* Star Rating */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              {Array.from({ length: 5 }, (_, i) => (
                                <span
                                  key={i}
                                  style={{
                                    color: i < r.rating ? '#f39c12' : '#ddd',
                                    fontSize: '1.1rem'
                                  }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            
                            <span style={{
                              color: 'var(--text-light)',
                              fontSize: '0.9rem'
                            }}>
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Review Actions */}
                      {user && user.id === r.user_id && (
                        <div style={{
                          display: 'flex',
                          gap: '0.5rem'
                        }}>
                          <button
                            onClick={() => toggleEdit(r.id)}
                            style={{
                              background: 'var(--primary-brown)',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            style={{
                              background: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div style={{
                      background: 'var(--paper-white)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '1px solid var(--light-brown)',
                      marginBottom: '1.5rem'
                    }}>
                      <p style={{
                        color: 'var(--text-dark)',
                        fontSize: '1rem',
                        lineHeight: '1.7',
                        margin: 0,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {r.review_text}
                      </p>
                    </div>

                    {/* Review Interactions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--light-brown)'
                    }}>
                      <LikeButton
                        reviewId={r.id}
                        initialLikeCount={r.like_count}
                        initialIsLiked={r.is_liked}
                      />
                    </div>

                    {/* Comments */}
                    <CommentSection reviewId={r.id} />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
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
          h1 {
            font-size: 2rem !important;
          }
          
          .book-cover {
            width: 120px;
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
};

export default BookDetail;
