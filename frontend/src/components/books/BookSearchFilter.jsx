import React, { useState, useEffect } from 'react';

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
    <div style={{
      background: 'var(--paper-white)',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid var(--light-brown)',
      boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)',
      marginBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔍</span>
          <h3 style={{
            color: 'var(--dark-brown)',
            fontSize: '1.3rem',
            margin: 0,
            fontWeight: '600'
          }}>
            Search & Filter
          </h3>
          {totalResults > 0 && (
            <span style={{
              background: 'var(--primary-brown)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {totalResults} found
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              background: 'none',
              border: '1px solid var(--text-light)',
              color: 'var(--text-light)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#d32f2f';
              e.target.style.color = '#d32f2f';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--text-light)';
              e.target.style.color = 'var(--text-light)';
            }}
          >
            ✕ Clear All
          </button>
        )}
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: 'var(--dark-brown)',
          fontSize: '0.95rem'
        }}>
          Search Books
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search by title, author, or description..."
          style={{
            width: '100%',
            padding: '1rem 1.25rem',
            border: '2px solid var(--light-brown)',
            borderRadius: '12px',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            background: 'var(--parchment)',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary-brown)';
            e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--light-brown)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Quick Filters Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Genre Filter */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.9rem'
          }}>
            Genre
          </label>
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid var(--light-brown)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              background: 'var(--parchment)',
              color: 'var(--text-dark)',
              boxSizing: 'border-box'
            }}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--dark-brown)',
            fontSize: '0.9rem'
          }}>
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid var(--light-brown)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              background: 'var(--parchment)',
              color: 'var(--text-dark)',
              boxSizing: 'border-box'
            }}
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

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary-brown)',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: showAdvanced ? '1.5rem' : 0,
          transition: 'all 0.3s ease'
        }}
      >
        <span style={{
          transform: showAdvanced ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▶
        </span>
        Advanced Filters
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div style={{
          background: 'var(--parchment)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--light-brown)',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {/* Min Rating */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--dark-brown)',
                fontSize: '0.9rem'
              }}>
                Min Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid var(--light-brown)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Any</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            {/* Max Rating */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--dark-brown)',
                fontSize: '0.9rem'
              }}>
                Max Rating
              </label>
              <select
                value={filters.maxRating}
                onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid var(--light-brown)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Any</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars or less</option>
                <option value="3">3 Stars or less</option>
                <option value="2">2 Stars or less</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .filter-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BookSearchFilter;
