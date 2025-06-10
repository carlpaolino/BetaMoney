import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { TREASURER_CREDENTIALS } from '../constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showTreasurerLogin, setShowTreasurerLogin] = useState(false);

  const { signInAsGuest, signInAsTreasurer, isLoading, error } = useAuth();

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      await signInAsGuest(email, name);
    }
  };

  const handleTreasurerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await signInAsTreasurer(email, password);
    }
  };

  const toggleLoginMode = () => {
    setShowTreasurerLogin(!showTreasurerLogin);
    setEmail('');
    setName('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="beta-logo">🏛️</div>
          <h1 className="beta-title">BETA THETA PI</h1>
          <p className="app-title">BetaMoney</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!showTreasurerLogin ? (
          <form onSubmit={handleGuestLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!email || !name || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }} />
                  Signing in...
                </>
              ) : (
                'Continue as Member'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTreasurerLogin}>
            <div className="form-group">
              <label className="form-label">Treasurer Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={TREASURER_CREDENTIALS.EMAIL}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              disabled={!email || !password || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }} />
                  Signing in...
                </>
              ) : (
                'Sign In as Treasurer'
              )}
            </button>
          </form>
        )}

        <button
          type="button"
          className="btn btn-text"
          onClick={toggleLoginMode}
          style={{ marginTop: '16px' }}
        >
          {showTreasurerLogin ? 'Member Login' : 'Treasurer Login'}
        </button>

        {showTreasurerLogin && (
          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>{TREASURER_CREDENTIALS.EMAIL}</p>
            <p>{TREASURER_CREDENTIALS.PASSWORD}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 