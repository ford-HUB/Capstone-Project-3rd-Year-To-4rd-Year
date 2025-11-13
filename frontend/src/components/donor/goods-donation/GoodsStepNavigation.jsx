import React from 'react';

const GoodsStepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSubmit, 
  isProcessing 
}) => {
  return (
    <div className="flex justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isProcessing}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Submit Donation'}
        </button>
      )}
    </div>
  );
};

export default GoodsStepNavigation;
