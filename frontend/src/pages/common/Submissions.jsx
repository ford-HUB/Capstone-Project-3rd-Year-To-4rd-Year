import React, { useState, useEffect } from 'react';
import { Plus, FileText, Filter, Search } from 'lucide-react';
import { useAuthStore as useAuthStaffStore } from '../../store/management/useAuthStore.js';
import { useAuthStore as useAuthCoordinatorStore } from '../../store/management/useAuthStore.js';
import { useAuthStore as useAuthManagementStore } from '../../store/management/useAuthStore.js';
import { useAuthStore as useAuthDirectorStore } from '../../store/director/useAuthStore.js';
import useSubmissionStore from '../../store/common/useSubmissionStore.js';
import SubmissionTable from '../../components/common/submissions/SubmissionTable.jsx';
import SubmissionForm from '../../components/common/submissions/SubmissionForm.jsx';
import NavigationTabs from '../../components/common/manage-files/Navigation/NavigationTabs.jsx';
import { useSearchParams } from 'react-router-dom';

const Submissions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'submissions';
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({});

    // Auth stores
    const { authenticatedStaff } = useAuthStaffStore();
    const { authenticatedCoordinator } = useAuthCoordinatorStore();
    const { authenticatedManagement } = useAuthManagementStore();
    const { authenticatedDirector } = useAuthDirectorStore();

    // Submission store
    const { 
        submissions, 
        loading, 
        fetchSubmissions, 
        createSubmission 
    } = useSubmissionStore();


    // Determine user role and department
    const userRole = authenticatedStaff ? 'staff' : 
                    authenticatedCoordinator ? 'coordinator' : 
                    authenticatedManagement ? 'management' : 
                    authenticatedDirector ? 'director' : 'staff';

    const userDepartment = authenticatedStaff?.department || 
                          authenticatedCoordinator?.department || 
                          authenticatedManagement?.department || 
                          authenticatedDirector?.department;

    // Mock departments - in real app, this would come from an API
    const departments = [
        { department_id: 1, department_name: 'Information Technology' },
        { department_id: 2, department_name: 'Human Resources' },
        { department_id: 3, department_name: 'Finance' },
        { department_id: 4, department_name: 'Operations' },
        { department_id: 5, department_name: 'Marketing' }
    ];

    // Load submissions on component mount
    useEffect(() => {
        const loadSubmissions = async () => {
            try {
                await fetchSubmissions(filters);
            } catch (error) {
                console.error('Error loading submissions:', error);
            }
        };
        
        loadSubmissions();
    }, [fetchSubmissions, filters]);

    const handleSubmitSubmission = async (submissionData) => {
        try {
            const success = await createSubmission(submissionData);
            if (success) {
                setShowForm(false);
                // Refresh submissions list
                await fetchSubmissions(filters);
            }
        } catch (error) {
            console.error('Error submitting:', error);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleTabChange = (tabKey) => {
        setSearchParams({ tab: tabKey });
    };

    // Navigation tabs
    const navTabs = [
        { key: 'submissions', icon: FileText, label: 'Submissions' },
    ];

    // Add form tab if user can create submissions
    if (['staff', 'coordinator', 'assistant_coordinator'].includes(userRole)) {
        navTabs.push({ key: 'submit', icon: Plus, label: 'Submit File' });
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentTab === 'submit' ? 'Submit File' : 'File Submissions'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {currentTab === 'submit' 
                                ? 'Upload and submit files for review'
                                : 'View and manage file submissions'
                            }
                        </p>
                    </div>
                    {currentTab === 'submissions' && (
                        <div className="flex items-center space-x-3">
                            {['staff', 'coordinator', 'assistant_coordinator'].includes(userRole) && (
                                <button
                                    onClick={() => setSearchParams({ tab: 'submit' })}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Submit New File</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <NavigationTabs
                tabs={navTabs}
                activeTab={currentTab}
                onTabChange={handleTabChange}
            />

            {/* Content */}
            <div className="px-6 py-6">
                {currentTab === 'submissions' && (
                    <SubmissionTable
                        submissions={submissions}
                        loading={loading}
                        onFilter={handleFilterChange}
                        filters={filters}
                        userRole={userRole}
                    />
                )}

                {currentTab === 'submit' && (
                    <SubmissionForm
                        onSubmit={handleSubmitSubmission}
                        loading={loading}
                        departments={departments}
                        userDepartment={userDepartment}
                    />
                )}
            </div>
        </div>
    );
};

export default Submissions;
