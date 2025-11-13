import { Award } from "lucide-react";

const EmptyState = ({ searchTerm, selectedCategory, onClearFilters }) => (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Award size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-medium mb-2 text-gray-900">No Templates Found</h3>
      <p className="text-center max-w-md">
        {searchTerm || selectedCategory !== "all" 
          ? "No templates match your current search criteria. Try adjusting your filters or search term."
          : "No certificate templates are available at the moment. Please contact your administrator or try again later."
        }
      </p>
      {(searchTerm || selectedCategory !== "all") && (
        <button
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
);

export default EmptyState