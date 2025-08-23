import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import './styles/global.css';

const AppContent = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading your library...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <LoginForm />
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
        borderBottom: '2px solid var(--light-brown)'
      }}>
        <h1>📚 BookReviews</h1>
        <div>
          <span>Welcome, {user.displayName || user.username}!</span>
          <button 
            onClick={logout}
            className="btn btn-secondary"
            style={{ marginLeft: '1rem' }}
          >
            Logout
          </button>
        </div>
      </header>
      
      <main>
        <div className="card">
          <h2>Your Reading Dashboard</h2>
          <p>Welcome to your personal book review sanctuary! This is where your reading journey begins.</p>
          <p>Coming soon: Create reviews, build your library, and discover new books through our community.</p>
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
