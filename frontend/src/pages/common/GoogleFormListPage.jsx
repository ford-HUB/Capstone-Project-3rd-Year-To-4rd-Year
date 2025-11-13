import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Eye, 
    Trash2, 
    Search, 
    Plus,
    FileText,
    Calendar
} from 'lucide-react';

// Import store and services
import { useFormStore } from '../../store/common/useFormStore.js';
import { getEventsV2 } from '../../services/common/formService.js';
import { useAuthStore as useDirectorAuth } from '../../store/director/useAuthStore.js';
import { useAuthStore as useManagementAuth } from '../../store/management/useAuthStore.js';
import toast from 'react-hot-toast';

// Import DRY components
import PageHeader from '../../components/common/layout/PageHeader.jsx';
import FilterSection from '../../components/common/filters/FilterSection.jsx';
import SearchInput from '../../components/common/filters/SearchInput.jsx';
import SelectFilter from '../../components/common/filters/SelectFilter.jsx';
import DataTable from '../../components/common/table/DataTable.jsx';
import ActionButtons from '../../components/common/actions/ActionButtons.jsx';
import ResultsSummary from '../../components/common/layout/ResultsSummary.jsx';
import Pagination from '../../components/common/pagination/Pagination.jsx';
import DeleteConfirmationModal from '../../components/common/modals/DeleteConfirmationModal.jsx';
import EmptyState from '../../components/common/forms/state/EmptyState';

// Import UI components
import TargetRoleBadge from '../../components/common/ui/TargetRoleBadge.jsx';
import CreatorDisplay from '../../components/common/ui/CreatorDisplay.jsx';
import OwnershipBadge from '../../components/common/ui/OwnershipBadge.jsx';

// Import utilities
import { formatDate } from '../../utils/dateUtils.js';
import { getOwnershipStats } from '../../utils/formUtils.js';

const GoogleFormListPage = () => {
    const navigate = useNavigate();
    
    // Zustand store
    const { 
        googleFormLinks, 
        googleFormLinksPagination,
        events,
        loading, 
        error, 
        getGoogleFormLinks, 
        getEventsV2, 
        deleteGoogleFormLink 
    } = useFormStore();
    
    // Auth store for current user
    const { authenticatedDirector } = useDirectorAuth();
    const { authenticatedManagement } = useManagementAuth()
    
    // Local state
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        target_role: '',
        event_id: ''
    });
    
    // Modal states
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, formLink: null, isDeleting: false });

    // Fetch data on component mount and when filters change
    useEffect(() => {
        fetchFormLinks();
        fetchEvents();
    }, [currentPage, filters]);

    const fetchFormLinks = async () => {
        const params = {
            page: currentPage,
            limit: 10,
            ...filters
        };
        
        await getGoogleFormLinks(params);
    };

    const fetchEvents = async () => {
        try {
            const response = await getEventsV2();
            if (response.success) {
                // Events are already handled by the store
            }
        } catch (err) {
            console.error('Error fetching events:', err);
        }
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            target_role: '',
            event_id: ''
        });
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle form link actions
    const handleView = (formLink) => {
        window.open(formLink.form_link, '_blank');
    };


    const handleDelete = (formLink) => {
        // Check if current user can delete this form
        const isCurrentUserForm = authenticatedDirector && formLink.created_by === authenticatedDirector.account_id;
        
        if (!isCurrentUserForm) {
            // Show a toast message that only the creator can delete
            toast.error('You can only delete form links that you created');
            return;
        }
        
        setDeleteModal({ isOpen: true, formLink, isDeleting: false });
    };


    const confirmDelete = async () => {
        if (!deleteModal.formLink) return;
        
        setDeleteModal(prev => ({ ...prev, isDeleting: true }));
        
        const success = await deleteGoogleFormLink(deleteModal.formLink.formlink_id);
        
        setDeleteModal({ isOpen: false, formLink: null, isDeleting: false });
    };

    const handleCreateNew = () => {
        navigate(`/${authenticatedDirector?.Role.name === 'director' ? 'director' : authenticatedManagement?.Role.name === 'staff' ? 'management' : 'unauthorized access'}/upload-form`);
    };


    if (loading && googleFormLinks.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Google Form links...</p>
                </div>
            </div>
        );
    }

    // Prepare filter options
    const targetRoleOptions = [
        { value: 'volunteer', label: 'Volunteer' },
        { value: 'beneficiary', label: 'Beneficiary' }
    ];

    const eventOptions = events.map(event => ({
        value: event.event_id,
        label: event.title
    }));

    // Prepare table columns
    const tableColumns = [
        { header: 'Form Details' },
        { header: 'Event' },
        { header: 'Target Role' },
        { header: 'Created' },
        { header: 'Actions' }
    ];

    // Prepare action buttons for each row
    const getActionButtons = (formLink) => {
        const isCurrentUserForm = authenticatedDirector && formLink.created_by === authenticatedDirector.account_id;
        
        return [
            {
                icon: Eye,
                onClick: () => handleView(formLink),
                title: 'Visit Form',
                className: 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100'
            },
            {
                icon: Trash2,
                onClick: () => handleDelete(formLink),
                title: isCurrentUserForm ? 'Delete Form Link' : 'Delete Form Link (Created by you)',
                className: isCurrentUserForm 
                    ? 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100' 
                    : 'text-red-400 hover:text-red-600 bg-red-25 hover:bg-red-50 opacity-75',
                disabled: !isCurrentUserForm
            }
        ];
    };

    // Render table row
    const renderTableRow = (formLink) => (
        <>
            <td className="px-6 py-5">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                            {formLink.title}
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                        {formLink.description}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <span>Created by:</span>
                        <CreatorDisplay formLink={formLink} authenticatedDirector={authenticatedDirector} />
                        {authenticatedDirector && formLink.created_by === authenticatedDirector.account_id && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Owner
                            </span>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {formLink.Event?.title || 'N/A'}
                        </div>
                        {formLink.Event && (
                            <div className="text-xs text-gray-500">
                                {formatDate(formLink.Event.event_started)} - {formatDate(formLink.Event.event_ended)}
                            </div>
                        )}
                    </div>
                </div>
            </td>
                    <td className="px-6 py-5">
                        <TargetRoleBadge targetRole={formLink.target_role} />
                    </td>
            <td className="px-6 py-5">
                <div className="text-sm text-gray-600">
                    {formatDate(formLink.createdAt)}
                </div>
            </td>
                    <td className="px-6 py-4 text-center">
                        <ActionButtons actions={getActionButtons(formLink)} />
                    </td>
        </>
    );

    // Create action button for header
    const createButton = (
        <button
            onClick={handleCreateNew}
            className="group flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
            <span>Create New Form Link</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <PageHeader
                title="Google Form Links"
                description="Manage and organize all your Google Form links"
                icon={FileText}
                actionButton={createButton}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <FilterSection
                    title="Filters"
                    icon={Search}
                    onClearFilters={clearFilters}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SearchInput
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Search by title or description..."
                            label="Search"
                        />
                        
                        <SelectFilter
                            label="Target Role"
                            value={filters.target_role}
                            onChange={(e) => handleFilterChange('target_role', e.target.value)}
                            options={targetRoleOptions}
                            placeholder="All Roles"
                        />
                        
                        <SelectFilter
                            label="Event"
                            value={filters.event_id}
                            onChange={(e) => handleFilterChange('event_id', e.target.value)}
                            options={eventOptions}
                            placeholder="All Events"
                        />
                    </div>
                </FilterSection>

                        {/* Results Summary */}
                        <div className="mb-6">
                            <ResultsSummary
                                currentCount={googleFormLinks.length}
                                totalCount={googleFormLinksPagination.totalItems || 0}
                                itemName="form links"
                                showStatus={true}
                            />
                            {authenticatedDirector && googleFormLinks.length > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <OwnershipBadge 
                                        owned={getOwnershipStats(googleFormLinks, authenticatedDirector).owned} 
                                        total={getOwnershipStats(googleFormLinks, authenticatedDirector).total} 
                                    />
                                </div>
                            )}
                        </div>

                {/* Form Links Table */}
                <DataTable
                    columns={tableColumns}
                    data={googleFormLinks}
                    renderRow={renderTableRow}
                    loading={loading}
                    emptyState={
                        <div className="bg-white rounded-lg border border-gray-200">
                            <EmptyState
                                icon={FileText}
                                title={filters.search || filters.target_role || filters.event_id ? "No form links found" : "No Google Form links created yet"}
                                description={
                                    filters.search || filters.target_role || filters.event_id
                                        ? "Try adjusting your search or filters"
                                        : "Create your first Google Form link to get started"
                                }
                                
                            />
                        </div>
                    }
                />

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={googleFormLinksPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, formLink: null, isDeleting: false })}
                onConfirm={confirmDelete}
                title="Delete Form Link"
                itemName={deleteModal.formLink?.title}
                isLoading={deleteModal.isDeleting}
                message={
                    deleteModal.formLink ? (
                        <>
                            Are you sure you want to delete the form link{' '}
                            <span className="font-semibold text-gray-900">"{deleteModal.formLink.title}"</span>?
                            <br />
                            <span className="text-sm text-gray-600 mt-2 block">
                                This will permanently remove the form link and cannot be undone.
                            </span>
                        </>
                    ) : null
                }
            />

        </div>
    );
};

export default GoogleFormListPage;
