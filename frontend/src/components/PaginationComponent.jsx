// User interface element that allows users to navigate through large sets of data 
  
import React from 'react';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    //Page numbers are generated based on total pages
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className='Pagination-container'>
            <button className='Pagination-button' disabled={currentPage==1} on onClick={()=> onPageChange(currentPage-1)}>
                &laquo; Prev
            </button>

            {pages.map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={`Pagination-button ${currentPage === pageNumber ? 'active' : ''}`}           
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}

                <button className='pagination-button'
                onClick={()=> onPageChange(currentPage+1)}
                disabled={currentPage==totalPages}>Next &raquo;
                </button>
        </div>
    )
}

export default PaginationComponent;

