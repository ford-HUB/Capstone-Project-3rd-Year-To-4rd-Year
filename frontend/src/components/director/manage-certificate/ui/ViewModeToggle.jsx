import { List, Grid } from "lucide-react";

const ViewModeToggle = ({ viewMode, onViewModeChange }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 mr-2">View:</span>
      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
        >
          <Grid size={18} />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
        >
          <List size={18} />
        </button>
      </div>
    </div>
);

export default ViewModeToggle