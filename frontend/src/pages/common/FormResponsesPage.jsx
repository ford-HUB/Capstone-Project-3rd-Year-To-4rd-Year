import React, { useState, useEffect } from 'react';
import { 
    BarChart3, 
    Filter,
    Download,
    Eye,
    FileText
} from 'lucide-react';

// Import DRY components
import PageHeader from '../../components/common/layout/PageHeader.jsx';
import FilterSection from '../../components/common/filters/FilterSection.jsx';
import SearchInput from '../../components/common/filters/SearchInput.jsx';
import SelectFilter from '../../components/common/filters/SelectFilter.jsx';
import DataTable from '../../components/common/table/DataTable.jsx';
import ActionButtons from '../../components/common/actions/ActionButtons.jsx';
import ResultsSummary from '../../components/common/layout/ResultsSummary.jsx';
import Pagination from '../../components/common/pagination/Pagination.jsx';
import EmptyState from '../../components/common/forms/state/EmptyState';
import DashboardStats from '../../components/common/dashboard/DashboardStats.jsx';

// Import UI components
import TargetRoleBadge from '../../components/common/ui/TargetRoleBadge.jsx';
import RespondentDisplay from '../../components/common/ui/RespondentDisplay.jsx';
import FormDetailsDisplay from '../../components/common/ui/FormDetailsDisplay.jsx';
import EventDisplay from '../../components/common/ui/EventDisplay.jsx';

// Import utilities
import { formatDate } from '../../utils/dateUtils.js';

const FormResponsesPage = () => {
    // Mock data - replace with actual API calls
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        form_type: '',
        event_id: '',
        date_range: ''
    });

    // Mock dashboard data
    const dashboardStats = {
        totalResponses: 1247,
        totalForms: 12,
        totalRespondents: 856,
        responseRate: 68.5
    };

    // Mock responses data
    const mockResponses = [
        {
            id: 1,
            respondent_name: "John Doe",
            respondent_email: "john.doe@email.com",
            form_title: "Volunteer Feedback Form",
            event_title: "Community Cleanup Drive",
            target_role: "volunteer",
            submitted_at: "2024-01-15T10:30:00Z",
            response_data: {
                rating: 5,
                feedback: "Great event! Very well organized.",
                suggestions: "More water stations next time"
            }
        },
        {
            id: 2,
            respondent_name: "Jane Smith",
            respondent_email: "jane.smith@email.com",
            form_title: "Beneficiary Evaluation",
            event_title: "Food Distribution Program",
            target_role: "beneficiary",
            submitted_at: "2024-01-14T14:20:00Z",
            response_data: {
                satisfaction: "Very Satisfied",
                feedback: "The food was fresh and nutritious",
                improvements: "Faster distribution process"
            }
        },
        {
            id: 3,
            respondent_name: "Mike Johnson",
            respondent_email: "mike.johnson@email.com",
            form_title: "Event Registration Form",
            event_title: "Health Awareness Campaign",
            target_role: "volunteer",
            submitted_at: "2024-01-13T09:15:00Z",
            response_data: {
                interest: "High",
                availability: "Weekends",
                skills: "Medical background"
            }
        }
    ];

    useEffect(() => {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
            setResponses(mockResponses);
            setLoading(false);
        }, 1000);
    }, [currentPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            form_type: '',
            event_id: '',
            date_range: ''
        });
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle view response
    const handleViewResponse = (response) => {
        // Open response details modal or navigate to detail page
        console.log('View response:', response);
    };

    // Handle download response
    const handleDownloadResponse = (response) => {
        // Download response as PDF or CSV
        console.log('Download response:', response);
    };

    // Prepare filter options
    const formTypeOptions = [
        { value: 'volunteer', label: 'Volunteer Forms' },
        { value: 'beneficiary', label: 'Beneficiary Forms' }
    ];

    const eventOptions = [
        { value: 1, label: 'Community Cleanup Drive' },
        { value: 2, label: 'Food Distribution Program' },
        { value: 3, label: 'Health Awareness Campaign' }
    ];

    const dateRangeOptions = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' }
    ];

    // Prepare table columns
    const tableColumns = [
        { header: 'Respondent' },
        { header: 'Form Details' },
        { header: 'Event' },
        { header: 'Target Role' },
        { header: 'Submitted' },
        { header: 'Actions' }
    ];

    // Prepare action buttons for each row
    const getActionButtons = (response) => [
        {
            icon: Eye,
            onClick: () => handleViewResponse(response),
            title: 'View Response',
            className: 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100'
        },
        {
            icon: Download,
            onClick: () => handleDownloadResponse(response),
            title: 'Download Response',
            className: 'text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100'
        }
    ];

    // Render table row
    const renderTableRow = (response) => (
        <>
            <td className="px-6 py-5">
                <RespondentDisplay 
                    name={response.respondent_name}
                    email={response.respondent_email}
                />
            </td>
            <td className="px-6 py-5">
                <FormDetailsDisplay 
                    title={response.form_title}
                />
            </td>
            <td className="px-6 py-5">
                <EventDisplay 
                    title={response.event_title}
                />
            </td>
            <td className="px-6 py-5">
                <TargetRoleBadge targetRole={response.target_role} />
            </td>
            <td className="px-6 py-5">
                <div className="text-sm text-gray-600">
                    {formatDate(response.submitted_at)}
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <ActionButtons actions={getActionButtons(response)} />
            </td>
        </>
    );


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <PageHeader
                title="Form Responses"
                description="View and analyze responses from your Google Forms"
                icon={BarChart3}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Dashboard Stats */}
                <DashboardStats stats={dashboardStats} />

                {/* Filters */}
                <FilterSection
                    title="Filter Responses"
                    icon={Filter}
                    onClearFilters={clearFilters}
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <SearchInput
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Search by name or email..."
                            label="Search"
                        />
                        
                        <SelectFilter
                            label="Form Type"
                            value={filters.form_type}
                            onChange={(e) => handleFilterChange('form_type', e.target.value)}
                            options={formTypeOptions}
                            placeholder="All Form Types"
                        />
                        
                        <SelectFilter
                            label="Event"
                            value={filters.event_id}
                            onChange={(e) => handleFilterChange('event_id', e.target.value)}
                            options={eventOptions}
                            placeholder="All Events"
                        />

                        <SelectFilter
                            label="Date Range"
                            value={filters.date_range}
                            onChange={(e) => handleFilterChange('date_range', e.target.value)}
                            options={dateRangeOptions}
                            placeholder="All Time"
                        />
                    </div>
                </FilterSection>

                {/* Results Summary */}
                <ResultsSummary
                    currentCount={responses.length}
                    totalCount={responses.length}
                    itemName="responses"
                    showStatus={true}
                />

                {/* Responses Table */}
                <DataTable
                    columns={tableColumns}
                    data={responses}
                    renderRow={renderTableRow}
                    loading={loading}
                    emptyState={
                        <div className="bg-white rounded-lg border border-gray-200">
                            <EmptyState
                                icon={FileText}
                                title={filters.search || filters.form_type || filters.event_id || filters.date_range ? "No responses found" : "No form responses yet"}
                                description={
                                    filters.search || filters.form_type || filters.event_id || filters.date_range
                                        ? "Try adjusting your search or filters"
                                        : "Form responses will appear here once users start submitting your forms"
                                }
                            />
                        </div>
                    }
                />

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(responses.length / 10)}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default FormResponsesPage;
