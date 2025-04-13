import React, { useState } from 'react';

function Website() {
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Store resources as objects with name and data (if available)
  const [resources, setResources] = useState([
    { name: 'Company Overview.pdf', type: 'pdf', isPlaceholder: true },
    { name: 'Product Catalog.pdf', type: 'pdf', isPlaceholder: true },
    { name: 'Team Photo.jpg', type: 'image', isPlaceholder: true },
    { name: 'Price List.xlsx', type: 'spreadsheet', isPlaceholder: true }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Company Name:', companyName);
    console.log('Company URL:', companyUrl);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!newResourceName) {
        setNewResourceName(file.name);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleAddResource = () => {
    if (newResourceName) {
      const extension = newResourceName.split('.').pop().toLowerCase();
      let type = 'other';
      
      if (['pdf'].includes(extension)) {
        type = 'pdf';
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        type = 'image';
      } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
        type = 'spreadsheet';
      } else if (['docx', 'doc'].includes(extension)) {
        type = 'document';
      }
      
      // Create a new resource object
      const newResource = {
        name: newResourceName,
        type: type,
        isPlaceholder: !selectedFile,
        data: selectedFile ? URL.createObjectURL(selectedFile) : null,
        file: selectedFile
      };
      
      setResources([...resources, newResource]);
      setNewResourceName('');
      setSelectedFile(null);
      setShowAddResourceModal(false);
    }
  };

  const handleDeleteResource = (index) => {
    const updatedResources = [...resources];
    // Revoke object URL if it exists to prevent memory leaks
    if (updatedResources[index].data) {
      URL.revokeObjectURL(updatedResources[index].data);
    }
    updatedResources.splice(index, 1);
    setResources(updatedResources);
  };

  const handleResourceDoubleClick = (resource) => {
    if (resource.data) {
      // For real files, open in a new tab or download
      window.open(resource.data, '_blank');
    } else {
      // For placeholder files, show a message
      alert(`This is a placeholder file: ${resource.name}`);
    }
  };

  const getFileIcon = (resource) => {
    switch (resource.type) {
      case 'pdf':
        return '📄';
      case 'image':
        return '🖼️';
      case 'spreadsheet':
        return '📊';
      case 'document':
        return '📝';
      default:
        return '📁';
    }
  };

  return (
    <div className="website-dashboard">
      <div className="tech-web-corner top-left"></div>
      <div className="tech-web-corner bottom-right"></div>
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">Website Configuration</h1>
        <p className="dashboard-subtitle">Manage your company's online presence</p>
      </div>

      <div className="dashboard-grid">
        <div className="grid-item company-info">
          <div className="card-header">
            <h2 className="card-title">Company Information</h2>
            <span className="card-badge">Basic Info</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <div className="input-group">
              <input 
                type="text" 
                id="companyName"
                placeholder="Enter your company name" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <button type="button" className="modern-button secondary">Update</button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="companyUrl">Company URL</label>
            <div className="input-group">
              <input 
                type="url" 
                id="companyUrl"
                placeholder="Enter your website URL" 
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
              />
              <button type="button" className="modern-button secondary">Update</button>
            </div>
          </div>
        </div>

        <div className="grid-item resources">
          <div className="card-header">
            <h2 className="card-title">Resources</h2>
            <button 
              className="modern-button primary"
              onClick={() => setShowAddResourceModal(true)}
            >
              + Add Resource
            </button>
          </div>
          <div className="resources-grid">
            {resources.map((resource, index) => (
              <div 
                key={index} 
                className="resource-card"
                onDoubleClick={() => handleResourceDoubleClick(resource)}
                title={resource.isPlaceholder ? "Placeholder file" : "Double-click to open"}
              >
                <div className="resource-icon">{getFileIcon(resource)}</div>
                <div className="resource-details">
                  <span className="resource-name">{resource.name}</span>
                  <span className="resource-type">{resource.name.split('.').pop().toUpperCase()}</span>
                </div>
                <button 
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteResource(index);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddResourceModal && (
        <div className="modal-overlay">
          <div className="modal-content resource-modal">
            <div className="modal-header">
              <h3>Add New Resource</h3>
              <button 
                className="modal-close-button"
                onClick={() => setShowAddResourceModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="resourceName">Resource Name</label>
                <input
                  type="text"
                  id="resourceName"
                  placeholder="Enter resource name"
                  value={newResourceName}
                  onChange={(e) => setNewResourceName(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="resourceFile">Upload File</label>
                <div className="file-upload-area">
                  <div className="file-input-container">
                    <input
                      type="file"
                      id="resourceFile"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <div className="file-input-label">
                      <div className="file-input-icon">📁</div>
                      <div className="file-input-text">Drag files here or click to browse</div>
                    </div>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="selected-file">
                    <span className="file-icon">📄</span> 
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    <button 
                      className="remove-file-button"
                      onClick={handleRemoveFile}
                      type="button"
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modern-button secondary"
                onClick={() => setShowAddResourceModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modern-button primary"
                onClick={handleAddResource}
                disabled={!newResourceName}
              >
                Add Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Website;
