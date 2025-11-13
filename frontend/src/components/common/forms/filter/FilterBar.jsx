import React from 'react';
import SearchInput from '../ui/SearchInput';

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  categoryFilter, 
  onCategoryChange, 
  eventFilter,
  onEventChange,
  sortBy, 
  onSortChange,
  categories = [],
  events = [],
  onClearFilters
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All Filters
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <SearchInput
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search forms..."
        />

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={eventFilter}
          onChange={(e) => onEventChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="all">All Events</option>
          {events.map(event => (
            <option key={event.event_id} value={event.event_id}>
              {event.title}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="updated">Last Updated</option>
          <option value="created">Date Created</option>
          <option value="title">Title A-Z</option>
          <option value="responses">Most Responses</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
