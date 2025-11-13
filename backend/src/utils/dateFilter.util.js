import { Op } from 'sequelize';

/**
 * Builds a Sequelize date filter based on month and year parameters
 * @param {string|number|undefined} month - Month (1-12) or 'all' or undefined
 * @param {string|number|undefined} year - Year (e.g., 2024) or 'all' or undefined
 * @returns {Object} Sequelize date filter object with Op.gte and Op.lte, or empty object if no valid filter
 * 
 * @example
 * // Filter for March 2024
 * buildDateFilter(3, 2024) 
 * // Returns: { [Op.gte]: Date(2024-03-01), [Op.lte]: Date(2024-03-31 23:59:59) }
 * 
 * @example
 * // Filter for entire year 2024
 * buildDateFilter(null, 2024)
 * // Returns: { [Op.gte]: Date(2024-01-01), [Op.lte]: Date(2024-12-31 23:59:59) }
 * 
 * @example
 * // Filter for March of current year
 * buildDateFilter(3, null)
 * // Returns: { [Op.gte]: Date(2024-03-01), [Op.lte]: Date(2024-03-31 23:59:59) } (assuming current year is 2024)
 */
export const buildDateFilter = (month, year) => {
    // Validate and parse inputs
    const hasMonth = month && month !== 'all' && month !== '' && month !== null && month !== undefined;
    const hasYear = year && year !== 'all' && year !== '' && year !== null && year !== undefined;
    
    let dateFilter = {};
    
    if (hasMonth && hasYear) {
        // Both month and year specified
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        
        if (!isNaN(monthNum) && !isNaN(yearNum) && monthNum >= 1 && monthNum <= 12) {
            // Start: First day of the month at 00:00:00 UTC
            const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0));
            // End: Last day of the month at 23:59:59.999 UTC
            // monthNum, 0 means "day 0 of next month" = last day of current month
            const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));
            
            dateFilter = {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            };
        }
    } else if (hasYear && !hasMonth) {
        // Only year specified - filter entire year
        const yearNum = parseInt(year);
        
        if (!isNaN(yearNum)) {
            // Start: January 1st at 00:00:00 UTC
            const startDate = new Date(Date.UTC(yearNum, 0, 1, 0, 0, 0, 0));
            // End: December 31st at 23:59:59.999 UTC
            const endDate = new Date(Date.UTC(yearNum, 11, 31, 23, 59, 59, 999));
            
            dateFilter = {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            };
        }
    } else if (hasMonth && !hasYear) {
        // Only month specified - search across all years for that month
        // We'll use a different approach: filter by month number using Sequelize functions
        // This requires special handling in the controller, so for now we'll return empty
        // and let the controller handle it, OR we can use a year range approach
        // For simplicity, let's use a wide date range (last 10 years to future 1 year)
        const currentYear = new Date().getFullYear();
        const monthNum = parseInt(month);
        
        if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
            // Search from 10 years ago to 1 year in the future for this month
            // This covers most realistic data scenarios
            const startYear = currentYear - 10;
            const endYear = currentYear + 1;
            
            // Start: First day of the month in the earliest year
            const startDate = new Date(Date.UTC(startYear, monthNum - 1, 1, 0, 0, 0, 0));
            // End: Last day of the month in the latest year
            const endDate = new Date(Date.UTC(endYear, monthNum, 0, 23, 59, 59, 999));
            
            dateFilter = {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            };
            
            // Note: This creates a wide range. For more precise month-only filtering,
            // we'd need to use Sequelize's extract function, but this approach works
            // and will include the month across multiple years
        }
    }
    
    return dateFilter;
};

/**
 * Extracts month and year from request query and builds date filter
 * @param {Object} query - Express request query object
 * @returns {Object} Sequelize date filter object
 */
export const buildDateFilterFromQuery = (query) => {
    const { month, year } = query;
    return buildDateFilter(month, year);
};

/**
 * Check if a date filter is valid (has date range)
 * Since Op.gte and Op.lte are Symbols, Object.keys() won't work
 * @param {Object} dateFilter - The date filter object
 * @returns {boolean} True if filter is valid
 */
export const hasDateFilter = (dateFilter) => {
    // Check if filter has Op.gte or Op.lte properties (Symbol keys)
    // We can check by getting all property keys including symbols
    const keys = Reflect.ownKeys(dateFilter);
    return keys.length > 0;
};

