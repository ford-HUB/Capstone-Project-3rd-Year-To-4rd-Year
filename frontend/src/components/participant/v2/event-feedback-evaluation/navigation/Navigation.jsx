import { ChevronLeft, ChevronRight, Send } from "lucide-react";

const Navigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  isSubmitting 
}) => (
  <>
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-300 flex justify-between items-center">
      {/* Previous */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentStep === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>

      {/* Next or Submit */}
      {currentStep === totalSteps ? (
        <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
        >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      )}
    </div>

    <div className="px-6 py-2 bg-gray-50 text-center">
      <p className="text-xs text-gray-500">
        * Required fields. Your feedback helps us improve our volunteer program.
      </p>
    </div>
  </>
);

export default Navigation;
