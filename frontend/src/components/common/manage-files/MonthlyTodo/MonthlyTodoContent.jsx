import React, { useState } from 'react';
import { CheckCircle, Clock, FileText, Calendar, Filter } from 'lucide-react';
import { getCurrentMonthRequirements, getRequirementsForMonth, monthlyRequirementsConfig } from '../../../../config/monthlyRequirements.js';
import useRequirementsStore from '../../../../store/common/useRequirementsStore.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const MonthlyTodoContent = ({ submittedFiles, requirements = [], userRole = 'staff' }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
    
    // Get current month's requirements from database and filter by selected month
    const getCurrentMonthRequirementsFromConfig = () => {
        return getRequirementsForMonth(selectedMonth);
    };

    // Filter database requirements to only include those that match the selected month's config
    const currentMonthConfigRequirements = getCurrentMonthRequirementsFromConfig();
    
    // If no requirements match the monthly config, show all requirements as fallback
    // Also check if any requirement categories match the monthly config categories
    const monthlyConfigCategories = ['Monthly Report', 'Annual Report', 'Financial Statement', 'Compliance Document'];
    const filteredRequirements = requirements.length > 0 
        ? (requirements.filter(req => 
            currentMonthConfigRequirements.includes(req.title) || 
            monthlyConfigCategories.includes(req.category)
          ).length > 0
            ? requirements.filter(req => 
                currentMonthConfigRequirements.includes(req.title) || 
                monthlyConfigCategories.includes(req.category)
              )
            : requirements) // Fallback: show all requirements if none match monthly config
        : [];
    
    // Requirements are now passed as props from the monthlyTodo API

    // Transform filtered database requirements to the format expected by the component
    const requiredSubmissions = filteredRequirements.map(req => ({
        id: req.requirement_id,
        name: req.title,
        description: req.description || 'No description provided',
        dueDate: dayjs(req.due_date),
        isRequired: req.is_required,
        category: req.category
    }));



    // Get category color styling
    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'annual report':
                return 'bg-red-100 text-red-800';
            case 'monthly report':
                return 'bg-blue-100 text-blue-800';
            case 'financial statement':
                return 'bg-green-100 text-green-800';
            case 'compliance document':
                return 'bg-orange-100 text-orange-800';
            case 'special':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Simplified submission fulfillment check for monthlyTodo
    const isSubmissionFulfilled = (submissionType) => {
        const result = submittedFiles?.some(file => {
            // Date filtering - only consider files from the selected month
            const fileDate = dayjs(file.createdAt);
            const selectedMonthStart = dayjs().month(selectedMonth - 1).startOf('month');
            const selectedMonthEnd = dayjs().month(selectedMonth - 1).endOf('month');
            
            const isInSelectedMonth = fileDate.isBetween(selectedMonthStart, selectedMonthEnd, 'day', '[]');
            
            if (!isInSelectedMonth) {
                return false;
            }

            // Approval status filtering - only consider approved documents for fulfillment
            const approvalStatus = file.approval_status || 'no_request';
            if (approvalStatus === 'rejected') {
                return false;
            }
            
            // Don't mark as fulfilled if approval is still pending
            if (approvalStatus === 'pending') {
                return false;
            }
            
            // Role-based filtering - only consider files submitted by coordinators
            const roleMatches = file.author_info?.author_type?.toLowerCase() === userRole?.toLowerCase();
            
            if (!roleMatches) {
                return false;
            }
            
            // Map submission_type to category for matching
            const typeToCategoryMap = {
                'Annual': 'Annual Report',
                'Monthly': 'Monthly Report', 
                'Quarterly': 'Financial Statement',
                'Special': 'Special',
                'Compliance': 'Compliance Document'
            };
            
            const fileCategory = typeToCategoryMap[file.submission_type];
            
            // Find the requirement object to get its category
            const requirementObj = requirements.find(req => req.title === submissionType);
            const requirementCategory = requirementObj?.category;
            
            // If no requirement object found, don't match
            if (!requirementObj) {
                return false;
            }
            
            // Simple category match - compare file category with requirement category
            let categoryMatches = fileCategory && requirementCategory && 
                                fileCategory.toLowerCase() === requirementCategory.toLowerCase();
            
            // If no direct match, check if file submission_type maps to the requirement category
            if (!categoryMatches && file.submission_type) {
                const typeToCategoryMap = {
                    'Annual': 'Annual Report',
                    'Monthly': 'Monthly Report', 
                    'Quarterly': 'Financial Statement',
                    'Special': 'Special',
                    'Compliance': 'Compliance Document'
                };
                
                const mappedCategory = typeToCategoryMap[file.submission_type];
                categoryMatches = mappedCategory && requirementCategory && 
                                 mappedCategory.toLowerCase() === requirementCategory.toLowerCase();
            }
            
            return categoryMatches;
        });
        
        return result;
    };

    return (
        <div className="space-y-6">
            {/* Required Submissions Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Required Submissions - {dayjs().month(selectedMonth - 1).format('MMMM YYYY')}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Documents that need to be submitted this month by {userRole === 'director' ? 'Director' : userRole === 'staff' ? 'Staff' : 'Coordinator'}
                            </p>
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
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requiredSubmissions.map((submission) => {
                            const isFulfilled = isSubmissionFulfilled(submission.name);
                            return (
                                <div 
                                    key={submission.id}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                        isFulfilled 
                                            ? 'border-green-200 bg-green-50' 
                                            : 'border-gray-200 bg-white hover:border-blue-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2">
                                                <h3 className="font-medium text-gray-900 mb-2">
                                                    {submission.name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(submission.category)}`}>
                                                        {submission.category}
                                                    </span>
                                                    {submission.isRequired && (
                                                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                                            Required
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {submission.description}
                                            </p>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>Due: {submission.dueDate.format('MMM D, YYYY')}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            {isFulfilled ? (
                                                <div className="flex items-center text-green-600">
                                                    <CheckCircle className="w-6 h-6" />
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-orange-500">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {requiredSubmissions.filter(sub => isSubmissionFulfilled(sub.name)).length}
                        </div>
                        <div className="text-sm text-green-700">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                            {requiredSubmissions.filter(sub => !isSubmissionFulfilled(sub.name)).length}
                        </div>
                        <div className="text-sm text-orange-700">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {requiredSubmissions.length}
                        </div>
                        <div className="text-sm text-blue-700">Requirement Files</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyTodoContent;
