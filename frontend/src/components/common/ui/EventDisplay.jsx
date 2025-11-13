import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * Reusable component for displaying event information
 * @param {Object} props - Component props
 * @param {string} props.title - Event title
 * @param {string} props.date - Event date (optional)
 */
const EventDisplay = ({ title, date }) => {
    return (
        <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-green-100 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
                <div className="text-sm font-medium text-gray-900">
                    {title}
                </div>
                {date && (
                    <div className="text-xs text-gray-500">
                        {date}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDisplay;
