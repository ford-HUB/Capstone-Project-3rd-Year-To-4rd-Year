import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DocumentRequestPagination = ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalResults,
    onPageChange
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(1, Math.min(totalPages - maxVisiblePages + 1, currentPage - 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(endIndex, totalResults)}</span> of <span className="font-semibold">{totalResults}</span> results
                    </div>
                    <div className="text-sm text-gray-500">
                        Page <span className="font-semibold text-blue-600">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                    </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                    currentPage === pageNum
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentRequestPagination;
