import React from 'react';
import { Check } from "lucide-react";

const SuccessStep = ({ selectedTemplate, targetCategory, assignmentCategories }) => {
  const selectedCategoryData = assignmentCategories.find(cat => cat.id === targetCategory);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-green-200 mb-6">
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Template Successfully Assigned!</h2>
        <p className="text-gray-600 mb-4">
          {selectedTemplate?.name} has been assigned to {selectedCategoryData?.name} certificates.
        </p>
        <div className="text-sm text-gray-500">
          Redirecting to template selection in a few seconds...
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;