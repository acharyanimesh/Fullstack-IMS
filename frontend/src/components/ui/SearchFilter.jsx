import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from './index';

const SearchFilter = ({
  searchTerm = '',
  onSearchChange,
  filters = [],
  onFilterChange,
  onClearFilters,
  showClearButton = true,
  placeholder = 'Search...',
  className = ''
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(localSearchTerm);
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [localSearchTerm]);

  const handleSearchChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterKey, value) => {
    if (onFilterChange) {
      onFilterChange(filterKey, value);
    }
  };

  const handleClearAll = () => {
    setLocalSearchTerm('');
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const hasActiveFilters = localSearchTerm || filters.some(filter => filter.value);

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-4">
          <Input
            placeholder={placeholder}
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        {/* Filter Selects */}
        {filters.map((filter, index) => (
          <div key={filter.key} className="md:col-span-2">
            <Select
              placeholder={filter.placeholder || `All ${filter.label}`}
              value={filter.value || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              options={filter.options}
              className="w-full"
            />
          </div>
        ))}

        {/* Clear Button */}
        {showClearButton && hasActiveFilters && (
          <div className="md:col-span-2">
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="w-full"
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Results Info */}
        <div className="md:col-span-2 text-sm text-gray-600 text-right">
          {filters.length > 0 && filters[0].resultCount !== undefined && (
            <span>
              {filters[0].resultCount} results
            </span>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {localSearchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Search: "{localSearchTerm}"
              <button
                onClick={() => setLocalSearchTerm('')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          
          {filters.map((filter) => (
            filter.value && (
              <span key={filter.key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                {filter.label}: {filter.options.find(opt => opt.value === filter.value)?.label || filter.value}
                <button
                  onClick={() => handleFilterChange(filter.key, '')}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
