// Payment method constants and mapping
export const PAYMENT_METHOD_MAP = {
  'gcash': {
    id: 'gcash',
    name: 'GCash',
    description: 'Mobile wallet payment',
    icon: 'Smartphone',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  'card': {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: 'CreditCard',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  'bpi': {
    id: 'bpi',
    name: 'BPI',
    description: 'Bank of the Philippine Islands',
    icon: 'Building',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  'ubp': {
    id: 'ubp',
    name: 'UnionBank',
    description: 'UnionBank of the Philippines',
    icon: 'Building',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  'paymaya': {
    id: 'paymaya',
    name: 'PayMaya',
    description: 'Mobile wallet payment',
    icon: 'Smartphone',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
};

// Default payment method for unknown types
export const DEFAULT_PAYMENT_METHOD = {
  id: 'unknown',
  name: 'Payment Method',
  description: 'Payment method',
  icon: 'CreditCard',
  color: 'text-gray-600',
  bgColor: 'bg-gray-50',
  borderColor: 'border-gray-200'
};

// Function to map payment method types to user-friendly objects
export const mapPaymentMethods = (paymentMethodTypes) => {
  return paymentMethodTypes.map(method => 
    PAYMENT_METHOD_MAP[method] || {
      ...DEFAULT_PAYMENT_METHOD,
      id: method,
      name: method.toUpperCase()
    }
  );
};
