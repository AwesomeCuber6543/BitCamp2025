import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard/website');
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <Link to="/" className="brand-link">Helpr</Link>
      </div>
      <div className="login-container">
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <a href="#forgot" className="forgot-password">Forgot Password?</a>
          <button type="submit" className="login-submit-button">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
