import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onSwitchToRegister }) => {
  const { login, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearError();
      await login(data);
    } catch (error) {
      // Error is handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '0 auto',
      padding: '2rem',
      background: 'var(--paper-white)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(139, 69, 19, 0.15)',
      border: '1px solid var(--light-brown)'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          animation: 'float 3s ease-in-out infinite'
        }}>
          📚
        </div>
        <h2 style={{
          color: 'var(--dark-brown)',
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Welcome Back
        </h2>
        <p style={{
          color: 'var(--text-light)',
          fontSize: '1rem',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Sign in to your reading sanctuary
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#ffebee',
          border: '1px solid #ffcdd2',
          color: '#d32f2f',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        {/* Username Field (FIXED: changed from email to username) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.95rem'
          }}>
            Username
          </label>
          <input
            type="text"
            {...register('username', { 
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            })}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: `2px solid ${errors.username ? '#d32f2f' : 'var(--light-brown)'}`,
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              background: 'var(--parchment)',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your username"
            disabled={isLoading}
            onFocus={(e) => {
              if (!errors.username) {
                e.target.style.borderColor = 'var(--primary-brown)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.username) {
                e.target.style.borderColor = 'var(--light-brown)';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.username && (
            <p style={{
              color: '#d32f2f',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
              marginBottom: 0
            }}>
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.95rem'
          }}>
            Password
          </label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: `2px solid ${errors.password ? '#d32f2f' : 'var(--light-brown)'}`,
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              background: 'var(--parchment)',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your password"
            disabled={isLoading}
            onFocus={(e) => {
              if (!errors.password) {
                e.target.style.borderColor = 'var(--primary-brown)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.password) {
                e.target.style.borderColor = 'var(--light-brown)';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.password && (
            <p style={{
              color: '#d32f2f',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
              marginBottom: 0
            }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            background: isLoading ? 'var(--text-light)' : 'var(--primary-brown)',
            color: 'white',
            border: 'none',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = 'var(--dark-brown)';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background = 'var(--primary-brown)';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {isLoading && (
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid white',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          )}
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Switch to Register */}
        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid var(--light-brown)'
        }}>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '0.9rem',
            marginBottom: '0.75rem'
          }}>
            Don't have an account yet?
          </p>
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{
              background: 'none',
              border: '2px solid var(--primary-brown)',
              color: 'var(--primary-brown)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--primary-brown)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = 'var(--primary-brown)';
            }}
          >
            Create Account
          </button>
        </div>
      </form>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .auth-form {
            margin: 1rem;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
