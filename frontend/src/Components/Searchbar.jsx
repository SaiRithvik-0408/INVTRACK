import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce'; 
import { axiosInstance } from '../axios';
import './css/searchbar.css'; // Import the CSS file

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]); 
      return;
    }
    try {
      const response = await axiosInstance.get(`/search?query=${query}`, { withCredentials: true });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedFetchSuggestions(value); 
  };

  const handleSelect = (item) => {
    if (item.type === 'inventory') {
      navigate(`/inventory/${item._id}`);
    } else if (item.type === 'item') {
      navigate(`/item/${item._id}`);
    }
    setSearchTerm(''); // Clear the search bar
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for items, inventories or categories..."
        className="search-input"
      />
      {searchTerm && (
        <ul className="suggestions-list">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                onClick={() => handleSelect(suggestion)}
                className="suggestion-item"
              >
                <span className="suggestion-text">
                  {suggestion.name} {suggestion.type === 'inventory' ? '(Inventory)' : `(Item - ${suggestion.category})`}
                </span>
              </li>
            ))
          ) : (
            <li className="no-results">Nothing found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
