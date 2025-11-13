const ActionButtons = ({ onCancel, onConfirm, hasSelection }) => {
    return (
        <div className="flex space-x-2 sm:space-x-3">
            <button 
                onClick={onCancel}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
            >
                Cancel
            </button>
            
            <button
                onClick={onConfirm}
                disabled={!hasSelection}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    hasSelection
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                Save Configuration
            </button>
        </div>
    )
}

export default ActionButtons