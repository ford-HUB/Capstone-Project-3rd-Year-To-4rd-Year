
import React, { useState, useEffect } from 'react';
import { useCertificateStore } from '../../../../store/director/useCertificateStore.js';
import DeleteCertificateTemplateModal from '../../../modal/DeleteCertificateTemplateModal.jsx';
import { Award, User, Target } from 'lucide-react';
import StatsCard from '../card/StatsCard.jsx';
import EmptyState from '../state/EmptyState.jsx';
import CertificateTemplateCard from '../card/CertificateTemplateCard.jsx';

const CertificateTemplatesGrid = () => {
    const { 
        getDeployedCertificateTemplates, 
        deleteCertificateTemplate, 
        loading 
    } = useCertificateStore();
    
    const [templates, setTemplates] = useState([]);
    const [pagination, setPagination] = useState({
        totalRecords: 0,
        totalPages: 0,
        pageSize: 4
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        template: null
    });

    // Load templates on component mount
    useEffect(() => {
        loadTemplates();
    }, [currentPage]);

    const loadTemplates = async () => {
        try {
            const response = await getDeployedCertificateTemplates(currentPage, pagination.pageSize);
            console.log('API Response:', response);
            if (response && response.success) {
                console.log('Templates data:', response.ct_data);
                if (response.ct_data && response.ct_data.length > 0) {
                    console.log('First template structure:', response.ct_data[0]);
                    console.log('First template keys:', Object.keys(response.ct_data[0]));
                }
                setTemplates(response.ct_data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (error) {
            console.error('Failed to load templates:', error);
        }
    };

    const eventHandlers = {
        handlePreview: async (templateId) => {
            console.log('Preview template:', templateId);
            // TODO: Implement preview functionality
        },

        handleDownload: async (templateId) => {
            console.log('Download template:', templateId);
            // TODO: Implement download functionality
        },

        handleEdit: async (templateId) => {
            console.log('Edit template:', templateId);
            // TODO: Implement edit navigation
        },

        handleDuplicate: async (templateId) => {
            console.log('Duplicate template:', templateId);
            // TODO: Implement duplicate functionality
        },

        handleDelete: async (templateData) => {
            setDeleteModal({
                isOpen: true,
                template: templateData
            });
        },

        handleAnalytics: async (templateId) => {
            console.log('View analytics for template:', templateId);
            // TODO: Implement analytics functionality
        }
    };

    const handleDeleteConfirm = async (template) => {
        try {
            console.log('Template data for deletion:', template);
            
            // Try different possible ID field names
            // const templateId = template.ct_id || template.id || template.template_id;
            
            // if (!templateId) {
            //     console.error('Template ID is missing. Available fields:', Object.keys(template));
            //     return;
            // }
            
            // console.log('Using template ID:', templateId);
            
            const result = await deleteCertificateTemplate(template.ct_id);
            if (result && result.success) {
                // Refresh the templates list
                await loadTemplates();
                setDeleteModal({ isOpen: false, template: null });
            }
        } catch (error) {
            console.error('Failed to delete template:', error);
        }
    };

    const stats = {
        totalTemplates: pagination.totalRecords,
        totalIssued: templates.reduce((sum, t) => sum + (t.usage_count || 0), 0),
        activeTemplates: templates.filter(t => t.status === 'active').length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Certificate Templates</h1>
                            <p className="text-gray-600 mt-1">Browse and manage your certificate templates with enhanced user experience.</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-600">Currently Running</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatsCard 
                        icon={Award} 
                        title="Total Templates" 
                        value={stats.totalTemplates} 
                        colorClass="bg-blue-100 text-blue-600" 
                    />
                    <StatsCard 
                        icon={User} 
                        title="Total Issued" 
                        value={stats.totalIssued} 
                        colorClass="bg-green-100 text-green-600" 
                    />
                    <StatsCard 
                        icon={Target} 
                        title="Active Templates" 
                        value={stats.activeTemplates} 
                        colorClass="bg-yellow-100 text-yellow-600" 
                    />
                </div>

                {/* Templates Grid */}
                {templates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {templates.map((template) => {
                            console.log('Mapping template:', template);
                            return (
                                <CertificateTemplateCard
                                    key={template.ct_id}
                                    template_id={template.ct_id}
                                    template_name={template.name}
                                    templateData={template}
                                    category={template.Category?.name || 'General'}
                                    status="active"
                                    usage_count={0}
                                    created_date={template.createdAt}
                                    last_modified={template.updatedAt}
                                    template_type="course"
                                    {...eventHandlers}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState />
                )}

                {/* Delete Confirmation Modal */}
                <DeleteCertificateTemplateModal
                    open={deleteModal.isOpen}
                    setOpen={(isOpen) => setDeleteModal(prev => ({ ...prev, isOpen }))}
                    onConfirm={handleDeleteConfirm}
                    template={deleteModal.template}
                    isLoading={loading}
                />
            </div>
        </div>
    );
};

export default CertificateTemplatesGrid;