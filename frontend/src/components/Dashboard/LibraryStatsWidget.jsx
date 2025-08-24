import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LibraryStatsWidget = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    currentlyReading: 0,
    finished: 0,
    wantToRead: 0,
    didNotFinish: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadLibraryStats();
  }, [user]);

  const loadLibraryStats = async () => {
    try {
      const response = await api.getAllReadingStatuses();
      const library = response.library;
      
      const newStats = {
        totalBooks: Object.values(library).reduce((sum, books) => sum + books.length, 0),
        currentlyReading: library.currently_reading?.length || 0,
        finished: library.finished?.length || 0,
        wantToRead: library.want_to_read?.length || 0,
        didNotFinish: library.did_not_finish?.length || 0
      };
      setStats(newStats);

      // Get recent activity (last 3 updated books)
      const allBooks = Object.values(library).flat();
      const recent = allBooks
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 3);
      setRecentActivity(recent);
    } catch (err) {
      console.error('Failed to load library stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-brown) 0%, var(--dark-brown) 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(139, 69, 19, 0.3)',
        border: '1px solid var(--primary-brown)'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          animation: 'float 3s ease-in-out infinite'
        }}>
          📚
        </div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          Track Your Reading Journey
        </h3>
        <p style={{
          fontSize: '1rem',
          marginBottom: '2rem',
          opacity: 0.9,
          lineHeight: '1.5'
        }}>
          Login to track your reading progress and discover new books
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'white',
            color: 'var(--primary-brown)',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          🔐 Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        background: 'var(--paper-white)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid var(--light-brown)',
        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: 'var(--text-light)',
          fontSize: '1rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid var(--light-brown)',
            borderTop: '2px solid var(--primary-brown)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading your library...
        </div>
      </div>
    );
  }

  const statItems = [
    { key: 'totalBooks', label: 'Total Books', value: stats.totalBooks, emoji: '📚', color: '#3498db' },
    { key: 'currentlyReading', label: 'Currently Reading', value: stats.currentlyReading, emoji: '📖', color: '#f39c12' },
    { key: 'finished', label: 'Finished', value: stats.finished, emoji: '✅', color: '#27ae60' },
    { key: 'wantToRead', label: 'Want to Read', value: stats.wantToRead, emoji: '🎯', color: '#9b59b6' },
    { key: 'didNotFinish', label: 'Did Not Finish', value: stats.didNotFinish, emoji: '⏸️', color: '#e74c3c' }
  ];

  return (
    <div style={{
      background: 'var(--paper-white)',
      borderRadius: '20px',
      padding: '2rem',
      border: '1px solid var(--light-brown)',
      boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        <span style={{ fontSize: '1.5rem' }}>📊</span>
        <h3 style={{
          color: 'var(--dark-brown)',
          fontSize: '1.4rem',
          fontWeight: '700',
          margin: 0
        }}>
          My Library Stats
        </h3>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {statItems.map((item, index) => (
          <div
            key={item.key}
            style={{
              background: item.color + '10',
              border: `1px solid ${item.color}30`,
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${item.color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '1.8rem',
              marginBottom: '0.5rem'
            }}>
              {item.emoji}
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: item.color,
              marginBottom: '0.25rem'
            }}>
              {item.value}
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-light)',
              fontWeight: '500'
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
            <h4 style={{
              color: 'var(--dark-brown)',
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: 0
            }}>
              Recent Activity
            </h4>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {recentActivity.map((book, index) => (
              <Link
                key={book.id}
                to={`/books/${book.book_id}`} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  marginBottom: index < recentActivity.length - 1 ? '0.5rem' : 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--parchment)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--primary-brown)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  📖
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--dark-brown)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {book.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-light)'
                  }}>
                    {new Date(book.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <Link
          to="/library"
          style={{
            flex: 1,
            minWidth: '120px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'var(--primary-brown)',
            color: 'white',
            textDecoration: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--dark-brown)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--primary-brown)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          📚 View Library
        </Link>
        
        <Link
          to="/books"
          style={{
            flex: 1,
            minWidth: '120px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'none',
            color: 'var(--primary-brown)',
            textDecoration: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            border: '2px solid var(--primary-brown)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary-brown)';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
            e.target.style.color = 'var(--primary-brown)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🔍 Browse Books
        </Link>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
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
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default LibraryStatsWidget;
