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
    <div className="auth-form">
      <div className="auth-header">
        <h2>📚 Join the Community</h2>
        <p>Create your reading account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            {...register('username', { 
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' }
            })}
            placeholder="Choose a unique username"
          />
          {errors.username && (
            <span className="form-error">{errors.username.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="your@email.com"
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input
            type="text"
            className="form-input"
            {...register('displayName')}
            placeholder="How others will see you (optional)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            placeholder="Create a secure password"
          />
          {errors.password && (
            <span className="form-error">{errors.password.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-input"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword.message}</span>
          )}
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary auth-submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-switch">
        <p>Already have an account? 
          <button 
            type="button" 
            className="link-button"
            onClick={onSwitchToLogin}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
