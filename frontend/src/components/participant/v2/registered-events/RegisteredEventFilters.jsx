import React from 'react';
import { Search, Filter } from 'lucide-react';

const RegisteredEventFilters = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    proofFilter,
    onProofFilterChange,
    disabled = false
}) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search events, locations, or descriptions..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        disabled={disabled}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                
                <div className="flex items-center space-x-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                        disabled={disabled}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Cancelled</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={proofFilter}
                        onChange={(e) => onProofFilterChange(e.target.value)}
                        disabled={disabled}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Proof</option>
                        <option value="Uploaded">Proof Uploaded</option>
                        <option value="Pending">Proof Pending</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default RegisteredEventFilters;
