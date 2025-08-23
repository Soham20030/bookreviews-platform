import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import '../../components/auth.css';

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
    <div className="auth-form">
      <div className="auth-header">
        <h2>📚 Welcome Back</h2>
        <p>Sign in to your reading sanctuary</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">Username or Email</label>
          <input
            type="text"
            className="form-input"
            {...register('username', { 
              required: 'Username or email is required' 
            })}
            placeholder="Enter your username or email"
          />
          {errors.username && (
            <span className="form-error">{errors.username.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            {...register('password', { 
              required: 'Password is required' 
            })}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="form-error">{errors.password.message}</span>
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
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>


    </div>
  );
};

export default LoginForm;
