import React from 'react';

/**
 * Creator Display Component
 * Shows creator information with special styling for current user
 */
const CreatorDisplay = ({ formLink, authenticatedDirector }) => {
    // Helper function to get creator display name
    const getCreatorDisplayName = (formLink) => {
        if (!formLink.Accounts || !authenticatedDirector) {
            return formLink.Accounts?.email || 'Unknown';
        }
        
        // Check if the current user created this form link
        if (formLink.created_by === authenticatedDirector.account_id) {
            return 'You';
        }
        
        return formLink.Accounts.email;
    };

    const displayName = getCreatorDisplayName(formLink);
    const isCurrentUser = displayName === 'You';
    
    return (
        <span className={`font-medium ${isCurrentUser ? 'text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs' : 'text-gray-700'}`}>
            {displayName}
        </span>
    );
};

export default CreatorDisplay;
