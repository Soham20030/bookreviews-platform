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

      // Get recent activity (last 5 updated books)
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
      <div className="dashboard-widget library-stats-widget">
        <h3>📚 My Library</h3>
        <p>Login to track your reading progress</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-widget library-stats-widget">
        <h3>📚 My Library</h3>
        <div className="stats-loading">Loading your library...</div>
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
              <span className="stat-label">Total Books</span>
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

const getStatusLabel = (status) => {
  const labels = {
    currently_reading: '📖 Currently Reading',
    finished: '✅ Finished',
    want_to_read: '📚 Want to Read',
    did_not_finish: '❌ Did Not Finish'
  };
  return labels[status] || status;
};

export default LibraryStatsWidget;
