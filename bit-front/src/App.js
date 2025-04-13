import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Website from './components/Website';
import { useState, useEffect } from 'react';

// Layout component without the navigation bar
function Layout() {
  return <Outlet />;
}

function HomePage() {
  return (
    <main className="landing-page">
      <div className="landing-nav">
        <div className="landing-brand">Helpr</div>
        <Link to="/login" className="landing-login">Login</Link>
      </div>
      
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
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
