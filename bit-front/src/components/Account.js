import React, { useState } from 'react';

function Account() {
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    extension: '101',
    company: 'Acme Corporation',
    serviceNumber: '1-800-555-HELP'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...profile});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="website-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Account Settings</h1>
        <p className="dashboard-subtitle">Manage your profile and service information</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="grid-item account-profile">
          <div className="card-header">
            <h2 className="card-title">Profile Information</h2>
            <button 
              className="modern-button secondary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="extension">Extension</label>
                <input
                  type="text"
                  id="extension"
                  name="extension"
                  value={formData.extension}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button type="submit" className="modern-button primary">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="profile-details centered">
              <div className="profile-info">
                <div className="info-group">
                  <span className="info-label">Name</span>
                  <span className="info-value">{profile.name}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Email</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{profile.phone}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Extension</span>
                  <span className="info-value">{profile.extension}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Company</span>
                  <span className="info-value">{profile.company}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid-item service-details">
          <div className="card-header">
            <h2 className="card-title">Service Information</h2>
            <span className="card-badge">Active</span>
          </div>
          
          <div className="service-info">
            <div className="service-number">
              <span className="service-label">Your Customer Service Number</span>
              <span className="service-value">{profile.serviceNumber}</span>
              <p className="service-description">
                This is the number your customers will call to reach your AI phone service.
              </p>
            </div>
            
            <button className="modern-button primary full-width">
              Manage Phone Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
