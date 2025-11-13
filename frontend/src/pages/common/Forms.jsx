import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Eye, Users, BarChart3 } from 'lucide-react';

// Import components
import Button from '../../components/common/forms/ui/Button';
import FormCard from '../../components/common/forms/cards/FormCard';
import StatsCard from '../../components/common/forms/cards/StatsCard';
import FilterBar from '../../components/common/forms/filter/FilterBar';
import EmptyState from '../../components/common/forms/state/EmptyState';
import ResponsesModal from '../../components/common/forms/modals/ResponsesModal';
import DeleteModal from '../../components/common/forms/modals/DeleteModal';

// Import store and services
import { useFormStore } from '../../store/common/useFormStore.js';
import { getFormResponses } from '../../services/common/formService.js';
import { useEvaluationStore } from '../../store/common/useEvaluationStore.js';

// Store Two AUth
import { useAuthStore as useAuthDirectorStore } from '../../store/director/useAuthStore.js';

// Import components
import EvaluationSubmissionsModal from '../../components/common/forms/modals/EvaluationSubmissionsModal.jsx';

// Main Forms Component
const Forms = () => {
  const navigate = useNavigate();
  
  // Zustand store
  const { 
    forms, 
    categories, 
    events, 
    loading, 
    error, 
    getForms, 
    getCategories, 
    getEvents, 
    createForm,
    deleteForm,
    archiveForm 
  } = useFormStore();

  const { getAllEvaluations, evaluations } = useEvaluationStore();
  const { authenticatedDirector } = useAuthDirectorStore()

  // Local state
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [formResponses, setFormResponses] = useState({});

  // Modal states
  const [responsesModal, setResponsesModal] = useState({ isOpen: false, form: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, form: null });
  const [evaluationModal, setEvaluationModal] = useState({ isOpen: false, event: null });


  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getForms(),
          getCategories(),
          getEvents(),
          getAllEvaluations() // Fetch evaluation submissions
        ]);
      } catch (error) {
        console.error('Error fetching forms data:', error);
      }
    };

    fetchData();
  }, [getForms, getCategories, getEvents, getAllEvaluations]);

  // Filter and search logic
  useEffect(() => {
    let filtered = forms || [];

    // Create a static default evaluation form that always shows
    const defaultEvaluationForm = {
      form_id: 'default-evaluation-form',
      title: 'Default Event Evaluation Form',
      description: 'Default volunteer evaluation form for events without custom forms',
      is_default_evaluation: true,
      event_id: null, // Not tied to a specific event
      Event: null,
      evaluation_count: evaluations.length,
      createdAt: new Date('2024-01-01'), // Static date
      updatedAt: new Date(),
      is_active: true,
      Category: { name: 'Evaluation', category_id: 'evaluation' }
    };
    
    // Combine custom forms with the static default evaluation form
    filtered = [...filtered, defaultEvaluationForm];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(form => 
        form.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.Category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.Event?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter (map is_active to status)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(form => {
        if (statusFilter === 'published') return form.is_active === true;
        if (statusFilter === 'archived') return form.is_active === false;
        return true;
      });
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(form => 
        form.category_id?.toString() === categoryFilter || 
        form.Category?.category_id?.toString() === categoryFilter
      );
    }

    // Event filter
    if (eventFilter !== 'all') {
      filtered = filtered.filter(form => 
        form.event_id?.toString() === eventFilter || 
        form.Event?.event_id?.toString() === eventFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'responses':
          // For now, we'll use a placeholder since responses count isn't in the form model
          return 0;
        default: // updated
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

      setFilteredForms(filtered);
  }, [forms, evaluations, events, searchQuery, statusFilter, categoryFilter, eventFilter, sortBy]);

  // Form actions
  const handleCreateNew = () => {
    navigate(`/${authenticatedDirector?.Role.name === 'director' ? 'director' : 'management'}/form-builder`);
  };

  const handleEdit = (form) => {
    // Store the form data in sessionStorage to pass to the form builder
    sessionStorage.setItem('editingForm', JSON.stringify(form));
    navigate(`/${authenticatedDirector?.Role.name === 'director' ? 'director' : 'management'}/form-builder`);
  };

  const handleDuplicate = async (form) => {
    try {
      const duplicatedFormData = {
        title: `${form.title} (Copy)`,
        description: form.description,
        category_id: form.category_id,
        event_id: form.event_id,
        form_schema: form.form_schema
      };
      
      const success = await createForm(duplicatedFormData);
      if (success) {
        alert(`Duplicated: ${form.title}`);
      }
    } catch (error) {
      console.error('Error duplicating form:', error);
    }
  };

  const handleDelete = (form) => {
    setDeleteModal({ isOpen: true, form });
  };

  const confirmDelete = async (form) => {
    try {
      const success = await deleteForm(form.form_id);
      if (success) {
        alert(`Deleted: ${form.title}`);
      }
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const handleViewResponses = async (form) => {
    try {
      // Check if this is a default evaluation form
      if (form.is_default_evaluation) {
        // For default evaluation forms, show the evaluation submissions modal
        // Pass all evaluations since this is the static default form
        setEvaluationModal({ isOpen: true, event: null, allEvaluations: true });
        return;
      }
      
      const response = await getFormResponses(form.form_id);
      if (response.success) {
        setFormResponses(prev => ({
          ...prev,
          [form.form_id]: response.responses
        }));
        setResponsesModal({ isOpen: true, form });
      }
    } catch (error) {
      console.error('Error fetching form responses:', error);
    }
  };


  const handleDownload = (form) => {
    const json = JSON.stringify({
      title: form.title,
      description: form.description,
      form_schema: form.form_schema,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt
    }, null, 2);
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert(`Downloaded: ${form.title}.json`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setEventFilter('all');
    setSortBy('updated');
  };

  const handleArchive = async (form) => {
    try {
      const newStatus = !form.is_active; // Toggle the status
      const success = await archiveForm(form.form_id, newStatus);
      if (success) {
        // The form list will be refreshed automatically by the store
      }
    } catch (error) {
      console.error('Error archiving form:', error);
    }
  };

  const getStats = () => {
    const totalForms = forms?.length || 0;
    const publishedForms = forms?.filter(f => f.is_active === true).length || 0;
    // For now, we'll use a placeholder for responses since it's not in the form model
    const totalResponses = 0; // This would need to be calculated from form responses
    const avgResponsesPerForm = totalForms > 0 ? Math.round(totalResponses / totalForms) : 0;

    return { totalForms, publishedForms, totalResponses, avgResponsesPerForm };
  };

  const stats = getStats();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading forms</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Created Forms</h1>
              <p className="text-gray-600">Manage and organize all your forms</p>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus size={20} className="mr-2" />
              Create New Form
            </Button>
          </div>
        </div>
      </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={FileText}
              title="Total Forms"
              value={stats.totalForms}
              color="blue"
            />
            <StatsCard
              icon={Eye}
              title="Published"
              value={stats.publishedForms}
              color="green"
            />
            <StatsCard
              icon={Users}
              title="Total Responses"
              value={stats.totalResponses}
              color="purple"
            />
            <StatsCard
              icon={BarChart3}
              title="Avg. Responses"
              value={stats.avgResponsesPerForm}
              color="orange"
            />
          </div>

          {/* Filters and Search */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            eventFilter={eventFilter}
            onEventChange={setEventFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categories={categories}
            events={events}
            onClearFilters={handleClearFilters}
          />

    {/* Forms Grid */}
    {filteredForms.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200">
            <EmptyState
              icon={FileText}
              title={searchQuery ? "No forms found" : "No forms created yet"}
              description={
                searchQuery 
                  ? "Try adjusting your search or filters" 
                  : "Create your first form to get started with collecting data"
              }
              action={
                !searchQuery && (
                  <Button onClick={handleCreateNew}>
                    <Plus size={20} className="mr-2" />
                    Create Your First Form
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map(form => (
              <FormCard
                key={form.form_id}
                form={form}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onViewResponses={handleViewResponses}
                onDownload={handleDownload}
                onArchive={handleArchive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ResponsesModal
        isOpen={responsesModal.isOpen}
        onClose={() => setResponsesModal({ isOpen: false, form: null })}
        form={responsesModal.form}
        responses={responsesModal.form ? (formResponses[responsesModal.form.form_id] || []) : []}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, form: null })}
        form={deleteModal.form}
        onConfirm={confirmDelete}
      />

      <EvaluationSubmissionsModal
        isOpen={evaluationModal.isOpen}
        onClose={() => setEvaluationModal({ isOpen: false, event: null, allEvaluations: false })}
        event={evaluationModal.event}
        allEvaluations={evaluationModal.allEvaluations}
      />
    </div>
  );
};

export default Forms;