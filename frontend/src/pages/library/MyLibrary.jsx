import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../components/books.css';
import '../../components/reading-status.css';

const MyLibrary = () => {
  const { user } = useAuth();
  const [library, setLibrary] = useState({
    want_to_read: [],
    currently_reading: [],
    finished: [],
    did_not_finish: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('currently_reading');

  const tabs = [
    { key: 'currently_reading', label: '📖 Currently Reading', color: '#f39c12' },
    { key: 'want_to_read', label: '📚 Want to Read', color: '#3498db' },
    { key: 'finished', label: '✅ Finished', color: '#27ae60' },
    { key: 'did_not_finish', label: '❌ Did Not Finish', color: '#e74c3c' }
  ];

  useEffect(() => {
    if (!user) return;
    
    const loadLibrary = async () => {
      try {
        const response = await api.getAllReadingStatuses();
        setLibrary(response.library);
      } catch (err) {
        console.error('Failed to load library:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadLibrary();
  }, [user]);

  if (!user) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Please login to view your library</h2>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const totalBooks = Object.values(library).reduce((sum, books) => sum + books.length, 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="library-header">
        <div>
          <h1>My Library</h1>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>
            {totalBooks} books in your personal collection
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/books" className="btn btn-secondary">
            Browse Books
          </Link>
          <Link to="/" className="btn btn-secondary">
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="library-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`library-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? { borderBottomColor: tab.color } : {}}
          >
            {tab.label}
            <span className="tab-count">({library[tab.key]?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-state">
          <p>Loading your library...</p>
        </div>
      ) : (
        <div className="library-content">
          {library[activeTab]?.length === 0 ? (
            <div className="empty-library">
              <h3>No books in this section yet</h3>
              <p>
                {activeTab === 'currently_reading' && "Books you're currently reading will appear here."}
                {activeTab === 'want_to_read' && "Books you want to read will appear here."}
                {activeTab === 'finished' && "Books you've completed will appear here."}
                {activeTab === 'did_not_finish' && "Books you didn't finish will appear here."}
              </p>
              <Link to="/books" className="btn btn-primary">
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="books-grid">
              {library[activeTab]?.map(book => (
                <Link key={book.book_id} to={`/books/${book.book_id}`} className="book-card">
                  <h3 className="book-title">{book.title}</h3>
                  {book.author && <p className="book-author">by {book.author}</p>}
                  
                  <div className="book-meta">
                    <span>{book.review_count || 0} reviews</span>
                    {book.average_rating && (
                      <span>★ {book.average_rating}</span>
                    )}
                    {book.genre && (
                      <span className="book-genre">{book.genre}</span>
                    )}
                  </div>

                  {book.description && (
                    <p className="book-description">
                      {book.description.length > 120
                        ? `${book.description.substring(0, 120)}...`
                        : book.description
                      }
                    </p>
                  )}

                  <div className="library-book-footer">
                    {book.started_date && (
                      <small>Started: {new Date(book.started_date).toLocaleDateString()}</small>
                    )}
                    {book.finished_date && (
                      <small>Finished: {new Date(book.finished_date).toLocaleDateString()}</small>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
