import React, { useState, useEffect } from 'react';
import { X, Download, CheckCircle, XCircle, AlertCircle, FileText, User, Calendar, Star, Eye } from 'lucide-react';
import { documentColorPicker } from '../../utils/documentColorPicker.js';
import { formatFileSize } from '../../utils/formatFileSize.js';
import dayjs from 'dayjs';

const DocumentRequestReviewModal = ({ 
    open, 
    setOpen, 
    request, 
    onApprove, 
    onReject, 
    loading = false 
}) => {
    const [purpose, setPurpose] = useState('');
    const [actionType, setActionType] = useState('');
    const [isLoadingFile, setIsLoadingFile] = useState(true);

    const handleAction = (type) => {
        setActionType(type);
        if (type === 'approve') {
            onApprove({});
        } else if (type === 'reject') {
            onReject({ rejection_reason: purpose });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setPurpose('');
        setActionType('');
    };

    useEffect(() => {
        if (open) {
            setIsLoadingFile(true);
            const timer = setTimeout(() => setIsLoadingFile(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [open]);

    if (!open || !request) return null;

    const getFileTypeName = (fileType) => {
        if (!fileType) return 'Unknown';
        
        switch (fileType) {
            case 'application/pdf':
                return 'PDF';
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'Word';
            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return 'Excel';
            case 'application/vnd.ms-powerpoint':
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                return 'PowerPoint';
            case 'image/jpeg':
            case 'image/png':
                return 'Image';
            case 'text/plain':
                return 'Text';
            default:
                return 'File';
        }
    };

    const getFileTypeIcon = (fileType) => {
        if (!fileType) return <FileText className="w-5 h-5" />;
        
        const colorClass = documentColorPicker(fileType);
        const bgColor = colorClass.split(' ')[0];
        
        return (
            <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center shadow-sm`}>
                <FileText className="w-6 h-6 text-white" />
            </div>
        );
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            {getFileTypeIcon(request.document?.file_type)}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {request.document?.title}
                                </h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center space-x-1">
                                        <User className="w-4 h-4" />
                                        <span>{request.requester?.fullname}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{dayjs(request.created_at).format("MMMM D, YYYY")}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Star className="w-4 h-4" />
                                        <span>{request.priority.toUpperCase()} Priority</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
                        >
                            <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* File Preview */}
                    <div className="flex-1 bg-gray-100 p-6">
                        <div className="bg-white rounded-lg shadow-sm h-full min-h-[400px] relative">
                            {isLoadingFile ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-600 font-medium">Loading document preview...</p>
                                        <p className="text-sm text-gray-500 mt-1">Please wait while we prepare your document</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center w-full h-screen overflow-auto p-4">
                                    <div
                                        style={{
                                            transform: `scale(1)`,
                                            transformOrigin: "top center",
                                            width: `100%`,
                                            height: `100%`,
                                        }}
                                    >
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(request.document?.public_url)}`}
                                            title={request.document?.title}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Review Panel */}
                    <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Request Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Coordinator</label>
                                        <p className="text-sm text-gray-900">{request.requester?.fullname}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Department</label>
                                        <p className="text-sm text-gray-900">{request.requester?.department || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">File Type</label>
                                        <p className="text-sm text-gray-900">{getFileTypeName(request.document?.file_type)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">File Size</label>
                                        <p className="text-sm text-gray-900">{formatFileSize(request.document?.size)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Request Type</label>
                                        <p className="text-sm text-gray-900">{request.request_type}</p>
                                    </div>
                                    {request.request_reason && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Reason</label>
                                            <p className="text-sm text-gray-900">{request.request_reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Purpose (if rejecting)
                                </label>
                                <textarea
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Purpose for rejection (if applicable)..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleAction('approve')}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    <span>{loading && actionType === 'approve' ? 'Processing...' : 'Approve'}</span>
                                </button>
                                
                                <button
                                    onClick={() => handleAction('reject')}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    <XCircle className="w-5 h-5" />
                                    <span>{loading && actionType === 'reject' ? 'Processing...' : 'Reject'}</span>
                                </button>
                            </div>

                            {/* Download Button */}
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = request.document?.public_url || request.document?.file_url;
                                        link.download = request.document?.title;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download File</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentRequestReviewModal;
