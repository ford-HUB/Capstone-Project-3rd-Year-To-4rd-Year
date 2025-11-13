import React, { useState } from 'react';
import { Eye, Download, Calendar, User, Building, FileText, Filter, Search } from 'lucide-react';
import dayjs from 'dayjs';
import ViewDocumentModal from '../../modal/ViewDocumentModal.jsx';

const SubmissionTable = ({ submissions, loading, onFilter, filters, userRole }) => {
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleViewSubmission = (submission) => {
        setSelectedSubmission(submission);
        setShowViewModal(true);
    };

    const handleDownloadFile = (submission) => {
        const link = window.document.createElement('a');
        link.href = submission.public_url;
        link.download = submission.title;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            case 'under_review':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Annual':
                return 'bg-red-100 text-red-800';
            case 'Monthly':
                return 'bg-blue-100 text-blue-800';
            case 'Quarterly':
                return 'bg-green-100 text-green-800';
            case 'Special':
                return 'bg-purple-100 text-purple-800';
            case 'Compliance':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredSubmissions = submissions?.filter(submission => {
        // Filter by search term
        const matchesSearch = 
            submission.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.Department?.department_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.submission_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.status?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by submission type if filter is set
        const matchesType = !filters?.submission_type || 
            submission.submission_type === filters.submission_type;
        
        return matchesSearch && matchesType;
    }) || [];


    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white w-full rounded-lg border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search submissions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Filters */}
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={filters?.submission_type || ''}
                                onChange={(e) => onFilter({ ...filters, submission_type: e.target.value || undefined })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                <option value="Annual">Annual</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Special">Special</option>
                                <option value="Compliance">Compliance</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                File Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Submitted By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date Submitted
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubmissions.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No submissions found
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchTerm ? 'Try adjusting your search criteria' : 'No submissions have been made yet'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            filteredSubmissions.map((submission) => {
                                // Use the new submitted_by_display field if available, otherwise fallback to old logic
                                const submittedByName = submission.submitted_by_display || 
                                    (submission.Account?.Staff ? `${submission.Account.Staff.firstname} ${submission.Account.Staff.lastname}` :
                                     submission.Account?.Coordinator ? `${submission.Account.Coordinator.firstname} ${submission.Account.Coordinator.lastname}` :
                                     submission.Account?.Director ? `${submission.Account.Director.firstname} ${submission.Account.Director.lastname}` :
                                     'Unknown User');

                                return (
                                    <tr key={submission.submission_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {submission.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {submission.file_type}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 text-gray-400 mr-2" />
                                                <div className="text-sm text-gray-900">
                                                    {submittedByName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Building className="w-4 h-4 text-gray-400 mr-2" />
                                                <div className="text-sm text-gray-900">
                                                    {submission.Department?.department_name || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(submission.submission_type)}`}>
                                                {submission.submission_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                                                {submission.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                <div className="text-sm text-gray-900">
                                                    {dayjs(submission.createdAt).format('MMM D, YYYY')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewSubmission(submission)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                                                    title="View submission"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadFile(submission)}
                                                    className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                                                    title="Download file"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {showViewModal && selectedSubmission && (
                <ViewDocumentModal
                    open={showViewModal}
                    setOpen={setShowViewModal}
                    document={{
                        ...selectedSubmission,
                        author: {
                            author_firstname: selectedSubmission.Account?.Staff?.firstname || selectedSubmission.Account?.Coordinator?.firstname || '',
                            author_lastname: selectedSubmission.Account?.Staff?.lastname || selectedSubmission.Account?.Coordinator?.lastname || ''
                        }
                    }}
                />
            )}
        </div>
    );
};

export default SubmissionTable;
