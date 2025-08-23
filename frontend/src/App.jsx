import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import CreateBookForm from './components/books/CreateBookForm';
import MyLibrary from './pages/library/MyLibrary';
import BooksPage from './pages/books/BooksPage';
import BookDetail from './pages/books/BookDetail';
import UserProfile from './pages/users/UserProfile';
import UserSearchWidget from './components/Dashboard/UserSearchWidget';
import UserFollowers from './pages/users/UserFollowers';
import UserFollowing from './pages/users/UserFollowing';
import LibraryStatsWidget from './components/Dashboard/LibraryStatsWidget';
import './styles/global.css';

/* -------------------------------------------------------- * 
 * Protected Route Component - Redirects non-authenticated users
 * ------------------------------------------------------- */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--light-brown)',
          borderTop: '3px solid var(--primary-brown)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Checking authentication...
        </span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

/* -------------------------------------------------------- * 
 * Navigation Header Component
 * ------------------------------------------------------- */
const NavigationHeader = () => {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
    navigate('/auth', { replace: true });
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, var(--primary-brown) 0%, var(--dark-brown) 100%)',
      boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          📚 BookReviews
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {user && (
            <>
              <Link
                to="/books"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Browse Books
              </Link>

              <Link
                to="/library"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                My Library
              </Link>

              {/* ✅ Added Add Book link to navbar */}
              <Link
                to="/books/add"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Add Book
              </Link>
            </>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                to={`/users/${user.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                </div>
                {user.display_name || user.username}
              </Link>
              
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              style={{
                background: 'white',
                color: 'var(--primary-brown)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--parchment)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
              }}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu" style={{
          background: 'var(--dark-brown)',
          padding: '1rem',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {user ? (
              <>
                <Link
                  to="/books"
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.5rem'
                  }}
                >
                  Browse Books
                </Link>

                <Link
                  to="/library"
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.5rem'
                  }}
                >
                  My Library
                </Link>

                {/* ✅ Added Add Book link to mobile menu */}
                <Link
                  to="/books/add"
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.5rem'
                  }}
                >
                  Add Book
                </Link>

                <Link
                  to={`/users/${user.id}`}
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.5rem'
                  }}
                >
                  My Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setShowMobileMenu(false)}
                style={{
                  background: 'white',
                  color: 'var(--primary-brown)',
                  textDecoration: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  display: 'block'
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

/* -------------------------------------------------------- * 
 * Auth Container Component
 * ------------------------------------------------------- */
const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--parchment) 0%, var(--paper-white) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
        
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem',
          background: 'var(--paper-white)',
          borderRadius: '12px',
          border: '1px solid var(--light-brown)'
        }}>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '0.9rem',
            margin: '0 0 0.5rem 0'
          }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-brown)',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------- * 
 * Dashboard Component - Only for authenticated users
 * ------------------------------------------------------- */
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, var(--parchment) 0%, var(--paper-white) 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            color: 'var(--dark-brown)',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Welcome back, {user?.display_name || user?.username}! 👋
          </h1>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Ready to dive into your next great read?
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <LibraryStatsWidget />
          <UserSearchWidget />
        </div>

        <div style={{
          background: 'var(--paper-white)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid var(--light-brown)',
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: 'var(--dark-brown)',
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            What would you like to do today?
          </h3>
          
          {/* ✅ Updated Quick Actions with Add Book button */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
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
            
            <Link
              to="/library"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                color: 'var(--primary-brown)',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: '2px solid var(--primary-brown)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary-brown)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = 'var(--primary-brown)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📚 My Library
            </Link>

            {/* ✅ Added Add Book button to dashboard */}
            <Link
              to="/books/add"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2e7d32, #1b5e20)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.2)';
              }}
            >
              ➕ Add Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------- * 
 * Public Landing Page - For non-authenticated users
 * ------------------------------------------------------- */
const LandingPage = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, var(--parchment) 0%, var(--paper-white) 100%)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-brown) 0%, var(--dark-brown) 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            animation: 'float 3s ease-in-out infinite'
          }}>
            📚
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Welcome to BookReviews
          </h1>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '2rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Your personal book review sanctuary! Discover new books, track your reading progress, 
            and share your thoughts with fellow book lovers.
          </p>
          <Link
            to="/auth"
            style={{
              display: 'inline-block',
              background: 'white',
              color: 'var(--primary-brown)',
              textDecoration: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
            }}
          >
            🚀 Get Started
          </Link>
        </div>
      </div>

      <div style={{
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              icon: '📖',
              title: 'Track Your Reading',
              description: 'Keep track of books you\'ve read, are currently reading, or want to read next.'
            },
            {
              icon: '⭐',
              title: 'Share Reviews',
              description: 'Write detailed reviews and ratings to help other readers discover great books.'
            },
            {
              icon: '👥',
              title: 'Connect with Readers',
              description: 'Follow other book lovers and see what they\'re reading and recommending.'
            }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'var(--paper-white)',
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid var(--light-brown)',
                boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)',
                transition: 'all 0.3s ease',
                animation: `slideIn 0.6s ease-out ${index * 0.2}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 69, 19, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.08)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {feature.icon}
              </div>
              <h3 style={{
                color: 'var(--dark-brown)',
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'var(--text-dark)',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------- * 
 * Main App Component
 * ------------------------------------------------------- */
function AppContent() {
  const { loading, user } = useAuth();
  const location = useLocation();
  
  const hideNavbarRoutes = ['/auth'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--parchment) 0%, var(--paper-white) 100%)',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--light-brown)',
          borderTop: '4px solid var(--primary-brown)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{
          color: 'var(--text-dark)',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          Loading your book sanctuary...
        </span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {!shouldHideNavbar && <NavigationHeader />}
      
      <main style={{ 
        minHeight: shouldHideNavbar ? '100vh' : 'calc(100vh - 80px)' 
      }}>
        <Routes>
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
          
          <Route path="/books" element={
            <ProtectedRoute>
              <BooksPage />
            </ProtectedRoute>
          } />

          {/* ✅ Added route for Add Book functionality */}
          <Route path="/books/add" element={
            <ProtectedRoute>
              <CreateBookForm />
            </ProtectedRoute>
          } />
          
          <Route path="/books/:id" element={
            <ProtectedRoute>
              <BookDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/library" element={
            <ProtectedRoute>
              <MyLibrary />
            </ProtectedRoute>
          } />
          
          <Route path="/users/:id" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/users/:id/followers" element={
            <ProtectedRoute>
              <UserFollowers />
            </ProtectedRoute>
          } />
          
          <Route path="/users/:id/following" element={
            <ProtectedRoute>
              <UserFollowing />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* CSS Animations - Fixed without jsx attribute */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: block !important;
          }

          h1 {
            font-size: 2rem !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
