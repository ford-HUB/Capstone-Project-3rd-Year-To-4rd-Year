import React from 'react';

const TimeRangeSelector = ({ 
    selectedTimeRange, 
    onTimeRangeChange, 
    options = [6, 12, 24, 48, 72] 
}) => {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Time Range:</span>
                <div className="flex gap-2">
                    {options.map(hours => (
                        <button
                            key={hours}
                            onClick={() => onTimeRangeChange(hours)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                selectedTimeRange === hours
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {hours}h
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimeRangeSelector;
