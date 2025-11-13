import React, { useState } from 'react';
import { Check, Clock, FileText, Search, Download, Share2, Eye, Calendar, Filter } from 'lucide-react';
import { documentColorPicker } from '../../../../utils/documentColorPicker.js';
import { GetFirstLetter } from '../../../../utils/GetFirstLetter.js';
import { formatFileSize } from '../../../../utils/formatFileSize.js';
import { getRequirementsForMonth, monthlyRequirementsConfig } from '../../../../config/monthlyRequirements.js';
import useRequirementsStore from '../../../../store/common/useRequirementsStore.js';
import ViewDocumentModal from '../../../modal/ViewDocumentModal.jsx';
import { getStatusColor, getStatusIcon, getStatusText } from '../../../../constants/documentStatus.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const SubmittedFilesTable = ({ submittedFiles, userRole = 'staff' }) => {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
    const { requirements, fetchRequirementsForRole } = useRequirementsStore();
    

    // Ensure requirements are loaded
    React.useEffect(() => {
        if (userRole && requirements.length === 0) {
            fetchRequirementsForRole(userRole);
        }
    }, [userRole, fetchRequirementsForRole, requirements.length]);
    
    // Get current month's requirements from database and filter by selected month
    const getCurrentMonthRequirementsFromConfig = () => {
        return getRequirementsForMonth(selectedMonth);
    };

    // Filter database requirements to only include those that match the selected month's config
    const currentMonthConfigRequirements = getCurrentMonthRequirementsFromConfig();
    
    // If no requirements match the monthly config, show all requirements as fallback
    // Also check if any requirement categories match the monthly config categories
    const monthlyConfigCategories = ['Monthly Report', 'Annual Report', 'Financial Statement', 'Compliance Document'];
    // Default requirements if none are loaded
    const defaultRequirements = ['Monthly Report', 'Financial Statement', 'Compliance Document'];
    
    const currentRequirements = requirements.length > 0 
        ? (requirements.filter(req => 
            currentMonthConfigRequirements.includes(req.title) || 
            monthlyConfigCategories.includes(req.category)
          ).length > 0
            ? requirements.filter(req => 
                currentMonthConfigRequirements.includes(req.title) || 
                monthlyConfigCategories.includes(req.category)
              ).map(req => req.title)
            : requirements.map(req => req.title)) // Fallback: show all requirements if none match monthly config
        : defaultRequirements; // Final fallback: use default requirements
    
    

    // Check if file fulfills a specific requirement type based on category matching
    const getFileRequirementType = (file) => {
        
        // Map submission_type back to category for matching
        const typeToCategoryMap = {
            'Annual': 'Annual Report',
            'Monthly': 'Monthly Report', 
            'Quarterly': 'Financial Statement',
            'Special': 'Special',
            'Compliance': 'Compliance Document'
        };
        const fileCategory = typeToCategoryMap[file.submission_type];
        // Also check if file has a direct category field
        const directCategory = file.category;
        
        // Use the most appropriate category for matching
        const categoryToMatch = fileCategory || directCategory;
        
        // Find matching requirement by category (case-insensitive)
        const matchingRequirement = requirements.find(req => {
            const reqCategory = req.category?.toLowerCase();
            const matchCategory = categoryToMatch?.toLowerCase();
            const matches = reqCategory && matchCategory && reqCategory === matchCategory;
            return matches;
        });
        
        return matchingRequirement ? matchingRequirement.title : null;
    };

    // Simple category-based matching
    const fulfillsRequirement = (file, requirement) => {
        
        // Only check files submitted by coordinators
        if (file.author_info?.author_type !== 'coordinator') {
            return false;
        }
        
        // Check approval status - only consider approved files for fulfillment
        const approvalStatus = file.approval_status || 'no_request';
        if (approvalStatus === 'rejected') {
            return false;
        }
        
        // Don't mark as fulfilled if approval is still pending
        if (approvalStatus === 'pending') {
            return false;
        }
        
        // Get the file's category (from category field or mapped from submission_type)
        let fileCategory = file.category;
        
        // If no category, map from submission_type
        if (!fileCategory && file.submission_type) {
            const typeToCategoryMap = {
                'Monthly': 'Monthly Report',
                'Annual': 'Annual Report',
                'Quarterly': 'Financial Statement',
                'Compliance': 'Compliance Document'
            };
            fileCategory = typeToCategoryMap[file.submission_type];
        }
        
        // Find the requirement object to get its category
        const requirementObj = requirements.find(req => req.title === requirement);
        const requirementCategory = requirementObj?.category;
        
        // If no requirement object found, don't match
        if (!requirementObj) {
            return false;
        }
        
        // Simple category match - compare file category with requirement category
        let matches = fileCategory && requirementCategory && 
                     fileCategory.toLowerCase() === requirementCategory.toLowerCase();
        
        // If no direct match, check if file submission_type maps to the requirement category
        if (!matches && file.submission_type) {
            const typeToCategoryMap = {
                'Annual': 'Annual Report',
                'Monthly': 'Monthly Report', 
                'Quarterly': 'Financial Statement',
                'Special': 'Special',
                'Compliance': 'Compliance Document'
            };
            
            const mappedCategory = typeToCategoryMap[file.submission_type];
            matches = mappedCategory && requirementCategory && 
                     mappedCategory.toLowerCase() === requirementCategory.toLowerCase();
        }
        
        return matches;
    };

    
    // Simplified filtering for monthlyTodo - since backend already handles coordinator-specific filtering
    const requirementFiles = submittedFiles?.filter(file => {
        
        // Date filtering - only show files from the selected month
        const fileDate = dayjs(file.createdAt);
        const selectedMonthStart = dayjs().month(selectedMonth - 1).startOf('month');
        const selectedMonthEnd = dayjs().month(selectedMonth - 1).endOf('month');
        
        const isInSelectedMonth = fileDate.isBetween(selectedMonthStart, selectedMonthEnd, 'day', '[]');
        
        if (!isInSelectedMonth) {
            return false;
        }

        // Approval status filtering - hide rejected documents (backend should already handle this, but double-check)
        const approvalStatus = file.approval_status || 'no_request';
        if (approvalStatus === 'rejected') {
            return false;
        }

        // Role-based filtering (backend should already handle this, but double-check)
        const authorType = file.author_info?.author_type?.toLowerCase();
        const roleMatches = authorType === userRole?.toLowerCase();
        

        return roleMatches;
    }) || [];
    
    
    
    


    // Filter based on search term
    const filteredFiles = requirementFiles.filter(file =>
        file.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.file_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownloadFile = (file) => {
        const link = window.document.createElement('a');
        link.href = file.public_url;
        link.download = file.title;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    const handleShareFile = async (file) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: file.title,
                    text: 'Check out this document',
                    url: file.public_url
                });
            } catch (error) {
            }
        }
    };

    const handleViewFile = (file) => {
        setSelectedDocument(file);
        setViewModalOpen(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search and Actions */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search submitted files..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                {Object.keys(monthlyRequirementsConfig).map(month => (
                                    <option key={month} value={month}>
                                        {dayjs().month(parseInt(month) - 1).format('MMMM')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {currentRequirements.length > 3 && (
                            <div className="text-xs text-gray-500 flex items-center">
                                <span className="mr-1">←</span>
                                <span>Scroll horizontally to see all requirements</span>
                                <span className="ml-1">→</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollable Table Container */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* Table Header */}
                <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                    <div className={`grid gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-max`} 
                         style={{ gridTemplateColumns: `200px 120px 120px 150px ${currentRequirements.map(() => '120px').join(' ')} 120px` }}>
                        <div>File Name</div>
                        <div>Date Submitted</div>
                        <div>File Type</div>
                        <div>Approval Status</div>
                        {currentRequirements.map((requirement) => (
                            <div key={requirement} className="text-center">
                                {requirement}
                            </div>
                        ))}
                        <div>Actions</div>
                    </div>
                </div>


                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => {
                        
                        return (
                            <div key={file.document_id} className="px-6 py-4 hover:bg-gray-50">
                                <div className={`grid gap-4 items-center min-w-max`} 
                                     style={{ gridTemplateColumns: `200px 120px 120px 150px ${currentRequirements.map(() => '120px').join(' ')} 120px` }}>
                                    {/* File Name */}
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 ${documentColorPicker(file.file_type || 'unknown')} rounded-lg flex items-center justify-center`}>
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {file.title || 'Untitled Document'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {file.file_size ? formatFileSize(file.file_size) : 'Unknown size'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Submitted */}
                                    <div className="text-sm text-gray-900">
                                        {file.createdAt ? dayjs(file.createdAt).format('MMM D, YYYY') : 'Unknown date'}
                                    </div>

                                    {/* File Type */}
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {file.category || 'Document'}
                                        </span>
                                    </div>

                                    {/* Approval Status */}
                                    <div>
                                        {file.approval_status && file.approval_status !== 'no_request' ? (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(file.approval_status)}`}>
                                                <span className="mr-1">{getStatusIcon(file.approval_status)}</span>
                                                {getStatusText(file.approval_status)}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <span className="mr-1">📄</span>
                                                No Request
                                            </span>
                                        )}
                                    </div>

                                    {/* Dynamic Requirement Columns */}
                                    {currentRequirements.map((requirement) => {
                                        const isFulfilled = fulfillsRequirement(file, requirement);
                                        
                                        return (
                                            <div key={requirement} className="flex justify-center">
                                                {isFulfilled ? (
                                                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full text-green-600" title={`${requirement} - Fulfilled`}>
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-400" title={`${requirement} - Not fulfilled`}>
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Actions */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleDownloadFile(file)}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button
                                            onClick={() => handleShareFile(file)}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Share"
                                        >
                                            <Share2 className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button
                                            onClick={() => handleViewFile(file)}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="px-6 py-12 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No requirement files found
                        </h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'Try adjusting your search criteria' : `No files matching the required submission types have been uploaded by ${userRole === 'director' ? 'you (Director)' : userRole === 'staff' ? 'you (Staff)' : 'you (Coordinator)'} yet`}
                        </p>
                    </div>
                )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex space-x-4">
                        <span>File submission policy</span>
                        <span>Privacy terms</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Viewing: {dayjs().month(selectedMonth - 1).format('MMMM YYYY')}</span>
                        </div>
                        <div>
                            {filteredFiles.length} requirement file(s) found for {userRole === 'director' ? 'Director' : userRole === 'staff' ? 'Staff' : 'Coordinator'}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Document Modal */}
            {selectedDocument && (
                <ViewDocumentModal
                    open={viewModalOpen}
                    setOpen={setViewModalOpen}
                    mode="view"
                    document={selectedDocument}
                />
            )}
        </div>
    );
};

export default SubmittedFilesTable;
