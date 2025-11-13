import React from 'react';
import { FileText } from 'lucide-react';

/**
 * Reusable component for displaying form details
 * @param {Object} props - Component props
 * @param {string} props.title - Form title
 * @param {string} props.type - Form type (optional)
 */
const FormDetailsDisplay = ({ title, type }) => {
    return (
        <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
                <div className="text-sm font-medium text-gray-900">
                    {title}
                </div>
                {type && (
                    <div className="text-xs text-gray-500">
                        {type}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormDetailsDisplay;
