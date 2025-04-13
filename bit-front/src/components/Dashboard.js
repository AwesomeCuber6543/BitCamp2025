import React from 'react';
import { useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import Website from './Website';
import Interactions from './Interactions';
import Account from './Account';

function Dashboard() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (window.location.pathname === '/dashboard') {
      navigate('/dashboard/website');
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-nav">
        <NavLink 
          to="/dashboard/website" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Your Website
        </NavLink>
        <NavLink 
          to="/dashboard/interactions" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Interactions
        </NavLink>
        <NavLink 
          to="/dashboard/calllog" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Call Log
        </NavLink>
        <NavLink 
          to="/dashboard/account" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Account
        </NavLink>
      </div>
      <div className="dashboard-content">
        <Routes>
          <Route path="website" element={<Website />} />
          <Route path="interactions" element={<Interactions />} />
          <Route path="calllog" element={<div className="page-container">Call Log Page</div>} />
          <Route path="account" element={<Account />} />
          <Route path="/" element={<Website />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;