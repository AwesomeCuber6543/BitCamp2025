import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Website from './components/Website';
import { useState, useEffect } from 'react';

function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = window.location.pathname.includes('/dashboard');

  // This function will be called when the logout button is clicked
  function logoutAndRedirect() {
    console.log("Logout clicked");
    // Force a direct browser navigation
    window.location.href = '/login';
  }

  return (
    <nav className="navbar">
      <Link to={isLoggedIn ? '/dashboard' : '/'} className="nav-logo">AI Phone Service</Link>
      <div className="nav-links">
        {isLoggedIn ? (
          <button 
            onClick={logoutAndRedirect}
            style={{
              backgroundColor: 'transparent',
              color: '#6b46c1', // Purple color
              border: '2px solid #6b46c1',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginLeft: '0.5rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(107, 114, 128, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Logout
          </button>
        ) : (
          <Link 
            to="/login" 
            className="login-button"
            style={{
              transition: 'box-shadow 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(107, 114, 128, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

function HomePage() {
  return (
    <main className="landing-page">
      <div className="hero-section">
        <h1 className="hero-title">AI-Powered Customer Service</h1>
        <p className="hero-subtitle">Transform your phone support with intelligent, website-aware AI that understands your business</p>
        <Link to="/login" className="cta-button">Get Started Free</Link>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Always Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Resolution Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">60s</span>
            <span className="stat-label">Avg. Response Time</span>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>Smart AI Assistant</h3>
          <p>Contextually aware responses based on your website content</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔄</div>
          <h3>Real-time Learning</h3>
          <p>Continuously improves from customer interactions</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Seamless Integration</h3>
          <p>Works with your existing phone system</p>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
