import React from "react";
import { CheckCircle } from "lucide-react";

const NavigationButtons = ({ 
  currentStep, 
  isLoading, 
  onPrevStep, 
  onNextStep, 
  onSubmit,
  totalSteps = 5,
  isNextDisabled = false
}) => {
  return (
    <div className="flex justify-between pt-6 border-t border-gray-200">
    <button
      type="button"
      onClick={onPrevStep}
      disabled={currentStep === 1}
      className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Previous
    </button>
    
    {currentStep < totalSteps ? (
      <button
        type="button"
        onClick={onNextStep}
        disabled={isNextDisabled}
        className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Continue
      </button>
    ) : (
      <button
        type="submit"
        disabled={isLoading}
        className="px-8 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Submit Registration</span>
          </>
        )}
      </button>
    )}
  </div>
  );
};

export default NavigationButtons;
