import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register: registerUser, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearError();
      await registerUser(data);
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
          ✨
        </div>
        <h2 style={{
          color: 'var(--dark-brown)',
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Join Our Community
        </h2>
        <p style={{
          color: 'var(--text-light)',
          fontSize: '1rem',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Create your reading account
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

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        {/* Username Field */}
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
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores'
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
            placeholder="Choose a username"
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

        {/* Email Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.95rem'
          }}>
            Email Address
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: `2px solid ${errors.email ? '#d32f2f' : 'var(--light-brown)'}`,
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              background: 'var(--parchment)',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your email"
            disabled={isLoading}
            onFocus={(e) => {
              if (!errors.email) {
                e.target.style.borderColor = 'var(--primary-brown)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.email) {
                e.target.style.borderColor = 'var(--light-brown)';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.email && (
            <p style={{
              color: '#d32f2f',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
              marginBottom: 0
            }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '1.5rem' }}>
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
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
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
            placeholder="Create a password"
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

        {/* Confirm Password Field */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.95rem'
          }}>
            Confirm Password
          </label>
          <input
            type="password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: `2px solid ${errors.confirmPassword ? '#d32f2f' : 'var(--light-brown)'}`,
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              background: 'var(--parchment)',
              boxSizing: 'border-box'
            }}
            placeholder="Confirm your password"
            disabled={isLoading}
            onFocus={(e) => {
              if (!errors.confirmPassword) {
                e.target.style.borderColor = 'var(--primary-brown)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.confirmPassword) {
                e.target.style.borderColor = 'var(--light-brown)';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.confirmPassword && (
            <p style={{
              color: '#d32f2f',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
              marginBottom: 0
            }}>
              {errors.confirmPassword.message}
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
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

export default RegisterForm;
