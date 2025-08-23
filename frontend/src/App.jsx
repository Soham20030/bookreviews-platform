import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import CreateBookForm from './components/books/CreateBookForm';
import MyLibrary from './pages/library/MyLibrary';
import BooksPage from './pages/books/BooksPage';
import BookDetail from './pages/books/BookDetail';
import './styles/global.css';
import './components/dashboard-widgets.css';

/* --------------------------------------------------------
 * Library Stats Widget Component
 * ------------------------------------------------------- */
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

  React.useEffect(() => {
    if (!user) return;
    loadLibraryStats();
  }, [user]);

  const loadLibraryStats = async () => {
    try {
      const api = (await import('./services/api')).default;
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

  const getStatusLabel = (status) => {
    const labels = {
      currently_reading: '📖 Reading',
      finished: '✅ Finished',
      want_to_read: '📚 Want to Read',
      did_not_finish: '❌ Did Not Finish'
    };
    return labels[status] || status;
  };

  if (!user) {
    return (
      <div className="dashboard-widget library-stats-widget">
        <h3>📚 My Library</h3>
        <p style={{ color: 'var(--text-light)', margin: '1rem 0' }}>Login to track your reading progress</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-widget library-stats-widget">
        <h3>📚 My Library</h3>
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-light)' }}>
          Loading your library...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-widget library-stats-widget">
      <div className="widget-header">
        <h3>📚 My Library</h3>
        <Link to="/library" className="view-all-link">View All →</Link>
      </div>

      {stats.totalBooks === 0 ? (
        <div className="empty-library-widget">
          <p>Start building your personal library!</p>
          <Link to="/books" className="btn btn-primary btn-sm">Browse Books</Link>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="library-quick-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.totalBooks}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item highlight">
              <span className="stat-number">{stats.currentlyReading}</span>
              <span className="stat-label">Reading</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.finished}</span>
              <span className="stat-label">Finished</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.wantToRead}</span>
              <span className="stat-label">Want to Read</span>
            </div>
          </div>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div className="recent-library-activity">
              <h4>Recent Activity</h4>
              {recentActivity.map(book => (
                <div key={book.book_id} className="activity-item">
                  <Link to={`/books/${book.book_id}`} className="activity-book">
                    <span className="book-title">{book.title}</span>
                    <span className="book-status">{getStatusLabel(book.status)}</span>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="library-quick-actions">
            {stats.currentlyReading > 0 && (
              <Link to="/library?tab=currently_reading" className="btn btn-secondary btn-sm">
                Continue Reading ({stats.currentlyReading})
              </Link>
            )}
            <Link to="/books" className="btn btn-outline btn-sm">
              Add New Books
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

/* -------------------------------------------------------- 
 * Dashboard component (private area shown at "/")
 * ------------------------------------------------------- */
const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showCreateBook, setShowCreateBook] = useState(false);

  /* -------------- Loader -------------- */
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  /* -------------- Not logged in → Login/Register -------------- */
  if (!user) {
    return (
      <div className="page-container">
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
          {showRegister ? (
            <div>
              <RegisterForm />
              <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account?{' '}
                <button 
                  onClick={() => setShowRegister(false)} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary-brown)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Login here
                </button>
              </p>
            </div>
          ) : (
            <div>
              <LoginForm />
              <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Don't have an account?{' '}
                <button 
                  onClick={() => setShowRegister(true)} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary-brown)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Register here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* -------------- Logged in → Dashboard -------------- */
  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--dark-brown)' }}>
            Welcome back, {user.display_name || user.username}! 👋
          </h1>
          <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>
            Ready to dive into your next great read?
          </p>
        </div>
        
        <button 
          onClick={logout}
          className="btn btn-secondary"
          style={{ alignSelf: 'flex-start' }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div style={{
          background: 'var(--parchment)',
          border: '2px solid var(--light-brown)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'var(--dark-brown)', marginBottom: '1rem' }}>
            📚 Your Personal Book Review Sanctuary
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            Welcome to your personal book review sanctuary! This is where your reading journey begins.
            Discover new books, track your reading progress, and share your thoughts with fellow book lovers.
          </p>
        </div>

        {/* Action Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {/* Community Books Card */}
          <Link 
            to="/books" 
            className="btn btn-primary"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 'var(--spacing-xl)',
              minHeight: '120px',
              textDecoration: 'none',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>📚</span>
            <strong>Community Books</strong>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Discover and review books
            </span>
          </Link>

          {/* My Library Card */}
          <Link 
            to="/library" 
            className="btn btn-primary"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 'var(--spacing-xl)',
              minHeight: '120px',
              textDecoration: 'none',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>📖</span>
            <strong>My Library</strong>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Track your reading progress
            </span>
          </Link>

          {/* Add Book Card */}
          <button 
            onClick={() => setShowCreateBook(true)}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 'var(--spacing-xl)',
              minHeight: '120px',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>➕</span>
            <strong>Add New Book</strong>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Share a book with the community
            </span>
          </button>
        </div>

        {/* Library Stats Widget */}
        <LibraryStatsWidget />

        {/* Create Book Modal */}
        {showCreateBook && (
          <div className="modal-overlay" onClick={() => setShowCreateBook(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <CreateBookForm onSuccess={() => setShowCreateBook(false)} />
              <button 
                onClick={() => setShowCreateBook(false)}
                className="btn btn-secondary"
                style={{ marginTop: '1rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* --------------------------------------------------------
 * Main App Component
 * ------------------------------------------------------- */
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/library" element={<MyLibrary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
