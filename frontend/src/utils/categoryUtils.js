/**
 * Utility functions for category styling and colors
 */

/**
 * Get category style classes for badges
 * @param {string} category - Category name
 * @returns {string} Tailwind CSS classes
 */
export const getCategoryStyle = (category) => {
    const categoryColors = {
        Community: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        Charity: 'bg-blue-50 text-blue-700 border border-blue-200',
        Emergency: 'bg-red-50 text-red-700 border border-red-200',
        School: 'bg-green-50 text-green-700 border border-green-200',
        'Donation Drive': 'bg-purple-50 text-purple-700 border border-purple-200',
        'Relief Program': 'bg-orange-50 text-orange-700 border border-orange-200',
        Health: 'bg-pink-50 text-pink-700 border border-pink-200',
        Outreach: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
        Training: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        Seminar: 'bg-teal-50 text-teal-700 border border-teal-200',
        General: 'bg-gray-50 text-gray-700 border border-gray-200',
    };

    return categoryColors[category] || 'bg-gray-50 text-gray-700 border border-gray-200';
};

/**
 * Get category color for calendar dots
 * @param {string} category - Category name
 * @returns {string} Tailwind CSS color class
 */
export const getCategoryColor = (category) => {
    const categoryColors = {
        Community: 'bg-yellow-500',
        Charity: 'bg-blue-500',
        Emergency: 'bg-red-500',
        School: 'bg-green-500',
        'Donation Drive': 'bg-purple-500',
        'Relief Program': 'bg-orange-500',
        Health: 'bg-pink-500',
        Outreach: 'bg-cyan-500',
        Training: 'bg-indigo-500',
        Seminar: 'bg-teal-500',
        General: 'bg-gray-500',
    };

    return categoryColors[category] || 'bg-gray-500';
};

/**
 * Get status badge classes
 * @param {string} status - Event status
 * @returns {string} Tailwind CSS classes
 */
export const getStatusBadgeClasses = (status) => {
    if (status === 'Ongoing') return 'bg-green-100 text-green-700';
    if (status === 'Upcoming') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
};

