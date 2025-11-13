import React, { useMemo } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { 
    generateYearOptions, 
    generateMonthOptions, 
    getCurrentFilterLabel, 
    isFilterActive,
    getDefaultFilterValues 
} from '../../../utils/attendanceUtils.js';

/**
 * Attendance Filter Component
 * Handles filtering by month and year with loading states
 */
const AttendanceFilter = ({
    selectedMonth,
    selectedYear,
    isFilterLoading,
    onMonthChange,
    onYearChange,
    onClearFilters
}) => {
    // Memoized options
    const yearOptions = useMemo(() => generateYearOptions(), []);
    const monthOptions = useMemo(() => generateMonthOptions(), []);
    
    // Get current year for comparison
    const currentYear = new Date().getFullYear();
    
    // Check if filters are active
    const filterActive = isFilterActive(selectedMonth, selectedYear, currentYear);
    
    // Get current filter label
    const currentFilterLabel = getCurrentFilterLabel(selectedMonth, selectedYear, monthOptions);

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                        Showing: {currentFilterLabel}
                    </div>
                    {filterActive && (
                        <button
                            onClick={onClearFilters}
                            className="text-xs text-green-600 hover:text-green-700 underline"
                        >
                            Show All Records
                        </button>
                    )}
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                {isFilterLoading && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Applying filters...</span>
                    </div>
                )}
                
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    disabled={isFilterLoading}
                    className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isFilterLoading ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                >
                    <option value="">All Years</option>
                    {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <select
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                    disabled={isFilterLoading}
                    className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isFilterLoading ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                >
                    {monthOptions.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default AttendanceFilter;
