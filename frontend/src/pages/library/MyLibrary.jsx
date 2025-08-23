import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import ReadingStatusButton from '../../components/books/ReadingStatusButton';
import { useAuth } from '../../context/AuthContext';
import '../../components/books.css';
import '../../components/reading-status.css';
import '../../styles/pages/library.css';

const MyLibrary = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
  const [library, setLibrary] = useState({
    want_to_read: [],
    currently_reading: [],
    finished: [],
    did_not_finish: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'currently_reading');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { key: 'currently_reading', label: '📖 Currently Reading', color: '#f39c12' },
    { key: 'want_to_read', label: '📚 Want to Read', color: '#3498db' },
    { key: 'finished', label: '✅ Finished', color: '#27ae60' },
    { key: 'did_not_finish', label: '❌ Did Not Finish', color: '#e74c3c' }
  ];

  useEffect(() => {
    if (!user) return;
    loadLibrary();
  }, [user]);

  // Update tab when URL changes
  useEffect(() => {
    if (tabFromUrl && tabs.some(tab => tab.key === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const loadLibrary = async () => {
    try {
      setLoading(true);
      const response = await api.getAllReadingStatuses();
      setLibrary(response.library);
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (bookId, newStatus) => {
    // Update local state immediately for better UX
    setLibrary(prev => {
      const updated = { ...prev };
      
      // Remove from all categories
      Object.keys(updated).forEach(status => {
        updated[status] = updated[status].filter(book => book.book_id !== bookId);
      });
      
      // Add to new category if status is not null (removal)
      if (newStatus && updated[newStatus.status]) {
        const book = Object.values(prev).flat().find(book => book.book_id === bookId);
        if (book) {
          updated[newStatus.status].push({ ...book, ...newStatus });
        }
      }
      
      return updated;
    });
  };

  // Filter books based on search term
  const getFilteredBooks = (books) => {
    if (!searchTerm) return books;
    return books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="library-login-prompt">
          <h2>Please login to view your library</h2>
          <p>Track your reading progress and manage your personal book collection.</p>
          <Link to="/" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const totalBooks = Object.values(library).reduce((sum, books) => sum + books.length, 0);
  const filteredBooks = getFilteredBooks(library[activeTab] || []);
  const activeTabData = tabs.find(tab => tab.key === activeTab);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="library-header">
        <div className="library-header-content">
          <h1>My Library</h1>
          <p className="library-subtitle">
            {totalBooks} books in your personal collection
          </p>
        </div>
        
        <div className="library-header-actions">
          <Link to="/books" className="btn btn-secondary">
            Browse Books
          </Link>
          <Link to="/" className="btn btn-secondary">
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      {totalBooks > 0 && (
        <div className="library-search">
          <input
            type="text"
            placeholder="Search your library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      )}

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
          <div className="loading-spinner"></div>
          <p>Loading your library...</p>
        </div>
      ) : (
        <div className="library-content">
          {totalBooks === 0 ? (
            <div className="empty-library">
              <div className="empty-library-icon">📚</div>
              <h3>Your library is empty</h3>
              <p>Start building your personal collection by adding books to your library.</p>
              <Link to="/books" className="btn btn-primary">
                Browse Books
              </Link>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="empty-search-results">
              <h3>No books found</h3>
              <p>
                {searchTerm 
                  ? `No books in "${activeTabData?.label}" match "${searchTerm}"`
                  : `No books in "${activeTabData?.label}" yet.`
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="btn btn-secondary"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="library-results-summary">
                <span>
                  {filteredBooks.length} of {library[activeTab]?.length || 0} books
                  {searchTerm && ` matching "${searchTerm}"`}
                </span>
              </div>

              {/* Books Grid */}
              <div className="library-books-grid">
                {filteredBooks.map(book => (
                  <div key={book.book_id} className="library-book-card">
                    <Link to={`/books/${book.book_id}`} className="book-link">
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
                          {book.description.length > 100
                            ? `${book.description.substring(0, 100)}...`
                            : book.description
                          }
                        </p>
                      )}
                    </Link>

                    {/* Reading Dates */}
                    <div className="library-book-dates">
                      {book.started_date && (
                        <small>Started: {new Date(book.started_date).toLocaleDateString()}</small>
                      )}
                      {book.finished_date && (
                        <small>Finished: {new Date(book.finished_date).toLocaleDateString()}</small>
                      )}
                      {!book.started_date && !book.finished_date && (
                        <small>Added: {new Date(book.created_at || book.updated_at).toLocaleDateString()}</small>
                      )}
                    </div>

                    {/* Quick Status Change */}
                    <div className="library-book-actions">
                      <ReadingStatusButton
                        bookId={book.book_id}
                        onStatusChange={(status) => handleStatusChange(book.book_id, status)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
