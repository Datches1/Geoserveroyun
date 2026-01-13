import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Attempting login with:', formData.email);

    const result = await login(formData.email, formData.password);

    console.log('Login result:', result);

    setLoading(false);

    if (result.success) {
      console.log('Login successful, navigating to home');
      navigate('/');
    } else {
      console.log('Login failed, staying on login page');
      setError(result.message || 'Email veya şifre hatalı');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-title">FAMOUSGUESSR</h1>
          <h2>Login</h2>
        </div>
        
        <div className="auth-content">
          {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>

        <div className="demo-credentials">
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: admin@geogame.com / admin123</p>
          <p>Player: player@example.com / password123</p>
        </div>        </div>      </div>
    </div>
  );
};

export default Login;
