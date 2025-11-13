import React from 'react';

/**
 * Ownership Badge Component
 * Shows ownership statistics for the current user
 */
const OwnershipBadge = ({ owned, total }) => {
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            You own {owned} of {total}
        </span>
    );
};

export default OwnershipBadge;
