import React, { useState } from 'react';
import { useAuthContext } from '../hooks/AuthContext';
import { TREASURER_CREDENTIALS } from '../constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showTreasurerLogin, setShowTreasurerLogin] = useState(false);

  const { signInAsGuest, signInAsTreasurer, isLoading, error } = useAuthContext();

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Guest login form submitted:', { email, name });
    if (email && name) {
      console.log('Calling signInAsGuest...');
      await signInAsGuest(email, name);
      console.log('signInAsGuest completed');
    } else {
      console.log('Missing email or name');
    }
  };

  const handleTreasurerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Treasurer login form submitted:', { email, password });
    if (email && password) {
      console.log('Calling signInAsTreasurer...');
      await signInAsTreasurer(email, password);
      console.log('signInAsTreasurer completed');
    } else {
      console.log('Missing email or password');
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
          <div className="beta-logo">
            <img 
              src="/beta-coat-of-arms.png" 
              alt="Beta Theta Pi Coat of Arms" 
              style={{ 
                width: '160px', 
                height: '160px', 
                objectFit: 'contain',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
              }} 
            />
          </div>
          <h1 className="beta-title">BETA THETA PI</h1>
          <p className="app-title">BetaMoney</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Debug info */}
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', padding: '5px', backgroundColor: '#f0f0f0' }}>
          Debug: email="{email}", name="{name}", password="{password}", isLoading={isLoading.toString()}
        </div>

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