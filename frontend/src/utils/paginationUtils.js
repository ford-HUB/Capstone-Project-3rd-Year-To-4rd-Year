export const getPaginationInfo = (currentPage, totalPages, pageSize, totalRecords) => {
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);
    
    return {
        startRecord,
        endRecord,
        totalRecords,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        isFirstPage: currentPage === 1,
        isLastPage: currentPage === totalPages
    };
};

export const generatePageNumbers = (currentPage, totalPages, maxVisible = 5) => {
    const pages = [];
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    
    return pages;
};

export const validatePagination = (pagination) => {
    const {
        currentPage = 1,
        pageSize = 10,
        totalRecords = 0,
        totalPages = 1
    } = pagination;
    
    return {
        currentPage: Math.max(1, Math.min(currentPage, totalPages)),
        pageSize: Math.max(1, pageSize),
        totalRecords: Math.max(0, totalRecords),
        totalPages: Math.max(1, totalPages)
    };
};
