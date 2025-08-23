import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import CreateBookForm from './components/books/CreateBookForm';

/* NOTE: pages are under pages/books/ */
import BooksPage from './pages/books/BooksPage';
import BookDetail from './pages/books/BookDetail';

import './styles/global.css';

/* --------------------------------------------------------
 *  Dashboard component (private area shown at “/”)
 * ------------------------------------------------------- */
const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showCreateBook, setShowCreateBook] = useState(false);

  /* -------------- Loader -------------- */
  if (loading) {
    return (
      <div className="page-container" style={{ display: 'grid', placeItems: 'center' }}>
        <h2>Loading your library…</h2>
      </div>
    );
  }

  /* -------------- Public (not logged-in) -------------- */
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          {showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
          )}
        </div>
      </div>
    );
  }

  /* -------------- Private dashboard -------------- */
  return (
    <div className="page-container">
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid var(--light-brown)',
        }}
      >
        <h1>BookReviews</h1>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/books">
            Community Books
          </Link>

          <span style={{ color: 'var(--text-light)' }}>
            Welcome, {user.display_name || user.username || 'User'}!
          </span>

          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateBook(!showCreateBook)}
        >
          {showCreateBook ? 'Hide Book Form' : 'Add New Book'}
        </button>
      </div>

      {showCreateBook && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <CreateBookForm
            onBookCreated={() => setShowCreateBook(false)}
            onCancel={() => setShowCreateBook(false)}
          />
        </div>
      )}

      {/* Dashboard content */}
      <div className="card">
        <h2>Your Reading Dashboard</h2>
        <p>Welcome to your personal book review sanctuary! This is where your reading journey begins.</p>
        {/* … rest of static dashboard copy … */}
      </div>
    </div>
  );
};

/* --------------------------------------------------------
 *  Main router
 * ------------------------------------------------------- */
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* Community catalogue */}
        <Route path="/books" element={<BooksPage />} />

        {/* Individual book detail */}
        <Route path="/books/:id" element={<BookDetail />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
