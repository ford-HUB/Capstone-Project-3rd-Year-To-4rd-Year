import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import DocumentRequestRow from './DocumentRequestRow.jsx';

const DocumentRequestTable = ({
    requests,
    selectedRequests,
    onSelectRequest,
    onSelectAll,
    onOpenReviewModal,
    getFileTypeIcon,
    getStatusColor,
    sortBy,
    sortOrder,
    onSort
}) => {
    const handleSort = (field) => {
        onSort(field);
    };

    const isAllSelected = () => {
        const selectableRequests = requests.filter(r => r.status !== 'approved');
        return selectedRequests.length === selectableRequests.length && selectableRequests.length > 0;
    };

    return (
        <div className="overflow-x-auto pt-6">
            <table className="w-full divide-y divide-gray-200 rounded-md">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left">
                            <div className="flex items-center space-x-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected()}
                                    onChange={onSelectAll}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Select</span>
                            </div>
                        </th>
                        <th 
                            className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('document')}
                        >
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Title</span>
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                        </th>
                        <th 
                            className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('requester')}
                        >
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinator</span>
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </th>
                        <th 
                            className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {requests.map((request) => (
                        <DocumentRequestRow
                            key={request.dra_id}
                            request={request}
                            isSelected={selectedRequests.includes(request.dra_id)}
                            onSelect={onSelectRequest}
                            onOpenReviewModal={onOpenReviewModal}
                            getFileTypeIcon={getFileTypeIcon}
                            getStatusColor={getStatusColor}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentRequestTable;
