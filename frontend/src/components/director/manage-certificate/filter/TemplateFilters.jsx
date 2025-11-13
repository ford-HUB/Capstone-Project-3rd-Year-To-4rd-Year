import React from 'react';
import { Search, Filter, Grid, List } from "lucide-react";
import ViewModeToggle from '../ui/ViewModeToggle';

const TemplateFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  templateCategories,
  filteredCount
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search templates by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {templateCategories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>

    {filteredCount > 0 && (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Showing {filteredCount} template{filteredCount !== 1 ? 's' : ''} 
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedCategory !== "all" && ` in ${selectedCategory} category`}
        </p>
      </div>
    )}
  </div>
);



export default TemplateFilters;