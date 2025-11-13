import React from 'react';
import { ArrowLeft, Check } from "lucide-react";

const ConfirmationStep = ({ 
  selectedTemplate, 
  targetCategory, 
  assignmentCategories, 
  onBack, 
  onConfirm 
}) => {
  const selectedCategoryData = assignmentCategories.find(cat => cat.id === targetCategory);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirm Template Assignment</h2>
            <p className="text-gray-600">Review your selection before confirming</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Selected Template</h3>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-1">{selectedTemplate.name}</h4>
              <p className="text-sm text-gray-600 capitalize">Template Category: {selectedTemplate.category}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Assignment Category</h3>
            <div className="p-4 border border-gray-200 rounded-lg">
              {selectedCategoryData && (
                <>
                  <h4 className="font-medium text-gray-800 mb-1">{selectedCategoryData.name}</h4>
                  <p className="text-sm text-gray-600">{selectedCategoryData.description}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important</h4>
          <p className="text-sm text-yellow-700">
            This template will be used for all new certificates in the selected category. 
            Any existing template assignment for this category will be replaced.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Check size={16} />
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;