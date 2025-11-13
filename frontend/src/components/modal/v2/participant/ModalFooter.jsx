
const ModalFooter = ({ currentStep, totalSteps, onPrev, onNext, onSubmit, isSubmitting }) => (
    <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1}
        className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
          currentStep === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-purple-600 hover:bg-purple-50'
        }`}
      >
        Previous
      </button>
  
      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-blue-800 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-2 bg-gradient-to-r from-blue-800 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Registering...
            </>
          ) : (
            'Complete Registration'
          )}
        </button>
      )}
    </div>
);

export default ModalFooter;