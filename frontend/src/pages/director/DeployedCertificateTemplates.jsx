import React, { useEffect, useState } from "react";
import { useCertificateStore } from "../../store/director/useCertificateStore.js";
import CertificateTemplateCard from "../../components/director/deployed-certificate-template/card/CertificateTemplateCard.jsx";
import DeleteCertificateTemplateModal from "../../components/modal/DeleteCertificateTemplateModal.jsx";

const DeployedCertificateTemplates = () => {
  const { getDeployedCertificateTemplates, deleteCertificateTemplate, loading } = useCertificateStore();

  const [certificateTemplateData, setCertificateTemplateData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  const [showDeleteModal, setShowDeleteModal] = useState({
    open: false,
    template: null,
    isLoading: false
  });

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      const result = await getDeployedCertificateTemplates(currentPage, itemsPerPage);

      if (!result?.success) return;

      setCertificateTemplateData(result.ct_data);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalRecords);

    };

    fetchData();
  }, [currentPage, itemsPerPage, getDeployedCertificateTemplates]);

  // actions
  const handlePreview = (id) => console.log("Preview:", id);
  const handleDownload = (id) => console.log("Download:", id);
  const handleEdit = (id) => console.log("Edit:", id);
  const handleDuplicate = (id) => console.log("Duplicate:", id);
  const handleAnalytics = (id) => console.log("Analytics:", id);
  
  const handleDelete = (template) => {
    console.log('Delete clicked for template:', template);
    setShowDeleteModal({
      open: true,
      template: template,
      isLoading: false
    });
  };

  const handleDeleteConfirm = async (template) => {
    setShowDeleteModal(prev => ({ ...prev, isLoading: true }));
    
    try {;
        console.log('template id:', template.ct_id)
      const result = await deleteCertificateTemplate(template.ct_id);
      
      if (result?.success) {
        // Remove the deleted template from local state
        setCertificateTemplateData(prev => 
          prev.filter(t => 
            t.ct_id !== template.ct_id
          )
        );
        
        // Update total items count
        setTotalItems(prev => prev - 1);
        
        // If current page becomes empty and it's not the first page, go to previous page
        const remainingItems = certificateTemplateData.length - 1;
        if (remainingItems === 0 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error('Delete operation failed:', error);
    } finally {
      setShowDeleteModal({
        open: false,
        template: null,
        isLoading: false
      });
    }
  };

  // pagination handlers
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="bg-white overflow-hidden">
      {/* header */}
      <header className="p-4 bg-white border-b border-gray-300 flex justify-between items-center">
        <div className="flex-col space-y-2 items-center">
          <h1 className="text-3xl font-bold">
            Deployed Certificate Templates
          </h1>
          <p className="text-md text-gray-600">
            Browse and preview the certificate templates you&apos;ve deployed.
          </p>
        </div>

        <div className="flex items-center space-x-3 p-2">
          <h4 className="text-md">Currently Running</h4>
          <span className="loading loading-ring loading-md animate-ping text-blue-600 duration-300"></span>
        </div>
      </header>

      {/* main content */}
      <main className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
            <span className="ml-3 text-lg">Loading certificate templates...</span>
          </div>
        ) : certificateTemplateData && certificateTemplateData.length > 0 ? (
          <>
            {/* summary */}
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages}, total {totalItems} templates
              </div>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certificateTemplateData.map((template, index) => (
                <CertificateTemplateCard
                  key={template.template_id || template.id || `template-${index}`}
                  template_id={template.template_id || template.id}
                  template_name={template.template_name || template.name}
                  templateData={template}
                  status={template.status || "active"}
                  category={template.Category?.name}
                  usage_count={template.usage_count || template.usageCount || 0}
                  created_date={template.created_date || template.createdAt}
                  last_modified={template.updatedAt || ""}
                  template_type={template.Category?.name || template.type || "course"}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={() => handleDelete(template)}
                  onAnalytics={handleAnalytics}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">No Certificate Templates</h3>
            <p className="text-center max-w-md">
              You haven&apos;t deployed any certificate templates yet. Create your first template to get started.
            </p>
          </div>
        )}
      </main>

      {/* pagination */}
      {certificateTemplateData && certificateTemplateData.length > 0 && totalPages >= 1 && (
        <footer className="bg-white border-t border-gray-200 py-2 mt-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const shouldShow =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                if (!shouldShow) {
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-1 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </footer>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteCertificateTemplateModal
        open={showDeleteModal.open}
        setOpen={(open) => setShowDeleteModal(prev => ({ ...prev, open }))}
        onConfirm={handleDeleteConfirm}
        template={showDeleteModal.template}
        isLoading={showDeleteModal.isLoading}
      />
    </div>
  );
};

export default DeployedCertificateTemplates;
