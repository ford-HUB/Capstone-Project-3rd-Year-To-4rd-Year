import dayjs from 'dayjs';

/**
 * Utility functions for attendance records
 */

// Format hours display
export const formatHours = (hours) => {
    if (hours === 0) return '0 hours';
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
};

// Get status display configuration
export const getStatusDisplay = (status) => {
    if (status === 'completed') {
        return {
            icon: 'CheckCircle',
            badge: 'bg-green-100 text-green-800',
            text: 'Completed'
        };
    }
    return {
        icon: 'Clock',
        badge: 'bg-blue-100 text-blue-800',
        text: 'In Progress'
    };
};

// Generate year options (current year and previous 5 years)
export const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
};

// Generate month options
export const generateMonthOptions = () => [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
];

// Get current filter label
export const getCurrentFilterLabel = (selectedMonth, selectedYear, monthOptions) => {
    const monthLabel = monthOptions.find(m => m.value === selectedMonth.toString())?.label || 'All Months';
    return `${monthLabel} ${selectedYear}`;
};

// Check if any filters are active
export const isFilterActive = (selectedMonth, selectedYear, currentYear) => {
    return selectedMonth || selectedYear !== currentYear;
};

// Format attendance date
export const formatAttendanceDate = (date) => {
    return dayjs(date).format('MMM D, YYYY');
};

// Format time
export const formatTime = (time) => {
    return dayjs(time).format('h:mm A');
};

// Get default filter values (current month/year)
export const getDefaultFilterValues = () => {
    const currentDate = new Date();
    return {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
    };
};
