import React from 'react';

/**
 * Reusable StatCard component for dashboard statistics
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Card value
 * @param {React.Component} props.icon - Icon component
 * @param {string} props.color - Background color class for icon
 * @param {string} props.subtitle - Optional subtitle
 */
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
