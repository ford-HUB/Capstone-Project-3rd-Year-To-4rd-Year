import React from 'react';
import { Filter, Calendar, Tag } from 'lucide-react';

const EventDonationsFilters = ({
    filterStatus,
    filterType,
    dateRange,
    onStatusChange,
    onTypeChange,
    onDateRangeChange
}) => {
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'RECEIVED', label: 'Received' },
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'COMPLETED', label: 'Completed' }
    ];

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'MONEY', label: 'Money' },
        { value: 'GOODS', label: 'Goods' }
    ];

    const dateRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
    ];

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                    value={filterStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <select
                    value={filterType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {typeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                    value={dateRange}
                    onChange={(e) => onDateRangeChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {dateRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default EventDonationsFilters;
