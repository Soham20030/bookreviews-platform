import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../components/reading-status.css';

const ReadingStatusButton = ({ bookId, onStatusChange }) => {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const statusOptions = [
    { key: 'want_to_read', label: '📚 Want to Read', color: '#3498db' },
    { key: 'currently_reading', label: '📖 Currently Reading', color: '#f39c12' },
    { key: 'finished', label: '✅ Finished', color: '#27ae60' },
    { key: 'did_not_finish', label: '❌ Did Not Finish', color: '#e74c3c' }
  ];

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
      
      // Auto-set dates based on status
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
      <div className="reading-status-login">
        <p>Login to add books to your library</p>
      </div>
    );
  }

  const currentOption = statusOptions.find(opt => opt.key === currentStatus?.status);

  return (
    <div className="reading-status-container">
      <button
        className={`reading-status-btn ${currentStatus ? 'has-status' : ''}`}
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={loading}
        style={currentOption ? { borderColor: currentOption.color } : {}}
      >
        {loading ? '...' : currentOption ? currentOption.label : '+ Add to Library'}
        <span className="dropdown-arrow">▼</span>
      </button>

      {showDropdown && (
        <div className="reading-status-dropdown">
          {statusOptions.map(option => (
            <button
              key={option.key}
              className={`status-option ${currentStatus?.status === option.key ? 'active' : ''}`}
              onClick={() => handleStatusChange(option.key)}
              style={{ borderLeft: `4px solid ${option.color}` }}
            >
              {option.label}
            </button>
          ))}
          
          {currentStatus && (
            <>
              <div className="dropdown-divider"></div>
              <button
                className="status-option remove"
                onClick={handleRemove}
              >
                🗑️ Remove from Library
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingStatusButton;
