import React, { useState, useEffect } from 'react';
import {
    Search,
    Upload,
    FileText,
    Building,
    Users,
    Calendar,
    TrendingUp,
    Filter,
    Download,
    Eye
} from 'lucide-react';
import SubmissionTable from '../../components/common/submissions/SubmissionTable';
import NavigationTabs from '../../components/common/manage-files/Navigation/NavigationTabs';
import useSubmissionStore from '../../store/common/useSubmissionStore.js';
import { useAuthStore as useAuthDirectorStore } from '../../store/director/useAuthStore.js';
import { useAuthStore as useAuthManagementStore } from '../../store/management/useAuthStore.js';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getAllDepartments } from '../../services/common/departmentService.js';

const ManageDocuments = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('all');
    const [departments, setDepartments] = useState([]);
    const [departmentsLoading, setDepartmentsLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    // Auth stores
    const { authenticatedDirector } = useAuthDirectorStore();
    const { authenticatedManagement } = useAuthManagementStore();

    // Submission store
    const { 
        submissions, 
        loading: submissionLoading, 
        fetchSubmissions, 
        createSubmission 
    } = useSubmissionStore();

    // Determine user role and department
    const userRole = authenticatedManagement?.Role.name === 'staff' ? 'staff' : 
                    authenticatedManagement?.Role.name === 'coordinator' ? 'coordinator' : 
                    authenticatedManagement?.Role.name === 'assistant_coordinator' ? 'assistant_coordinator' :
                    authenticatedDirector?.Role.name ? 'director' : 'staff';

    const currentTab = searchParams.get('tab') || (userRole === 'director' ? 'dashboard' : 'submissions');      

    // Fetch departments from API
    const fetchDepartments = async () => {
        try {
            setDepartmentsLoading(true);
            const response = await getAllDepartments();
            if (response.success) {
                setDepartments(response.data);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setDepartmentsLoading(false);
        }
    };

    // Load departments on component mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Load submissions on component mount and when filters change
    useEffect(() => {
        const loadSubmissions = async () => {
            try {
                // Always fetch all submissions first, then filter on frontend
                await fetchSubmissions({});
            } catch (error) {
                console.error('Error loading submissions:', error);
            }
        };
        
        loadSubmissions();
    }, [fetchSubmissions]);

    // Filter submissions based on current filters
    const filteredSubmissions = React.useMemo(() => {
        return submissions.filter(submission => {
            // Department filter (for directors and staff only)
            if (userRole === 'director' || userRole === 'staff') {
                if (departmentFilter === 'all') {
                    // For "All Departments", show all submissions
                    return true;
                } else {
                    // Check if department matches the selected department
                    const departmentName = submission.Department?.department_name;
                    const selectedDept = departments.find(d => d.department_id == departmentFilter);
                    if (!selectedDept || departmentName !== selectedDept.department_name) {
                        return false;
                    }
                }
            }

            // Month filter
            if (monthFilter !== 'all') {
                const submissionMonth = dayjs(submission.createdAt).format('YYYY-MM');
                if (submissionMonth !== monthFilter) {
                    return false;
                }
            }

            // Type filter
            if (typeFilter !== 'all' && submission.submission_type !== typeFilter) {
                return false;
            }

            // Status filter
            if (statusFilter !== 'all' && submission.status !== statusFilter) {
                return false;
            }

            return true;
        });
    }, [submissions, departmentFilter, typeFilter, statusFilter, monthFilter, departments, userRole]);

    // Calculate submission statistics
    const submissionStats = React.useMemo(() => {
        const totalSubmissions = filteredSubmissions.length;
        const annualCount = filteredSubmissions.filter(sub => sub.submission_type === 'Annual').length;
        const monthlyCount = filteredSubmissions.filter(sub => sub.submission_type === 'Monthly').length;
        const quarterlyCount = filteredSubmissions.filter(sub => sub.submission_type === 'Quarterly').length;
        const specialCount = filteredSubmissions.filter(sub => sub.submission_type === 'Special').length;
        const complianceCount = filteredSubmissions.filter(sub => sub.submission_type === 'Compliance').length;

        // Get current month for filtering
        const currentMonth = dayjs().format('YYYY-MM');
        
        // Enhanced department breakdown with monthly data
        const departmentStats = departments.map(dept => {
            const deptSubmissions = filteredSubmissions.filter(sub => 
                sub.Department?.department_name === dept.department_name
            );
            const monthlySubmissions = deptSubmissions.filter(sub => 
                dayjs(sub.createdAt).format('YYYY-MM') === currentMonth
            );
            
            return {
                ...dept,
                totalCount: deptSubmissions.length,
                monthlyCount: monthlySubmissions.length,
                monthlySubmissions: monthlySubmissions,
                allSubmissions: deptSubmissions,
                lastSubmission: deptSubmissions.length > 0 ? 
                    dayjs(deptSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt).format('MMM DD, YYYY') : 
                    'No submissions'
            };
        });


        return {
            total: totalSubmissions,
            byType: {
                annual: annualCount,
                monthly: monthlyCount,
                quarterly: quarterlyCount,
                special: specialCount,
                compliance: complianceCount
            },
            byDepartment: departmentStats,
            currentMonth: dayjs().format('MMMM YYYY')
        };
    }, [filteredSubmissions, departments]);
      
    const handleSubmitSubmission = async (submissionData) => {
        try {
            const success = await createSubmission(submissionData);
            if (success) {
                // Refresh submissions list
                await fetchSubmissions();
            }
        } catch (error) {
            console.error('Error submitting:', error);
        }
    };

    const handleFilterChange = (newFilters) => {
        if (newFilters.department_id !== undefined) {
            setDepartmentFilter(newFilters.department_id || 'all');
        }
        if (newFilters.submission_type !== undefined) {
            setTypeFilter(newFilters.submission_type || 'all');
        }
        if (newFilters.status !== undefined) {
            setStatusFilter(newFilters.status || 'all');
        }
        if (newFilters.month !== undefined) {
            setMonthFilter(newFilters.month || 'all');
        }
    };

    // Navigation tabs data
    const navTabs = [
        { key: 'submissions', icon: FileText, label: 'All Submissions' },
    ];

    // Add dashboard tab only for directors
    if (userRole === 'director') {
        navTabs.unshift({ key: 'dashboard', icon: TrendingUp, label: 'Dashboard' });
    }

    const handleTabChange = (tabKey) => {
        setSearchParams({ tab: tabKey });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentTab === 'dashboard' ? 'Submission Dashboard' : 
                             currentTab === 'submissions' ? 'File Submissions' : 
                             currentTab === 'submit' ? 'Submit File' : 'File Submissions'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {currentTab === 'dashboard' 
                                ? 'Overview of all file submissions and department statistics'
                                : currentTab === 'submissions'
                                ? 'View and manage file submissions from staff and coordinators'
                                : currentTab === 'submit'
                                ? 'Upload and submit files for review'
                                : 'Manage file submissions'
                            }
                        </p>
                    </div>
                    {currentTab === 'submissions' && (
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search submissions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <NavigationTabs
                tabs={navTabs}
                activeTab={currentTab}
                onTabChange={handleTabChange}
            />

            <div className="px-6 py-6">
                {/* Dashboard Tab */}
                {currentTab === 'dashboard' && (
                    <div className="space-y-6">

                        {/* Submission Types */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submissions by Type</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">{submissionStats.byType.annual}</div>
                                    <div className="text-sm text-red-700">Annual</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{submissionStats.byType.monthly}</div>
                                    <div className="text-sm text-blue-700">Monthly</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{submissionStats.byType.quarterly}</div>
                                    <div className="text-sm text-green-700">Quarterly</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{submissionStats.byType.special}</div>
                                    <div className="text-sm text-purple-700">Special</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{submissionStats.byType.compliance}</div>
                                    <div className="text-sm text-orange-700">Compliance</div>
                                </div>
                            </div>
                        </div>

                        {/* Department Breakdown */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Submissions by Department</h3>
                                <span className="text-sm text-gray-500">Current Month: {submissionStats.currentMonth}</span>
                            </div>
                            <div className="space-y-4">
                                {submissionStats.byDepartment.map((dept) => (
                                    <div key={dept.department_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <Building className="w-5 h-5 text-blue-600 mr-3" />
                                                <div>
                                                    <span className="font-semibold text-gray-900">{dept.department_name}</span>
                                                    <p className="text-sm text-gray-500">Last submission: {dept.lastSubmission}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex space-x-2">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        {dept.totalCount} total
                                                    </span>
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                        {dept.monthlyCount} this month
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Monthly Submissions Preview */}
                                        {dept.monthlySubmissions.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Submissions ({submissionStats.currentMonth}):</h4>
                                                <div className="space-y-2">
                                                    {dept.monthlySubmissions.slice(0, 3).map((submission) => (
                                                        <div key={submission.submission_id} className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center">
                                                                <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                                                <span className="text-gray-700">{submission.title}</span>
                                                                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                                    {submission.submission_type}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                    submission.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                                                    submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                    'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                    {submission.status}
                                                                </span>
                                                                <span className="text-gray-500 text-xs">
                                                                    {dayjs(submission.createdAt).format('MMM DD')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {dept.monthlySubmissions.length > 3 && (
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            +{dept.monthlySubmissions.length - 3} more submissions this month
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {dept.monthlySubmissions.length === 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-sm text-gray-500 italic">No submissions this month</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Submissions Tab */}
                {currentTab === 'submissions' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">File Submissions</h3>
                                <div className="flex items-center space-x-4">
                                    {/* Department filter - only for directors and staff */}
                                    {(userRole === 'director' || userRole === 'staff') && (
                                        <div className="flex items-center space-x-2">
                                            <Building className="w-5 h-5 text-gray-400" />
                                            <label className="text-sm font-medium text-gray-700">Department:</label>
                                            <select
                                                value={departmentFilter}
                                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
                                            >
                                                {/* Show "All Departments" option only for directors and staff */}
                                                {(userRole === 'director' || userRole === 'staff') && (
                                                    <option value="all">All Departments</option>
                                                )}
                                                {departments.map((dept) => (
                                                    <option key={dept.department_id} value={dept.department_id}>
                                                        {dept.department_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    
                                    {/* Month filter - for all users */}
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <label className="text-sm font-medium text-gray-700">Month:</label>
                                        <select
                                            value={monthFilter}
                                            onChange={(e) => setMonthFilter(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
                                        >
                                            <option value="all">All Months</option>
                                            {Array.from({ length: 12 }, (_, i) => {
                                                const date = dayjs().subtract(i, 'month');
                                                return (
                                                    <option key={date.format('YYYY-MM')} value={date.format('YYYY-MM')}>
                                                        {date.format('MMMM YYYY')}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Selected Department Info - for directors and staff */}
                            {(userRole === 'director' || userRole === 'staff') && departmentFilter !== 'all' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center">
                                        <Building className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="font-medium text-blue-900">
                                            Showing submissions for: {
                                                departments.find(d => d.department_id == departmentFilter)?.department_name
                                            }
                                        </span>
                                        {/* Show "Show All Departments" button only for directors and staff */}
                                        {(userRole === 'director' || userRole === 'staff') && (
                                            <button
                                                onClick={() => setDepartmentFilter('all')}
                                                className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Show All Departments
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Selected Month Info */}
                            {monthFilter !== 'all' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 text-green-600 mr-2" />
                                        <span className="font-medium text-green-900">
                                            Showing submissions for: {dayjs(monthFilter).format('MMMM YYYY')}
                                        </span>
                                        <button
                                            onClick={() => setMonthFilter('all')}
                                            className="ml-auto text-green-600 hover:text-green-800 text-sm font-medium"
                                        >
                                            Show All Months
                                        </button>
                                    </div>
                                </div>
                            )}

                            <SubmissionTable
                                submissions={filteredSubmissions}
                                loading={submissionLoading}
                                onFilter={handleFilterChange}
                                filters={{
                                    department_id: (userRole === 'director' || userRole === 'staff') && departmentFilter !== 'all' ? departmentFilter : undefined,
                                    submission_type: typeFilter !== 'all' ? typeFilter : undefined,
                                    status: statusFilter !== 'all' ? statusFilter : undefined,
                                    month: monthFilter !== 'all' ? monthFilter : undefined
                                }}
                                userRole={userRole}
                            />
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default ManageDocuments;
