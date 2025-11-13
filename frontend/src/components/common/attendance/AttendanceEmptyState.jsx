import React from 'react';
import { Clock } from 'lucide-react';
import { getCurrentFilterLabel, isFilterActive, generateMonthOptions } from '../../../utils/attendanceUtils.js';

/**
 * Attendance Empty State Component
 * Displays when no attendance records are found
 */
const AttendanceEmptyState = ({
    selectedMonth,
    selectedYear,
    onClearFilters
}) => {
    const currentYear = new Date().getFullYear();
    const monthOptions = generateMonthOptions();
    const filterActive = isFilterActive(selectedMonth, selectedYear, currentYear);
    const currentFilterLabel = getCurrentFilterLabel(selectedMonth, selectedYear, monthOptions);

    return (
        <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
            <p className="text-gray-600">
                {filterActive
                    ? `No records found for ${currentFilterLabel}.` 
                    : 'You haven\'t attended any events yet.'
                }
            </p>
            {filterActive && (
                <button
                    onClick={onClearFilters}
                    className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                    View All Records
                </button>
            )}
        </div>
    );
};

export default AttendanceEmptyState;
