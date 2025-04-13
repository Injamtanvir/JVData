import React from 'react';

function SearchResults({ results, onSelect }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="search-results">
      <h5>Results:</h5>
      <div className="list-group">
        {results.map(item => (
          <div 
            key={item._id} 
            className="result-item"
            onClick={() => onSelect(item)}
          >
            <strong>{item.code}</strong> - {item.personName}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
