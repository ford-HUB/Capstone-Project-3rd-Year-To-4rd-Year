import React from 'react';

/**
 * Reusable Pagination Component
 * Provides consistent pagination functionality
 */
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    showInfo = true,
    className = "mt-8 flex items-center justify-between"
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className={className}>
            {showInfo && (
                <div className="text-sm text-gray-600">
                    Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalPages}</span>
                </div>
            )}
            <div className="flex space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    <span>Previous</span>
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    <span>Next</span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
