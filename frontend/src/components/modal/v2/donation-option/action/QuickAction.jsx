import { Info } from "lucide-react"

const QuickActions = ({ onShowGuide, onSelectAll, allSelected }) => {
    return (
        <div className="flex items-center justify-between mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <button
                onClick={onShowGuide}
                className="flex items-center space-x-1.5 sm:space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
                <Info size={14} />
                <span className="text-xs sm:text-sm font-medium">View Guide</span>
            </button>
            
            <button
                onClick={onSelectAll}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    allSelected 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
            >
                {allSelected ? 'Deselect All' : 'Select All'}
            </button>
        </div>
    )
}

export default QuickActions