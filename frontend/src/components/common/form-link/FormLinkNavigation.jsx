import React from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

const FormLinkNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  isLoading 
}) => {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-gray-200/50">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onPrevious}
          className="group flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Previous</span>
        </button>
      )}

      <div className="flex items-center space-x-4 ml-auto">
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={onNext}
            className="group flex items-center space-x-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="group flex items-center space-x-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 border border-transparent rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Create Form Link</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormLinkNavigation;
