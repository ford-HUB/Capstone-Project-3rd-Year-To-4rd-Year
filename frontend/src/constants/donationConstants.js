// Donation status options
export const DONATION_STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'RECEIVED', label: 'Received' },
    { value: 'DISTRIBUTED', label: 'Distributed' },
    { value: 'COMPLETED', label: 'Completed' }
];

// Donation type options
export const DONATION_TYPE_OPTIONS = [
    { value: 'all', label: 'All Types' },
    { value: 'GOODS', label: 'Goods' },
    { value: 'MONEY', label: 'Money' }
];

// Donation status colors
export const DONATION_STATUS_COLORS = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    RECEIVED: 'bg-blue-100 text-blue-800',
    DISTRIBUTED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    default: 'bg-gray-100 text-gray-800'
};

// Donation status icons
export const DONATION_STATUS_ICONS = {
    PENDING: 'Clock',
    RECEIVED: 'CheckCircle',
    DISTRIBUTED: 'Package',
    COMPLETED: 'CheckCircle',
    default: 'AlertCircle'
};

// Donation type icons
export const DONATION_TYPE_ICONS = {
    GOODS: 'Package',
    MONEY: 'DollarSign',
    default: 'Package'
};

// Search fields for donation filtering
export const DONATION_SEARCH_FIELDS = [
    'Donor.fullname',
    'Donor.email',
    'Event.title',
    'GoodsDonation.detailed_description',
    'GoodsDonation.type_goods'
];
