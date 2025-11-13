import { Check, AlertCircle } from "lucide-react";

const CategoryCard = ({ category, isSelected, isAssigned, onClick, loading }) => (
    <div
      onClick={onClick}
      className={`
        p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 relative
        ${isSelected 
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" 
          : isAssigned 
            ? "border-green-500 bg-green-50 hover:border-green-600 hover:bg-green-100" 
            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{category.name}</h3>
        <div className="flex items-center gap-1">
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          )}
          {!loading && isAssigned && !isSelected && (
            <div className="bg-green-600 text-white rounded-full p-1" title="Certificate template already assigned">
              <Check size={12} />
            </div>
          )}
          {isSelected && (
            <div className="bg-blue-600 text-white rounded-full p-1">
              <Check size={12} />
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600">{category.description}</p>
      {!loading && isAssigned && (
        <div className="mt-2 flex items-center gap-1 text-xs text-green-700">
          <AlertCircle size={12} />
          <span>Template already assigned</span>
        </div>
      )}
    </div>
);

export default CategoryCard