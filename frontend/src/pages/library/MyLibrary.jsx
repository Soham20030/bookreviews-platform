import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import ReadingStatusButton from '../../components/books/ReadingStatusButton';
import { useAuth } from '../../context/AuthContext';

const MyLibrary = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
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
    { key: 'currently_reading', label: 'Currently Reading', emoji: '📖', color: '#f39c12' },
    { key: 'want_to_read', label: 'Want to Read', emoji: '📚', color: '#3498db' },
    { key: 'finished', label: 'Finished', emoji: '✅', color: '#27ae60' },
    { key: 'did_not_finish', label: 'Did Not Finish', emoji: '⏸️', color: '#e74c3c' }
  ];

  useEffect(() => {
    if (!user) return;
    loadLibrary();
  }, [user]);

  useEffect(() => {
    if (tabFromUrl && tabs.some(tab => tab.key === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const loadLibrary = async () => {
    try {
      setLoading(true);
      const response = await api.getAllReadingStatuses();
      setLibrary(response.library || {
        want_to_read: [],
        currently_reading: [],
        finished: [],
        did_not_finish: []
      });
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (bookId, newStatus) => {
    setLibrary(prev => {
      const updated = { ...prev };
      
      // Remove from all categories
      Object.keys(updated).forEach(status => {
        updated[status] = updated[status].filter(book => book.book_id !== bookId);
      });
      
      // Add to new category if status is not null
      if (newStatus && updated[newStatus.status]) {
        const book = Object.values(prev).flat().find(book => book.book_id === bookId);
        if (book) {
          updated[newStatus.status].push({ ...book, ...newStatus });
        }
      }
      
      return updated;
    });
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const getFilteredBooks = (books) => {
    if (!searchTerm) return books;
    return books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'var(--paper-white)',
          padding: '3rem 2rem',
          borderRadius: '20px',
          border: '1px solid var(--light-brown)',
          boxShadow: '0 8px 32px rgba(139, 69, 19, 0.15)',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{
            color: 'var(--dark-brown)',
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>
            Your Personal Library
          </h2>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Track your reading progress and manage your personal book collection.
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--primary-brown)',
              color: 'white',
              textDecoration: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--dark-brown)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--primary-brown)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🔐 Login to Access Library
          </Link>
        </div>
      </div>
    );
  }

  const totalBooks = Object.values(library).reduce((sum, books) => sum + books.length, 0);
  const activeTabData = tabs.find(tab => tab.key === activeTab);
  const activeBooks = library[activeTab] || [];
  const filteredBooks = getFilteredBooks(activeBooks);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: 'var(--dark-brown)',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          📚 My Library
        </h1>
        <p style={{
          color: 'var(--text-light)',
          fontSize: '1.1rem',
          marginBottom: '1rem'
        }}>
          {totalBooks} books in your personal collection
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '4rem 2rem',
          color: 'var(--text-light)',
          fontSize: '1.1rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--light-brown)',
            borderTop: '3px solid var(--primary-brown)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading your library...
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Search Bar */}
          <div style={{
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem auto'
          }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your books..."
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid var(--light-brown)',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: 'var(--paper-white)',
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
              
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)',
                fontSize: '1.2rem'
              }}>
                🔍
              </div>

              {searchTerm && (
                <button
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-light)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--parchment)';
                    e.target.style.color = 'var(--primary-brown)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = 'var(--text-light)';
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              minWidth: 'max-content',
              justifyContent: 'center'
            }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                const count = library[tab.key]?.length || 0;
                
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    style={{
                      background: isActive ? tab.color : 'transparent',
                      color: isActive ? 'white' : tab.color,
                      border: `2px solid ${tab.color}`,
                      padding: '0.75rem 1.5rem',
                      borderRadius: '25px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.background = tab.color + '10';
                      }
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.background = 'transparent';
                      }
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                    <span style={{
                      background: isActive ? 'rgba(255,255,255,0.2)' : tab.color + '20',
                      color: isActive ? 'white' : tab.color,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      minWidth: '20px'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Empty State */}
          {filteredBooks.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--parchment)',
              borderRadius: '20px',
              border: '1px solid var(--light-brown)',
              margin: '2rem 0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {searchTerm ? '🔍' : activeTabData?.emoji || '📚'}
              </div>
              <h3 style={{
                color: 'var(--dark-brown)',
                fontSize: '1.4rem',
                marginBottom: '1rem'
              }}>
                {searchTerm 
                  ? `No matches for "${searchTerm}"` 
                  : `No books in "${activeTabData?.label}" yet`
                }
              </h3>
              <p style={{
                color: 'var(--text-light)',
                fontSize: '1rem',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start building your personal collection by adding books to your library.'
                }
              </p>
              
              {searchTerm ? (
                <button
                  onClick={clearSearch}
                  style={{
                    background: 'var(--primary-brown)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--dark-brown)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--primary-brown)';
                  }}
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/books"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--primary-brown)',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--dark-brown)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--primary-brown)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🔍 Browse Books
                </Link>
              )}
            </div>
          )}

          {/* Books Grid */}
          {filteredBooks.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
              marginTop: '2rem'
            }}>
              {filteredBooks.map((book, index) => (
                <div
                  key={book.book_id}
                  style={{
                    background: 'var(--paper-white)',
                    border: '1px solid var(--light-brown)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(139, 69, 19, 0.08)',
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
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
                  {/* Book Title */}
                  <Link
                    to={`/books/${book.book_id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'var(--dark-brown)',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      lineHeight: '1.3',
                      display: 'block',
                      marginBottom: '0.75rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--primary-brown)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--dark-brown)';
                    }}
                  >
                    {book.title}
                  </Link>

                  {/* Author */}
                  {book.author && (
                    <p style={{
                      color: 'var(--primary-brown)',
                      fontSize: '1rem',
                      fontStyle: 'italic',
                      marginBottom: '1rem'
                    }}>
                      by {book.author}
                    </p>
                  )}

                  {/* Description */}
                  {book.description && (
                    <p style={{
                      color: 'var(--text-dark)',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {book.description.length > 100 
                        ? `${book.description.substring(0, 100)}...` 
                        : book.description
                      }
                    </p>
                  )}

                  {/* Reading Dates */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-light)'
                  }}>
                    {book.started_date && (
                      <div>
                        <strong>Started:</strong> {formatDate(book.started_date)}
                      </div>
                    )}
                    {book.finished_date && (
                      <div>
                        <strong>Finished:</strong> {formatDate(book.finished_date)}
                      </div>
                    )}
                  </div>

                  {/* Status Button */}
                  <div style={{
                    borderTop: '1px solid var(--light-brown)',
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <ReadingStatusButton
                      bookId={book.book_id}
                      onStatusChange={(newStatus) => handleStatusChange(book.book_id, newStatus)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <style jsx>{`
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
          .library-header h1 {
            font-size: 2rem;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .books-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .tabs-container {
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          .tab-button {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyLibrary;
