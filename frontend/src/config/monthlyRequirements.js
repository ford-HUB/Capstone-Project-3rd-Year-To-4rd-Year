// Monthly Requirements Configuration
// This file can be updated to change requirements for different months

export const getCurrentMonthRequirements = () => {
    // You can modify this array to change requirements for different months
    // For example, you could check the current month and return different requirements
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    // Default requirements for all months
    const defaultRequirements = [
        'Annual Report',
        'Monthly Report', 
        'Financial Statement',
        'Compliance Document'
    ];
    
    // Example: Different requirements for different months
    // if (currentMonth === 12) {
    //     return ['Annual Report', 'Year-end Financial Statement', 'Compliance Document'];
    // }
    // if (currentMonth === 6) {
    //     return ['Mid-year Report', 'Financial Statement', 'Compliance Document'];
    // }
    
    return defaultRequirements;
};

// You can also define specific requirements for each month
export const monthlyRequirementsConfig = {
    1: ['Annual Report', 'Monthly Report', 'Financial Statement', 'Compliance Document'],
    2: ['Monthly Report', 'Financial Statement', 'Compliance Document'],
    3: ['Monthly Report', 'Financial Statement', 'Compliance Document'],
    4: ['Monthly Report', 'Financial Statement', 'Compliance Document'],
    5: ['Monthly Report', 'Financial Statement', 'Compliance Document'],
    6: ['Monthly Report', 'Financial Statement', 'Compliance Document'], // Changed from 'Mid-year Report'
    7: ['Monthly Report', 'Financial Statement', 'Compliance Document'],
    8: ['Monthly Report', 'Financial Statement', 'Compliance Document'],
    9: ['Monthly Report', 'Financial Statement', 'Compliance Document'],
    10: ['Monthly Report', 'Financial Statement', 'Compliance Document'],
    11: ['Monthly Report', 'Financial Statement', 'Compliance Document'],
    12: ['Annual Report', 'Financial Statement', 'Compliance Document'] // Changed from 'Year-end Financial Statement'
};

// Function to get requirements for a specific month
export const getRequirementsForMonth = (month) => {
    return monthlyRequirementsConfig[month] || monthlyRequirementsConfig[1];
};
