import React, { useEffect, useState } from 'react';
import { ArrowLeft, Award, Check, ChevronRight } from "lucide-react";
import CategoryCard from '../card/CategoryCard';
import { useCertificateStore } from '../../../../store/director/useCertificateStore.js';

const CategorySelection = ({ 
  selectedTemplate, 
  targetCategory, 
  onCategoryChange, 
  onBack, 
  onContinue, 
  assignmentCategories 
}) => {
  const { getDeployedCertificateTemplates } = useCertificateStore();
  const [deployedTemplates, setDeployedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeployedTemplates = async () => {
      try {
        setLoading(true);
        const result = await getDeployedCertificateTemplates(1, 100); // Get all deployed templates
        if (result?.success) {
          setDeployedTemplates(result.ct_data || []);
        }
      } catch (error) {
        console.error('Failed to fetch deployed templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployedTemplates();
  }, [getDeployedCertificateTemplates]);

  // Function to check if a category already has a certificate template assigned
  const isCategoryAssigned = (categoryId) => {
    return deployedTemplates.some(template => 
      template.Category?.name === categoryId || template.category === categoryId
    );
  };

  return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Certificate Category</h2>
          <p className="text-gray-600">Select which type of certificates this template will be used for</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Templates
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Award className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">Selected Template:</span>
          <span className="text-blue-800">{selectedTemplate.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {assignmentCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={targetCategory === category.id}
            isAssigned={isCategoryAssigned(category.id)}
            onClick={() => onCategoryChange(category.id)}
            loading={loading}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onContinue}
          disabled={!targetCategory}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
            ${targetCategory 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Continue
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
  );
};

export default CategorySelection;