import React from 'react';

const PageHeader = ({
    title,
    description,
    icon: Icon,
    iconBgColor = "bg-blue-100",
    iconColor = "text-blue-600",
    actionButton,
    gradientFrom = "from-blue-50",
    gradientTo = "to-indigo-50",
    className = ""
}) => {
    return (
        <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} border-b border-gray-200 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            {Icon && (
                                <div className={`p-2 ${iconBgColor} rounded-lg`}>
                                    <Icon className={`w-6 h-6 ${iconColor}`} />
                                </div>
                            )}
                            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                        </div>
                        {description && (
                            <p className="text-gray-600 text-lg">{description}</p>
                        )}
                    </div>
                    {actionButton}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
