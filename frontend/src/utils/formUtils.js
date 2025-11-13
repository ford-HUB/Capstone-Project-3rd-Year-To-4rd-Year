/**
 * Form utility functions
 */

/**
 * Get ownership statistics for form links
 * @param {Array} formLinks - Array of form links
 * @param {Object} authenticatedDirector - Current authenticated director
 * @returns {Object} Object with owned and total counts
 */
export const getOwnershipStats = (formLinks, authenticatedDirector) => {
    if (!authenticatedDirector || formLinks.length === 0) {
        return { owned: 0, total: 0 };
    }
    
    const owned = formLinks.filter(formLink => 
        formLink.created_by === authenticatedDirector.account_id
    ).length;
    
    return { owned, total: formLinks.length };
};
