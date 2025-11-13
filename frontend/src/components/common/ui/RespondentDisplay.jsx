import React from 'react';
import { User } from 'lucide-react';

/**
 * Reusable component for displaying respondent information
 * @param {Object} props - Component props
 * @param {string} props.name - Respondent name
 * @param {string} props.email - Respondent email
 */
const RespondentDisplay = ({ name, email }) => {
    return (
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-full">
                <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
                <div className="text-sm font-semibold text-gray-900">
                    {name}
                </div>
                <div className="text-sm text-gray-500">
                    {email}
                </div>
            </div>
        </div>
    );
};

export default RespondentDisplay;
