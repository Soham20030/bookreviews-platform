import React, { useState, useEffect } from 'react';
import '../../components/search-filter.css';

const BookSearchFilter = ({ onFiltersChange, genres = [], totalResults = 0 }) => {
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    minRating: '',
    maxRating: '',
    sortBy: 'newest'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onFiltersChange(filters);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      genre: '',
      minRating: '',
      maxRating: '',
      sortBy: 'newest'
    };
    setFilters(resetFilters);
  };

  const hasActiveFilters = filters.search || filters.genre || filters.minRating || filters.maxRating;

  return (
    <div className="search-filter-container">
      {/* Main search bar */}
      <div className="search-bar-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search books by title, author, or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <button
          className="btn btn-secondary advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide Filters' : 'More Filters'} 
          <span className={`arrow ${showAdvanced ? 'up' : 'down'}`}>▼</span>
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Genre:</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="filter-select"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Rating Range:</label>
              <div className="rating-range">
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="filter-select small"
                >
                  <option value="">Min</option>
                  <option value="1">1★+</option>
                  <option value="2">2★+</option>
                  <option value="3">3★+</option>
                  <option value="4">4★+</option>
                  <option value="5">5★</option>
                </select>
                <span className="range-separator">to</span>
                <select
                  value={filters.maxRating}
                  onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                  className="filter-select small"
                >
                  <option value="">Max</option>
                  <option value="2">2★</option>
                  <option value="3">3★</option>
                  <option value="4">4★</option>
                  <option value="5">5★</option>
                </select>
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="author">Author A-Z</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Reviewed</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="filter-actions">
              <button onClick={clearFilters} className="btn btn-outline clear-filters">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results summary */}
      <div className="results-summary">
        <span>{totalResults} books found</span>
        {hasActiveFilters && (
          <span className="active-filters-indicator">
            • Filters active
          </span>
        )}
      </div>
    </div>
  );
};

export default BookSearchFilter;
