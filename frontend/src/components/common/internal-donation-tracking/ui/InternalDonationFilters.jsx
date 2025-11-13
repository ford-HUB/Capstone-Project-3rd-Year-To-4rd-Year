import React from 'react';
import { Filter, Tag, Calendar } from 'lucide-react';
import FilterSelect from './FilterSelect';
import { 
    DONATION_STATUS_OPTIONS, 
    DONATION_TYPE_OPTIONS 
} from '../../../../constants/donationConstants';

const InternalDonationFilters = ({
    filterStatus,
    filterType,
    filterEvent,
    openDonationEvents,
    onStatusChange,
    onTypeChange,
    onEventChange
}) => {
    // Create event options from dynamic data
    const eventOptions = [
        { value: 'all', label: 'All Events' },
        ...(openDonationEvents || []).map(event => ({
            value: event.title || event.value,
            label: event.label || event.title || event.value
        }))
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                </div>
            </div>
            <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FilterSelect
                        label="Status"
                        value={filterStatus}
                        options={DONATION_STATUS_OPTIONS}
                        onChange={(e) => onStatusChange(e.target.value)}
                        icon={Tag}
                    />

                    <FilterSelect
                        label="Type"
                        value={filterType}
                        options={DONATION_TYPE_OPTIONS}
                        onChange={(e) => onTypeChange(e.target.value)}
                        icon={Tag}
                    />

                    <FilterSelect
                        label="Event"
                        value={filterEvent}
                        options={eventOptions}
                        onChange={(e) => onEventChange(e.target.value)}
                        icon={Calendar}
                    />
                </div>
            </div>
        </div>
    );
};

export default InternalDonationFilters;
