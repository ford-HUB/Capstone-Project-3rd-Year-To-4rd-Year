import React from 'react';

/**
 * Reusable ChartCard component for statistics charts
 * Follows the design pattern from systemPerformance components
 */
const ChartCard = ({ 
    title, 
    icon: Icon, 
    iconColor = 'blue',
    children,
    className = ''
}) => {
    const iconColorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
        orange: 'text-orange-600',
        red: 'text-red-600',
        yellow: 'text-yellow-600',
        indigo: 'text-indigo-600'
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {Icon && <Icon className={`w-5 h-5 ${iconColorClasses[iconColor] || iconColorClasses.blue}`} />}
            </div>
            <div className="h-64">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;

