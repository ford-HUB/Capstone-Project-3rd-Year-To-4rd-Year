import React, { useState, useEffect } from "react";
import LoadingState from "../../components/director/manage-certificate/loader/LoadingState.jsx";
import ErrorState from "../../components/director/manage-certificate/error/ErrorState.jsx";
import InstructionsModal from "../../components/modal/v2/manage-certificate/InstructionModal.jsx";
import ProgressSteps from "../../components/director/manage-certificate/steps/ProgressStep.jsx";
import CategorySelection from "../../components/director/manage-certificate/selection/CategorySelection.jsx";
import ConfirmationStep from "../../components/director/manage-certificate/steps/ConfirmationStep.jsx";
import SuccessStep from "../../components/director/manage-certificate/steps/SuccessStep.jsx";
import TemplateFilters from "../../components/director/manage-certificate/filter/TemplateFilters.jsx";
import TemplateGrid from "../../components/director/manage-certificate/TemplateGrid.jsx";
import PreviewModal from "../../components/modal/v2/manage-certificate/PreviewModal.jsx";
import InstructionsBanner from "../../components/director/manage-certificate/banner/InstructionBanner.jsx";
import { TEMPLATE_CATEGORIES, ASSIGNMENT_CATEGORIES } from "../../constants/templateCategory.js";
import { renderPreview } from "../../utils/templateUtils.js";
import { useCertificateStore } from "../../store/director/useCertificateStore.js";


const TemplatePage = () => {
  const { getCertificateTemplates, fileData,  loading, error, createCertificateTemplate } = useCertificateStore();
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [assignmentStep, setAssignmentStep] = useState(1);
  const [targetCategory, setTargetCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
        await getCertificateTemplates();
    }

    fetchData()
  }, []);

  // Filter templates based on search and category
  const filteredTemplates = Array.isArray(fileData) ? fileData.filter(template => {
    const name = typeof template === "object" ? template.name || "" : "";
    const category = typeof template === "object" ? template.category || "general" : "general";
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) : [];

  // Event handlers
  const handleTemplateSelect = (template, index) => {
    const templateData = {
      id: (template && template.id) || index,
      name: typeof template === "object" ? template.name || `Template ${index + 1}` : `Template ${index + 1}`,
      html: typeof template === "string" ? template : template.html || "",
      category: typeof template === "object" ? template.category || "general" : "general",
      template: template
    };
    setSelectedTemplate(templateData);
    setAssignmentStep(2);
  };

  const handlePreview = (template, index) => {
    const templateData = {
      id: (template && template.id) || index,
      name: typeof template === "object" ? template.name || `Template ${index + 1}` : `Template ${index + 1}`,
      html: typeof template === "string" ? template : template.html || "",
    };
    setPreviewTemplate(templateData);
  };

  const handleCategorySelection = () => {
    if (targetCategory) {
      setAssignmentStep(3);
    }
  };

  const handleConfirmSelection = async () => {
    if (selectedTemplate && targetCategory) {
        const success = await createCertificateTemplate({ category_name: targetCategory, ct_name: selectedTemplate.name, selected_raw_ct: selectedTemplate.html })
        if(!success) return
        setAssignmentStep(4);
        setTimeout(() => {
          resetSelection();
        }, 3000);
    }
  };

  const resetSelection = () => {
    setSelectedTemplate(null);
    setTargetCategory("");
    setAssignmentStep(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  // Render loading and error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={getCertificateTemplates} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <InstructionsBanner 
        showInstructions={showInstructions}
        onShowInstructions={() => setShowInstructions(true)}
      />

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Templates</h1>
              <p className="text-gray-600">
                {assignmentStep === 1 && "Choose the perfect template for your certificates"}
                {assignmentStep === 2 && "Select which category this template will be used for"}
                {assignmentStep === 3 && "Review and confirm your template assignment"}
                {assignmentStep === 4 && "Template successfully assigned!"}
              </p>
            </div>
            
            <ProgressSteps currentStep={assignmentStep} />
          </div>
        </div>

        {assignmentStep === 2 && selectedTemplate && (
          <CategorySelection
            selectedTemplate={selectedTemplate}
            targetCategory={targetCategory}
            onCategoryChange={setTargetCategory}
            onBack={() => setAssignmentStep(1)}
            onContinue={handleCategorySelection}
            assignmentCategories={ASSIGNMENT_CATEGORIES}
          />
        )}

        {assignmentStep === 3 && selectedTemplate && targetCategory && (
          <ConfirmationStep
            selectedTemplate={selectedTemplate}
            targetCategory={targetCategory}
            assignmentCategories={ASSIGNMENT_CATEGORIES}
            onBack={() => setAssignmentStep(2)}
            onConfirm={handleConfirmSelection}
          />
        )}

        {assignmentStep === 4 && (
          <SuccessStep
            selectedTemplate={selectedTemplate}
            targetCategory={targetCategory}
            assignmentCategories={ASSIGNMENT_CATEGORIES}
          />
        )}

        {assignmentStep === 1 && (
          <>
            <TemplateFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              templateCategories={TEMPLATE_CATEGORIES}
              filteredCount={filteredTemplates.length}
            />

            <TemplateGrid
              templates={filteredTemplates}
              viewMode={viewMode}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              onPreview={handlePreview}
              onClearFilters={clearFilters}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              renderPreview={renderPreview}
            />
          </>
        )}
      </div>

      <PreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelect={(template) => {
          handleTemplateSelect(template.template || template, template.id);
          setPreviewTemplate(null);
        }}
        renderPreview={renderPreview}
      />
    </div>
  );
};

export default TemplatePage;