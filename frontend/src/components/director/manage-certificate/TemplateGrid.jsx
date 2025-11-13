import React from 'react';
import { Award } from "lucide-react";
import TemplateCard from './card/TemplateCard';
import EmptyState from './ui/EmptyState';

const TemplateGrid = ({
  templates,
  viewMode,
  selectedTemplate,
  onTemplateSelect,
  onPreview,
  onClearFilters,
  searchTerm,
  selectedCategory,
  renderPreview
}) => {
  if (templates.length === 0) {
    return (
      <EmptyState
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <div className={
      viewMode === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
    }>
      {templates.map((template, index) => (
        <TemplateCard
          key={(template && template.id) || index}
          template={template}
          index={index}
          viewMode={viewMode}
          isSelected={selectedTemplate && selectedTemplate.id === ((template && template.id) || index)}
          onSelect={() => onTemplateSelect(template, index)}
          onPreview={() => onPreview(template, index)}
          renderPreview={renderPreview}
        />
      ))}
    </div>
  );
};

export default TemplateGrid;