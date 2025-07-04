import React from 'react';
import { Button } from './index';

const Pagination = ({
  currentPage = 0,
  totalPages = 0,
  totalElements = 0,
  pageSize = 10,
  onPageChange,
  showInfo = true,
  showSizeSelector = false,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
  className = ''
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(0, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (range[0] > 0) {
      if (range[0] > 1) {
        rangeWithDots.push(0, '...');
      } else {
        rangeWithDots.push(0);
      }
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages - 1) {
      if (range[range.length - 1] < totalPages - 2) {
        rangeWithDots.push('...', totalPages - 1);
      } else {
        rangeWithDots.push(totalPages - 1);
      }
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 ${className}`}>
      {/* Info */}
      {showInfo && (
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalElements}</span> results
          </p>
          
          {/* Page Size Selector */}
          {showSizeSelector && onPageSizeChange && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700">Show:</label>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2 py-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-1 text-sm text-gray-500">...</span>
            ) : (
              <Button
                variant={currentPage === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
                className="px-3 py-1 min-w-[2rem]"
              >
                {page + 1}
              </Button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2 py-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
