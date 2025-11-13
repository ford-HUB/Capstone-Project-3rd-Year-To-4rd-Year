import React from 'react';

/**
 * Reusable Action Buttons Component
 * Provides consistent action button styling and behavior
 */
const ActionButtons = ({ 
    actions = [], 
    className = "flex items-center space-x-1" 
}) => {
    return (
        <div className={className}>
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={`group flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${action.className}`}
                    title={action.title}
                >
                    <action.icon size={16} />
                </button>
            ))}
        </div>
    );
};

export default ActionButtons;
