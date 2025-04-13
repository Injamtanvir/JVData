// client/src/components/DataForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchResults from './SearchResults';

const API_URL = '/api';

const initialFormState = {
  code: '',
  personName: '',
  link: '',
  description: '',
  status: 'ONLINE'
};

const DataForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modifiedFields, setModifiedFields] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Track modified fields if we're editing an existing record
    if (originalData) {
      if (name === 'code') {
        // Can't modify code
        return;
      }
      
      // Check if the value is different from the original
      if (originalData[name] !== value) {
        setModifiedFields({
          ...modifiedFields,
          [name]: true
        });
      } else {
        // If value matches original, remove from modified fields
        const updatedModifiedFields = { ...modifiedFields };
        delete updatedModifiedFields[name];
        setModifiedFields(updatedModifiedFields);
      }
    }
  };

  // Fetch record by code
  const fetchRecordByCode = async (code) => {
    if (!code) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/records/${code}`);
      
      // Fill form with fetched data
      setFormData(response.data);
      setOriginalData(response.data);
      setModifiedFields({});
      setIsUpdating(true);
      setErrors({});
      
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Code not found, keep the entered code but reset other fields
        setFormData({
          ...initialFormState,
          code: code.toUpperCase()
        });
        setOriginalData(null);
        setModifiedFields({});
        setIsUpdating(false);
      } else {
        toast.error('Error fetching record');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Search records by person name
  const searchByName = async (name) => {
    if (!name || name.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/search/name/${name}`);
      setSearchResults(response.data);
    } catch (error) {
      toast.error('Error searching records');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle code input blur event
  const handleCodeBlur = () => {
    const { code } = formData;
    if (code && code.trim() !== '') {
      fetchRecordByCode(code);
    }
  };

  // Handle name input change with debounce for search
  useEffect(() => {
    const { personName } = formData;
    
    const timeoutId = setTimeout(() => {
      searchByName(personName);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [formData.personName]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.code) newErrors.code = 'Code is required';
    if (!formData.personName) newErrors.personName = 'Name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      
      if (isUpdating) {
        // Update existing record
        await axios.put(
          `${API_URL}/records/${formData.code}`,
          formData
        );
        toast.success('Record updated successfully');
      } else {
        // Create new record
        await axios.post(`${API_URL}/records`, formData);
        toast.success('Record created successfully');
      }
      
      // Reset form and states
      setFormData(initialFormState);
      setOriginalData(null);
      setModifiedFields({});
      setIsUpdating(false);
      setErrors({});
      setSearchResults([]);
      
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error saving record');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle clear form
  const handleClear = () => {
    setFormData(initialFormState);
    setOriginalData(null);
    setModifiedFields({});
    setIsUpdating(false);
    setErrors({});
    setSearchResults([]);
  };

  // Handle selecting a search result
  const handleSelectResult = (result) => {
    setFormData(result);
    setOriginalData(result);
    setModifiedFields({});
    setIsUpdating(true);
    setErrors({});
    setSearchResults([]);
  };

  return (
    <div className="form-container">
      <h2>{isUpdating ? 'Update Record' : 'Create New Record'}</h2>
      
      {loading ? (
        <div className="loading"></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Code</label>
            <input
              type="text"
              id="code"
              name="code"
              className="form-control"
              value={formData.code}
              onChange={handleChange}
              onBlur={handleCodeBlur}
              disabled={isUpdating}
              placeholder="Enter code (e.g., ABC-123)"
            />
            {errors.code && <div className="error">{errors.code}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="personName">Person Name</label>
            <input
              type="text"
              id="personName"
              name="personName"
              className={`form-control ${modifiedFields.personName ? 'modified' : ''}`}
              value={formData.personName}
              onChange={handleChange}
              placeholder="Enter person name"
            />
            {errors.personName && <div className="error">{errors.personName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="link">Link (Optional)</label>
            <input
              type="text"
              id="link"
              name="link"
              className={`form-control ${modifiedFields.link ? 'modified' : ''}`}
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter link (optional)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              className={`form-control ${modifiedFields.description ? 'modified' : ''}`}
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter description (optional)"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="statusOnline"
                  name="status"
                  value="ONLINE"
                  checked={formData.status === 'ONLINE'}
                  onChange={handleChange}
                />
                <label htmlFor="statusOnline">Online</label>
              </div>
              
              <div className="radio-option">
                <input
                  type="radio"
                  id="statusDownloaded"
                  name="status"
                  value="DOWNLOADED"
                  checked={formData.status === 'DOWNLOADED'}
                  onChange={handleChange}
                />
                <label htmlFor="statusDownloaded">Downloaded</label>
              </div>
              
              <div className="radio-option">
                <input
                  type="radio"
                  id="statusWatched"
                  name="status"
                  value="WATCHED"
                  checked={formData.status === 'WATCHED'}
                  onChange={handleChange}
                />
                <label htmlFor="statusWatched">Watched</label>
              </div>
            </div>
          </div>
          
          <div className="buttons-container">
            <button
              type="button"
              className="btn btn-clear"
              onClick={handleClear}
            >
              Clear
            </button>
            
            <button
              type="submit"
              className={`btn ${isUpdating ? 'btn-update' : 'btn-primary'}`}
            >
              {isUpdating ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}
      
      <SearchResults 
        results={searchResults} 
        onSelectResult={handleSelectResult} 
      />
    </div>
  );
};

export default DataForm;