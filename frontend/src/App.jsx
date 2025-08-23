import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import CreateBookForm from './components/books/CreateBookForm';
import './styles/global.css';

const AppContent = () => {
  const { user, loading, logout, error } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showCreateBook, setShowCreateBook] = useState(false);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh'
        }}>
          <h2 style={{ color: 'var(--primary-brown)', marginBottom: '1rem' }}>
            📚 Loading your library...
          </h2>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--light-brown)',
            borderTop: '3px solid var(--primary-brown)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('👤 Current user object:', user);
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

  return (
    <div className="page-container">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid var(--light-brown)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1>📚 BookReviews</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
<span style={{ color: 'var(--text-light)' }}>
  Welcome, {user.displayName || user.username || 'User'}!
</span>

          <button 
            onClick={logout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main>
        {/* Navigation/Action Buttons */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => setShowCreateBook(!showCreateBook)}
              className="btn btn-primary"
            >
              {showCreateBook ? '📖 Hide Book Form' : '📚 Add New Book'}
            </button>
            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              Share books with the community and write reviews
            </span>
          </div>
        </div>

        {/* Book Creation Form */}
        {showCreateBook && (
          <div className="card">
            <CreateBookForm 
              onBookCreated={(book) => {
                console.log('✅ New book added:', book);
                setShowCreateBook(false);
                // You can add a success notification here
                alert(`Book "${book.title}" added successfully!`);
              }}
              onCancel={() => setShowCreateBook(false)}
            />
          </div>
        )}

        {/* Dashboard Info */}
        <div className="card">
          <h2>Your Reading Dashboard</h2>
          <p>Welcome to your personal book review sanctuary! This is where your reading journey begins.</p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              padding: 'var(--spacing-md)',
              background: 'var(--parchment)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--light-brown)'
            }}>
              <h4 style={{ color: 'var(--primary-brown)', marginBottom: '0.5rem' }}>
                📚 Add Books
              </h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Create book entries by simply typing the title. No complex databases needed!
              </p>
            </div>
            
            <div style={{
              padding: 'var(--spacing-md)',
              background: 'var(--parchment)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--light-brown)'
            }}>
              <h4 style={{ color: 'var(--primary-brown)', marginBottom: '0.5rem' }}>
                ⭐ Write Reviews
              </h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Share your thoughts with star ratings and detailed reviews.
              </p>
            </div>
            
            <div style={{
              padding: 'var(--spacing-md)',
              background: 'var(--parchment)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--light-brown)'
            }}>
              <h4 style={{ color: 'var(--primary-brown)', marginBottom: '0.5rem' }}>
                🌟 Discover
              </h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Find new books through community-driven recommendations.
              </p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem',
            background: 'linear-gradient(135deg, var(--cream) 0%, var(--paper-aged) 100%)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gold)'
          }}>
            <h3 style={{ color: 'var(--dark-brown)', marginBottom: '0.5rem' }}>
              🚀 Coming Soon
            </h3>
            <ul style={{ color: 'var(--text-light)', paddingLeft: '1.2rem' }}>
              <li>Browse all books in the community</li>
              <li>Search and filter books by genre, author, and rating</li>
              <li>Follow other readers and see their activity</li>
              <li>Personal reading status tracking</li>
              <li>Like and comment on reviews</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
