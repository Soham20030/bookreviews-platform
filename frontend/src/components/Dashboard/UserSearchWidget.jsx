import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import FollowButton from '../social/FollowButton';

const UserSearchWidget = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounce, setDebounce] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  /* fire search 400ms after user stops typing */
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounce);
    setDebounce(setTimeout(() => runSearch(val), 400));
  };

  const runSearch = async (val) => {
    if (val.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const res = await api.searchUsers(val);
      setResults(res.users || []);
    } catch (err) {
      console.error('User search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div style={{
      background: 'var(--paper-white)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid var(--light-brown)',
      boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <span style={{ fontSize: '1.3rem' }}>👥</span>
        <h3 style={{
          color: 'var(--dark-brown)',
          fontSize: '1.2rem',
          fontWeight: '600',
          margin: 0
        }}>
          Find Readers
        </h3>
      </div>

      {/* Search Input */}
      <div style={{
        position: 'relative',
        marginBottom: '1.5rem'
      }}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for users..."
          style={{
            width: '100%',
            padding: '1rem 1rem 1rem 2.5rem',
            border: '2px solid var(--light-brown)',
            borderRadius: '12px',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            background: 'var(--parchment)',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary-brown)';
            e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--light-brown)';
            e.target.style.boxShadow = 'none';
          }}
        />
        
        {/* Search Icon */}
        <div style={{
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-light)',
          fontSize: '1rem',
          pointerEvents: 'none'
        }}>
          🔍
        </div>

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-light)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              borderRadius: '4px',
              padding: '0.25rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--primary-brown)';
              e.target.style.background = 'var(--parchment)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text-light)';
              e.target.style.background = 'none';
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Tip */}
      {!query && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem',
          background: 'var(--parchment)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: 'var(--text-light)',
          textAlign: 'center'
        }}>
          <span>💡</span>
          <span>Type at least 2 characters to search for users</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '1.5rem',
          color: 'var(--text-light)',
          fontSize: '0.9rem'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--light-brown)',
            borderTop: '2px solid var(--primary-brown)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Searching users...
        </div>
      )}

      {/* No Results */}
      {!loading && hasSearched && query.length >= 2 && results.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          color: 'var(--text-light)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😔</div>
          <p style={{
            fontSize: '0.9rem',
            margin: 0,
            fontStyle: 'italic'
          }}>
            No users found for "<strong>{query}</strong>"
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {results.map((user, index) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--light-brown)',
                background: 'var(--parchment)',
                transition: 'all 0.3s ease',
                animation: `slideIn 0.4s ease-out ${index * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-brown)';
                e.currentTarget.style.background = 'var(--paper-white)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--light-brown)';
                e.currentTarget.style.background = 'var(--parchment)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* User Avatar */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary-brown)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
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
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--primary-brown)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--dark-brown)';
                  }}
                >
                  {user.display_name || user.username}
                </Link>
                
                {user.username && user.display_name && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-light)',
                    marginTop: '0.25rem'
                  }}>
                    @{user.username}
                  </div>
                )}
              </div>

              {/* Follow Button */}
              <div style={{ flexShrink: 0 }}>
                <FollowButton
                  profileUserId={user.id}
                  initialFollowingState={user.isFollowing || false}
                />
              </div>
            </div>
          ))}
          
          {/* Show More Link if many results */}
          {results.length >= 5 && (
            <div style={{
              textAlign: 'center',
              paddingTop: '1rem'
            }}>
              <Link
                to={`/users/search?q=${encodeURIComponent(query)}`}
                style={{
                  color: 'var(--primary-brown)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--dark-brown)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--primary-brown)';
                }}
              >
                View all results →
              </Link>
            </div>
          )}
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
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .user-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .user-info {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default UserSearchWidget;
