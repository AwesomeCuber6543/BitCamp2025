import React from 'react';

// Define the data arrays before the component
const topQuestions = [
  { question: "What are your business hours?", count: 42 },
  { question: "Do you offer international shipping?", count: 38 },
  { question: "What's your return policy?", count: 35 },
  { question: "How can I track my order?", count: 29 },
  { question: "Do you offer gift wrapping?", count: 24 },
];

const unresolvedQuestions = [
  { question: "Where are your products manufactured?", count: 15 },
  { question: "Do you have a physical store location?", count: 12 },
  { question: "What payment methods do you accept?", count: 10 },
  { question: "Are your products eco-friendly?", count: 8 },
];

function Interactions() {
  return (
    <div className="website-dashboard">
      <div className="tech-web-corner top-left"></div>
      <div className="tech-web-corner bottom-right"></div>
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">Customer Interactions</h1>
        <p className="dashboard-subtitle">Monitor and manage customer interactions</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="grid-item metrics-card">
          <div className="card-header">
            <h2 className="card-title">Activity Overview</h2>
          </div>
          <div className="metrics-grid">
            <div className="metric-item up">
              <span className="metric-label">Total Interactions</span>
              <span className="metric-value">847</span>
              <span className="metric-change">+12% from last week</span>
            </div>
            <div className="metric-item down">
              <span className="metric-label">Avg. Response Time</span>
              <span className="metric-value">45s</span>
              <span className="metric-change">-8% from last week</span>
            </div>
            <div className="metric-item up">
              <span className="metric-label">Resolution Rate</span>
              <span className="metric-value">94%</span>
              <span className="metric-change">+3% from last week</span>
            </div>
          </div>
        </div>

        <div className="grid-item">
          <div className="card-header">
            <h2 className="card-title">Top Questions</h2>
            <span className="card-badge">Last 7 days</span>
          </div>
          <div className="questions-list">
            {topQuestions.map((q, i) => (
              <div key={i} className="question-item">
                <div className="question-rank">{i + 1}</div>
                <div className="question-content">
                  <span className="question-text">{q.question}</span>
                  <span className="question-count">{q.count} times asked</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-item">
          <div className="card-header">
            <h2 className="card-title">Unresolved Questions</h2>
            <button className="modern-button primary">Review All</button>
          </div>
          <div className="unresolved-list">
            {unresolvedQuestions.map((q, i) => (
              <div key={i} className="unresolved-item">
                <div className="unresolved-content">
                  <span className="unresolved-text">{q.question}</span>
                  <span className="unresolved-meta">Asked {q.count} times</span>
                </div>
                <button className="modern-button secondary">Add Resource</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interactions;
