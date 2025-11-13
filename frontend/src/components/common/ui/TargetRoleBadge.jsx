import React from 'react';

/**
 * Target Role Badge Component
 * Displays a colored badge for target roles (volunteer/beneficiary)
 */
const TargetRoleBadge = ({ targetRole }) => {
    const colors = {
        volunteer: 'bg-blue-100 text-blue-800',
        beneficiary: 'bg-purple-100 text-purple-800'
    };
    
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[targetRole]}`}>
            {targetRole.charAt(0).toUpperCase() + targetRole.slice(1)}
        </span>
    );
};

export default TargetRoleBadge;
