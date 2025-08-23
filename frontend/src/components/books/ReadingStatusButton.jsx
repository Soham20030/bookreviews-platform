import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ReadingStatusButton = ({ bookId, onStatusChange }) => {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const statusOptions = [
    { key: 'want_to_read', label: '📚 Want to Read', color: '#3498db', emoji: '📚' },
    { key: 'currently_reading', label: '📖 Currently Reading', color: '#f39c12', emoji: '📖' },
    { key: 'finished', label: '✅ Finished', color: '#27ae60', emoji: '✅' },
    { key: 'did_not_finish', label: '❌ Did Not Finish', color: '#e74c3c', emoji: '❌' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load current status
  useEffect(() => {
    if (!user) return;
    const loadStatus = async () => {
      try {
        const response = await api.getBookStatus(bookId);
        setCurrentStatus(response.readingStatus);
      } catch (err) {
        console.error('Failed to load reading status:', err);
      }
    };
    loadStatus();
  }, [bookId, user]);

  const handleStatusChange = async (newStatus) => {
    if (!user) return;
    setLoading(true);
    try {
      const dates = {};
      
      if (newStatus === 'currently_reading' && !currentStatus?.started_date) {
        dates.startedDate = new Date().toISOString().split('T')[0];
      }
      if (newStatus === 'finished') {
        dates.finishedDate = new Date().toISOString().split('T');
        if (!currentStatus?.started_date) {
          dates.startedDate = new Date().toISOString().split('T');
        }
      }

      const response = await api.setReadingStatus(bookId, newStatus, dates);
      setCurrentStatus(response.readingStatus);
      setShowDropdown(false);
      
      if (onStatusChange) {
        onStatusChange(response.readingStatus);
      }
    } catch (err) {
      console.error('Failed to update reading status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Remove this book from your library?')) return;
    setLoading(true);
    try {
      await api.removeFromLibrary(bookId);
      setCurrentStatus(null);
      setShowDropdown(false);
      if (onStatusChange) {
        onStatusChange(null);
      }
    } catch (err) {
      console.error('Failed to remove from library:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '1rem',
        background: 'var(--parchment)',
        borderRadius: '12px',
        border: '1px solid var(--light-brown)'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
        <p style={{
          color: 'var(--text-light)',
          fontSize: '0.9rem',
          margin: 0
        }}>
          Login to add books to your library
        </p>
      </div>
    );
  }

  const currentStatusOption = statusOptions.find(s => s.key === currentStatus?.status);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={loading}
        style={{
          background: currentStatusOption ? currentStatusOption.color : 'var(--primary-brown)',
          color: 'white',
          border: 'none',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.3s ease',
          minWidth: '200px',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {loading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Updating...
            </>
          ) : currentStatusOption ? (
            <>
              <span>{currentStatusOption.emoji}</span>
              {currentStatusOption.label.replace(/^.+ /, '')}
            </>
          ) : (
            <>
              <span>➕</span>
              Add to Library
            </>
          )}
        </span>
        
        <span style={{
          transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          fontSize: '0.8rem'
        }}>
          ▼
        </span>
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--paper-white)',
          border: '2px solid var(--light-brown)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(139, 69, 19, 0.15)',
          zIndex: 1000,
          marginTop: '0.5rem',
          overflow: 'hidden',
          animation: 'dropdownSlide 0.2s ease-out'
        }}>
          {statusOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => handleStatusChange(option.key)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                border: 'none',
                background: currentStatus?.status === option.key ? option.color + '20' : 'transparent',
                color: currentStatus?.status === option.key ? option.color : 'var(--text-dark)',
                textAlign: 'left',
                fontSize: '0.95rem',
                fontWeight: currentStatus?.status === option.key ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => {
                if (!loading && currentStatus?.status !== option.key) {
                  e.target.style.background = option.color + '10';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && currentStatus?.status !== option.key) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span>{option.emoji}</span>
              {option.label.replace(/^.+ /, '')}
              {currentStatus?.status === option.key && (
                <span style={{
                  marginLeft: 'auto',
                  color: option.color,
                  fontSize: '0.8rem'
                }}>
                  ✓
                </span>
              )}
            </button>
          ))}
          
          {currentStatus && (
            <>
              <div style={{
                height: '1px',
                background: 'var(--light-brown)',
                margin: '0.5rem 0'
              }} />
              <button
                onClick={handleRemove}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  border: 'none',
                  background: 'transparent',
                  color: '#e74c3c',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = '#ffebee';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <span>🗑️</span>
                Remove from Library
              </button>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .reading-status-button {
            min-width: 180px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ReadingStatusButton;
