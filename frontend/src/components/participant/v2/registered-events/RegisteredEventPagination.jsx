import React from 'react';
import { generatePageNumbers } from '../../../../utils/paginationUtils.js';

const RegisteredEventPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    loading = false
}) => {
    if (totalPages <= 1) return null;

    const pageNumbers = generatePageNumbers(currentPage, totalPages);

    const handlePrevious = () => {
        if (currentPage > 1 && !loading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages && !loading) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        if (page !== currentPage && !loading) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
                Previous
            </button>
            
            <div className="flex items-center space-x-1">
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        disabled={loading}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {page}
                    </button>
                ))}
            </div>
            
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
                Next
            </button>
        </div>
    );
};

export default RegisteredEventPagination;
