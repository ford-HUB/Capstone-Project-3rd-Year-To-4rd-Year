import React from 'react';
import { Eye, FileText } from 'lucide-react';
import { documentColorPicker } from '../../utils/documentColorPicker.js';

const DocumentRequestRow = ({ 
    request, 
    isSelected, 
    onSelect, 
    onOpenReviewModal,
    getFileTypeIcon,
    getStatusColor 
}) => {
    return (
        <tr key={request.dra_id} className="hover:bg-gray-50 transition-colors group">
            <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelect(request.dra_id)}
                            disabled={request.status === 'approved'}
                            className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                request.status === 'approved' 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'cursor-pointer'
                            }`}
                        />
                        {request.status === 'approved' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" 
                                 title="Already approved - cannot be selected">
                            </div>
                        )}
                    </div>
                    {/* File Type Icon */}
                    <div className="flex-shrink-0">
                        {getFileTypeIcon(request.document?.file_type)}
                    </div>
                </div>
            </td>
            
            {/* Title Column - Main content like the reference */}
            <td className="px-4 py-3">
                <div>
                    <div className="text-sm font-semibold text-gray-900">
                        {request.document?.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Sent {new Date(request.created_at).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                        })} at {new Date(request.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
            </td>
            
            {/* Department Column */}
            <td className="px-4 py-3">
                <div className="text-sm text-gray-900">
                    {request.requester?.department || 'N/A'}
                </div>
            </td>
            
            {/* Coordinator Column */}
            <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                                {request.requester?.fullname?.charAt(0)}
                            </span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-900 min-w-0">
                        <div className="truncate">
                            {request.requester?.fullname?.split(' ')[0]}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {request.requester?.fullname?.split(' ').slice(1).join(' ')}
                        </div>
                    </div>
                </div>
            </td>
            
            {/* Status Column */}
            <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ').toUpperCase()}
                </span>
            </td>
            
            {/* Actions Column */}
            <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                    {request.status === 'pending' ? (
                        <button
                            onClick={() => onOpenReviewModal(request)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                            <Eye className="w-4 h-4" />
                            <span>Review</span>
                        </button>
                    ) : (
                        <span className="flex items-center space-x-1 px-3 py-1.5 transition-colors text-sm">
                            <span></span>
                        </span>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default DocumentRequestRow;
