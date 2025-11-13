
import React from 'react';
import { X } from "lucide-react";

const PreviewModal = ({ template, isOpen, onClose, onSelect, renderPreview }) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{template.name}</h2>
            <p className="text-sm text-gray-600">Certificate Template Preview</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(template)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Select This Template
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-auto" style={{ maxHeight: "calc(95vh - 100px)" }}>
          <div className="bg-gray-50 p-4 rounded-lg">
            <iframe
              title="certificate-full-preview"
              srcDoc={renderPreview(template.html)}
              style={{ 
                width: "100%", 
                height: "70vh", 
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: "white"
              }}
            />
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Preview Information:</h4>
            <p className="text-sm text-blue-800 mb-2">This preview shows sample data. Actual certificates will display real participant information, event details, and dates.</p>
            <div className="text-xs text-blue-700">
              <strong>Sample data used:</strong> Juan Dela Cruz, React Development Bootcamp 2025, Tech Academy Philippines
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;