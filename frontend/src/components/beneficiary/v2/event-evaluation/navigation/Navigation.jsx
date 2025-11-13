import React from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

const Navigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  isSubmitting 
}) => {
  return (
    <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Evaluation
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default Navigation;
