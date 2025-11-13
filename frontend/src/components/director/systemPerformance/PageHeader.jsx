import React from 'react';
import RefreshControls from './RefreshControls';

const PageHeader = ({ 
    title, 
    subtitle, 
    onRefresh, 
    isLoading, 
    autoRefresh, 
    onAutoRefreshChange, 
    lastUpdated 
}) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-600 mt-1">{subtitle}</p>
                </div>
                <RefreshControls
                    isLoading={isLoading}
                    onRefresh={onRefresh}
                    autoRefresh={autoRefresh}
                    onAutoRefreshChange={onAutoRefreshChange}
                    lastUpdated={lastUpdated}
                />
            </div>
        </div>
    );
};

export default PageHeader;
