import React from 'react';

/**
 * Reusable Data Table Component
 * Provides consistent table styling and structure
 */
const DataTable = ({
    columns = [],
    data = [],
    renderRow,
    loading = false,
    emptyState,
    className = "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden",
    headerClassName = "bg-gradient-to-r from-gray-50 to-gray-100",
    rowClassName = "hover:bg-blue-50/30 transition-colors duration-200"
}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!data.length) {
        return emptyState || (
            <div className="text-center py-12">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={headerClassName}>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((item, index) => (
                            <tr key={item.id || index} className={rowClassName}>
                                {renderRow(item, index)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
