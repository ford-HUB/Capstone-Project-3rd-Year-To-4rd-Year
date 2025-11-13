export const Navigation = ({ currentStep, onBack, onNext, onSubmit, canProceed, isUploading, validFilesCount }) => (
    <div className="flex justify-between pt-6">
      {currentStep > 1 ? (
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← Back
        </button>
      ) : <div></div>}
      
      {currentStep < 3 ? (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isUploading || validFilesCount === 0}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isUploading ? 'Uploading...' : '🚀 Upload Files'}
        </button>
      )}
    </div>
);