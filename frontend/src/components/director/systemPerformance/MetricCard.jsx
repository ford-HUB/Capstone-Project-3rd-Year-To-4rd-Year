import React from 'react';

const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    iconColor = 'blue',
    valueColor = 'gray-900',
    subtitleColor = 'gray-500'
}) => {
    const iconColorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600'
    };

    const valueColorClasses = {
        'gray-900': 'text-gray-900',
        'green-600': 'text-green-600',
        'blue-600': 'text-blue-600',
        'yellow-600': 'text-yellow-600',
        'red-600': 'text-red-600'
    };

    const subtitleColorClasses = {
        'gray-500': 'text-gray-500',
        'green-600': 'text-green-600',
        'blue-600': 'text-blue-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-2xl font-bold ${valueColorClasses[valueColor]}`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className={`text-sm ${subtitleColorClasses[subtitleColor]}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${iconColorClasses[iconColor]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default MetricCard;
