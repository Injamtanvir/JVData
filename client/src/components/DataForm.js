import React, { useState, useEffect } from 'react';
import SearchResults from './SearchResults';

function DataForm() {
  const initialFormData = {
    code: '',
    personName: '',
    link: '',
    description: '',
    status: 'Online'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isUpdate, setIsUpdate] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [modifiedFields, setModifiedFields] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('code'); // 'code' or 'name'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const resetForm = () => {
    setFormData(initialFormData);
    setIsUpdate(false);
    setOriginalData({});
    setModifiedFields({});
    setSearchResults([]);
    setMessage({ text: '', type: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Make code and personName uppercase
    if (name === 'code' || name === 'personName') {
      processedValue = value.toUpperCase();
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Track modified fields for visual feedback
    if (isUpdate && originalData[name] !== processedValue) {
      setModifiedFields(prev => ({
        ...prev,
        [name]: true
      }));
    } else if (isUpdate) {
      setModifiedFields(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    // Search by code or person name
    if (name === 'code' && processedValue.length >= 2) {
      searchByCode(processedValue);
      setSearchType('code');
    } else if (name === 'personName' && processedValue.length >= 2) {
      searchByName(processedValue);
      setSearchType('name');
    }
  };

  const searchByCode = async (code) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search/code/${code}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length === 1) {
          // Exact match, fill the form
          fillForm(data[0]);
          setSearchResults([]);
        } else {
          // Show multiple results
          setSearchResults(data);
        }
      }
    } catch (error) {
      console.error('Error searching by code:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchByName = async (name) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search/name/${name}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching by name:', error);
    } finally {
      setLoading(false);
    }
  };

  const fillForm = (data) => {
    setFormData({
      code: data.code,
      personName: data.personName,
      link: data.link || '',
      description: data.description || '',
      status: data.status
    });
    setOriginalData({
      code: data.code,
      personName: data.personName,
      link: data.link || '',
      description: data.description || '',
      status: data.status,
      _id: data._id
    });
    setIsUpdate(true);
    setModifiedFields({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (isUpdate) {
        // Update existing record
        const response = await fetch(`/api/data/${originalData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setMessage({ text: 'Record updated successfully!', type: 'success' });
          resetForm();
        } else {
          const error = await response.json();
          setMessage({ text: error.message || 'Failed to update record', type: 'danger' });
        }
      } else {
        // Create new record
        const response = await fetch('/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setMessage({ text: 'Record created successfully!', type: 'success' });
          resetForm();
        } else {
          const error = await response.json();
          setMessage({ text: error.message || 'Failed to create record', type: 'danger' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'An error occurred. Please try again.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (item) => {
    fillForm(item);
    setSearchResults([]);
  };

  // Clear search results when form is reset
  useEffect(() => {
    if (!formData.code && !formData.personName) {
      setSearchResults([]);
    }
  }, [formData.code, formData.personName]);

  return (
    <div className="form-container">
      <h2 className="form-title">{isUpdate ? 'Update Record' : 'Create New Record'}</h2>
      
      {message.text && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="code" className="form-label">Code*</label>
          <input
            type="text"
            className={`form-control ${modifiedFields.code ? 'modified-field' : ''}`}
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter code (e.g., ABC-123)"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="personName" className="form-label">Person Name*</label>
          <input
            type="text"
            className={`form-control ${modifiedFields.personName ? 'modified-field' : ''}`}
            id="personName"
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            placeholder="Enter person name"
            required
          />
        </div>
        
        {searchType === 'name' && searchResults.length > 0 && (
          <SearchResults results={searchResults} onSelect={handleSelectResult} />
        )}
        
        <div className="mb-3">
          <label htmlFor="link" className="form-label">Link (Optional)</label>
          <input
            type="url"
            className={`form-control ${modifiedFields.link ? 'modified-field' : ''}`}
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Enter link"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description (Optional)</label>
          <textarea
            className={`form-control ${modifiedFields.description ? 'modified-field' : ''}`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter description"
          ></textarea>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Status*</label>
          <div className="d-flex gap-4">
            {['Online', 'Downloaded', 'Watched'].map(option => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  id={option}
                  value={option}
                  checked={formData.status === option}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor={option}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className={`btn ${isUpdate ? 'update-button' : 'btn-primary'}`}
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isUpdate ? 'Updating...' : 'Saving...'}
              </span>
            ) : (
              isUpdate ? 'Update Record' : 'Save Record'
            )}
          </button>
          
          {isUpdate && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default DataForm;