// Payment method display names
export const PAYMENT_DISPLAY_NAMES = {
    gcash: 'GCash',
    card: 'Credit Card',
    paymaya: 'PayMaya',
    bpi: 'BPI',
    ubp: 'UnionBank'
}

// Payment method icons mapping function
export const getPaymentIcon = (type, asset) => {
    switch (type) {
        case 'gcash':
            return asset.gcash;
        case 'card':
            return asset.visa;
        case 'paymaya':
            return asset.maya;
        case 'bpi':
            return asset.bpi || asset.visa;
        case 'ubp':
            return asset.ubp || asset.visa;
        default:
            return asset.visa;
    }
}

// Payment method display name mapping function
export const getPaymentDisplayName = (type) => {
    switch (type) {
        case 'gcash':
            return 'GCash';
        case 'card':
            return 'Credit Card';
        case 'paymaya':
            return 'PayMaya';
        case 'bpi':
            return 'BPI';
        case 'ubp':
            return 'UnionBank';
        default:
            return 'Payment Method';
    }
}

// Payment status colors
export const PAYMENT_STATUS_COLORS = {
    ACTIVE: 'bg-green-500',
    INACTIVE: 'bg-gray-500',
    PENDING: 'bg-yellow-500'
}

// Payment status labels
export const PAYMENT_STATUS_LABELS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PENDING: 'Pending'
}

// Maximum payment methods allowed
export const MAX_PAYMENT_METHODS = 3

// Payment method types
export const PAYMENT_METHOD_TYPES = ['gcash', 'card', 'bpi', 'ubp', 'paymaya']

// Icon component mapping function
export const getIconComponent = (iconName, { CreditCard, Smartphone, Building }) => {
    switch (iconName) {
        case 'CreditCard':
            return CreditCard;
        case 'Smartphone':
            return Smartphone;
        case 'Building':
            return Building;
        default:
            return CreditCard;
    }
};