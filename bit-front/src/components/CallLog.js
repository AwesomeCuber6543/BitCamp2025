import React, { useState } from 'react';

function CallLog() {
  const [filter, setFilter] = useState('all');
  
  // Fake call log data with various statuses and durations
  const callData = [
    {
      id: 1,
      caller: "John Doe",
      phoneNumber: "(415) 555-7890",
      date: "2023-11-15",
      time: "10:23 AM",
      duration: "4:32",
      status: "completed",
      notes: "Customer inquired about product pricing and availability."
    },
    {
      id: 2,
      caller: "Sarah Johnson",
      phoneNumber: "(650) 555-1234",
      date: "2023-11-14",
      time: "2:45 PM",
      duration: "7:15",
      status: "completed",
      notes: "Detailed discussion about return policy for online orders."
    },
    {
      id: 3,
      caller: "Unknown",
      phoneNumber: "(510) 555-9876",
      date: "2023-11-14",
      time: "11:17 AM",
      duration: "0:45",
      status: "missed",
      notes: "Caller hung up during AI greeting."
    },
    {
      id: 4,
      caller: "Michael Smith",
      phoneNumber: "(408) 555-5678",
      date: "2023-11-13",
      time: "4:30 PM",
      duration: "2:20",
      status: "completed",
      notes: "Customer requested information about business hours."
    },
    {
      id: 5,
      caller: "Emily Wilson",
      phoneNumber: "(925) 555-4321",
      date: "2023-11-12",
      time: "9:05 AM",
      duration: "0:32",
      status: "transferred",
      notes: "Call transferred to sales department."
    },
    {
      id: 6,
      caller: "Robert Chen",
      phoneNumber: "(415) 555-8765",
      date: "2023-11-11",
      time: "3:12 PM",
      duration: "5:47",
      status: "completed",
      notes: "Customer placed an order for 3 items with express shipping."
    },
    {
      id: 7,
      caller: "Jessica Taylor",
      phoneNumber: "(510) 555-2468",
      date: "2023-11-10",
      time: "1:30 PM",
      duration: "0:18",
      status: "voicemail",
      notes: "Caller left a message requesting a callback."
    }
  ];
  
  // Filter calls based on selected status
  const filteredCalls = filter === 'all' 
    ? callData 
    : callData.filter(call => call.status === filter);
  
  // Get status icon and color
  const getStatusInfo = (status) => {
    switch(status) {
      case 'completed':
        return { icon: '✓', color: '#10b981', label: 'Completed' };
      case 'missed':
        return { icon: '✕', color: '#ef4444', label: 'Missed' };
      case 'transferred':
        return { icon: '↗', color: '#3b82f6', label: 'Transferred' };
      case 'voicemail':
        return { icon: '✉', color: '#f59e0b', label: 'Voicemail' };
      default:
        return { icon: '•', color: '#6b7280', label: 'Unknown' };
    }
  };

  return (
    <div className="website-dashboard">
      {/* Add these two lines for the corner design */}
      <div className="tech-web-corner top-left"></div>
      <div className="tech-web-corner bottom-right"></div>
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">Call Log</h1>
        <p className="dashboard-subtitle">Review your call history and analytics</p>
      </div>
      
      <div className="call-log-container">
        <div className="call-log-header">
          <div className="call-stats">
            <div className="stat-item">
              <span className="stat-value">{callData.length}</span>
              <span className="stat-label">Total Calls</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {callData.filter(call => call.status === 'completed').length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {callData.filter(call => call.status === 'missed').length}
              </span>
              <span className="stat-label">Missed</span>
            </div>
          </div>
          
          <div className="call-filters">
            <span className="filter-label">Filter:</span>
            <div className="filter-buttons">
              <button 
                className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button 
                className={`filter-button ${filter === 'missed' ? 'active' : ''}`}
                onClick={() => setFilter('missed')}
              >
                Missed
              </button>
              <button 
                className={`filter-button ${filter === 'transferred' ? 'active' : ''}`}
                onClick={() => setFilter('transferred')}
              >
                Transferred
              </button>
              <button 
                className={`filter-button ${filter === 'voicemail' ? 'active' : ''}`}
                onClick={() => setFilter('voicemail')}
              >
                Voicemail
              </button>
            </div>
          </div>
        </div>
        
        <div className="call-log-table">
          <div className="call-table-header">
            <div className="call-header-cell">Caller</div>
            <div className="call-header-cell">Date & Time</div>
            <div className="call-header-cell">Duration</div>
            <div className="call-header-cell">Status</div>
            <div className="call-header-cell">Notes</div>
          </div>
          
          <div className="call-table-body">
            {filteredCalls.length > 0 ? (
              filteredCalls.map(call => {
                const statusInfo = getStatusInfo(call.status);
                
                return (
                  <div key={call.id} className="call-row">
                    <div className="call-cell caller-info">
                      <div className="caller-name">{call.caller}</div>
                      <div className="caller-number">{call.phoneNumber}</div>
                    </div>
                    <div className="call-cell date-time">
                      <div className="call-date">{call.date}</div>
                      <div className="call-time">{call.time}</div>
                    </div>
                    <div className="call-cell duration">
                      {call.duration}
                    </div>
                    <div className="call-cell status">
                      <span 
                        className="status-indicator" 
                        style={{ backgroundColor: statusInfo.color }}
                      >
                        {statusInfo.icon}
                      </span>
                      <span className="status-text">{statusInfo.label}</span>
                    </div>
                    <div className="call-cell notes">
                      {call.notes}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-calls-message">
                No calls matching the selected filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallLog;
