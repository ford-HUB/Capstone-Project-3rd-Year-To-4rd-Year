import { CheckCircle, Clock3, AlertCircle, Clock } from "lucide-react";

export const getRegistrationStatusConfig = (status) => {
  switch (status) {
    case 'registered':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Approved',
        headerBg: 'bg-green-50',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      };
    case 'pending':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock3 className="w-4 h-4" />,
        label: 'Pending Review',
        headerBg: 'bg-yellow-50',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      };
    case 'declined':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Declined',
        headerBg: 'bg-red-50',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
      };
    case 'cancelled':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Cancelled',
        headerBg: 'bg-gray-50',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Unknown',
        headerBg: 'bg-gray-50',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600'
      };
  }
};

/**
 * Registration Status Types
 * Available registration statuses in the system
 */
export const REGISTRATION_STATUS = {
  REGISTERED: 'registered',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
  DECLINED: 'declined'
};

/**
 * Registration Status Labels
 * Human-readable labels for registration statuses
 */
export const REGISTRATION_STATUS_LABELS = {
  [REGISTRATION_STATUS.REGISTERED]: 'Approved',
  [REGISTRATION_STATUS.PENDING]: 'Pending Review',
  [REGISTRATION_STATUS.CANCELLED]: 'Cancelled',
  [REGISTRATION_STATUS.REJECTED]: 'Rejected',
  [REGISTRATION_STATUS.DECLINED]: 'Declined'
};

/**
 * Get Status Color Classes
 * Returns the appropriate Tailwind CSS classes for status colors
 * Used in cards and tables
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'registered':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'declined':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get Status Icon Component
 * Returns the appropriate icon component for the status
 * Used in cards and tables
 */
export const getStatusIcon = (status) => {
  switch (status) {
    case 'registered':
      return <CheckCircle className="w-4 h-4" />;
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'declined':
      return <AlertCircle className="w-4 h-4" />;
    case 'cancelled':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};
