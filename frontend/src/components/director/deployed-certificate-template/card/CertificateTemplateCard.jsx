import React, { useState } from 'react';
import {
    TEMPLATE_CONFIG,
    MENU_ACTIONS,
} from '../../../../constants/deployedCertificate.js';

import { Eye, Download, MoreVertical, Loader } from 'lucide-react';

import CertificatePreview from '../ui/CertificatePreview.jsx';
import DropdownMenu from '../dropdown/DropdownMenu.jsx';
import Button from '../ui/Button.jsx';
import TemplateMetadata from '../ui/templateMetadata';
import ErrorMessage from '../error/ErrorMessage.jsx';
import PreviewCertificateTemplateModal from '../../../modal/v2/deployed-certificate-template/PreviewCertificateTemplateModal.jsx';

const CertificateTemplateCard = ({
    template_id = 1,
    template_name,
    templateData,
    category,
    status = 'draft',
    usage_count = 0,
    created_date,
    last_modified,
    template_type = 'course',
    onDownload,
    onEdit,
    onDuplicate,
    onDelete,
    onAnalytics,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPreviewTemplateModal, setShowPreviewTemplateModal] = React.useState(false)
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [error, setError] = useState(null);

    const config = TEMPLATE_CONFIG[template_type] || TEMPLATE_CONFIG.course;


    const handlePreview = async () => {
        // setIsLoading(true);
        setShowPreviewTemplateModal(true)
        // setIsLoading(false);
    };


    const handleMoreAction = async (action) => {
        setShowMoreMenu(false);

        const actionHandlers = {
            edit: onEdit,
            duplicate: onDuplicate,
            analytics: onAnalytics,
            delete: onDelete,
        };

        // For delete action, pass the full template data instead of just template_id
        if (action === 'delete') {
    
            try {
                setIsLoading(true);
                setError(null);
                await actionHandlers[action]?.(templateData);
            } catch (error) {
                console.error(`Failed to ${action} template`, error);
                setError(`Failed to ${action} template`);
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                setIsLoading(true);
                setError(null);
                await actionHandlers[action]?.(template_id);
            } catch (error) {
                console.error(`Failed to ${action} template`, error);
                setError(`Failed to ${action} template`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
            role="article"
            aria-labelledby={`template-${template_id}-title`}
            aria-describedby={`template-${template_id}-description`}>
            <CertificatePreview
                config={config}
                templateName={template_name}
                status={status}
                isLoading={isLoading}
                onPreview={handlePreview}
            />

            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <h3
                            id={`template-${template_id}-title`}
                            className="font-semibold text-gray-900 text-lg leading-tight mb-1 truncate"
                            title={template_name}>
                            {template_name}
                        </h3>

                        <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${config?.badgeClass}`}>
                            {category}
                        </span>
                    </div>

                    <div className="relative">
                        <button
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded focus:ring-2 focus:ring-blue-500"
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            aria-label="More actions"
                            aria-expanded={showMoreMenu}
                            aria-haspopup="true">
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        <DropdownMenu
                            isOpen={showMoreMenu}
                            onClose={() => setShowMoreMenu(false)}
                            onAction={handleMoreAction}
                            actions={MENU_ACTIONS}
                        />
                    </div>
                </div>

                <p
                    id={`template-${template_id}-description`}
                    className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                    {config.description}
                </p>

                <TemplateMetadata
                    usageCount={usage_count}
                    createdDate={created_date}
                    lastModified={last_modified}
                />

                <ErrorMessage message={error} />

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="primary"
                        className="w-full sm:flex-1"
                        disabled={isLoading}
                        onClick={handlePreview}
                        aria-label={`Preview ${template_name} certificate template`}>
                        {isLoading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <Eye
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                />
                                Preview
                            </>
                        )}
                    </Button>

                
                </div>
            </div>

            <PreviewCertificateTemplateModal
            open={showPreviewTemplateModal}
            setOpen={() => setShowPreviewTemplateModal(false)}
            currentCertificate={templateData}
            />
        </div>
    );
};

export default CertificateTemplateCard;
