// client/src/components/SearchResults.js
import React from 'react';

const SearchResults = ({ results, onSelectResult }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      <ul className="result-list">
        {results.map((result) => (
          <li 
            key={result._id} 
            className="result-item"
            onClick={() => onSelectResult(result)}
          >
            <div className="result-code">{result.code}</div>
            <div className="result-name">{result.personName}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;