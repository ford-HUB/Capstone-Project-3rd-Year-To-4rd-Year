import { AlertTriangle, X, Trash2, UserX, AlertCircle, UserCheck } from 'lucide-react';

export const TYPES = {
    DELETE: {
        icon: Trash2,
        title: 'Soft Delete Account',
        action: 'Delete',
        color: 'red',
        message: 'The account is tempo will be moved to trash',
    },
    SOFT_DELETE: {
        icon: AlertTriangle,
        title: 'Soft Delete Account',
        action: 'Archive',
        color: 'red',
        message: 'Once you proceed the account will be restorable within 90 days',
        requiresReason: true,
    },
    DEACTIVATE_ACCOUNT: {
        icon: UserX,
        title: 'Deactivate Account',
        action: 'Deactivate',
        color: 'orange',
        message: 'Once you proceed account will be temporarily deactivated',
        requiresReason: true,
    },
    RESTORE_ACCOUNT: {
        icon: UserCheck,
        title: 'Restore Account',
        action: 'Restore',
        color: 'green',
        message: 'Once you proceed account will be restored and activated',
    },
    REJECT_REQUEST: {
        icon: UserX,
        title: 'Reject Request',
        action: 'Reject',
        color: 'red',
        message: 'Once you proceed the request will be rejected and the user will be notified',
        requiresReason: true,
    },
    ACCEPT_REJECTED_REQUEST: {
        icon: UserCheck,
        title: 'Accept Previously Rejected Request',
        action: 'Accept',
        color: 'green',
        message: 'Once you proceed the request will be approved and the user will receive a verification email',
    },
    PERMANENT_DELETE: {
        icon: AlertCircle,
        title: 'Delete Forever',
        action: 'Delete Forever',
        color: 'red',
        message: 'This cannot be undone',
    },
    DELETE_REQUIREMENT: {
        icon: Trash2,
        title: 'Delete this requirement?',
        action: 'Yes',
        color: 'red',
        message: 'This requirement will be permanently removed and cannot be undone',
        requiresReason: true,
        cancelText: 'No',
    },
    DELETE_CERTIFICATE_TEMPLATE: {
        icon: Trash2,
        title: 'Delete Certificate Template',
        action: 'Delete',
        color: 'red',
        message: 'This certificate template will be permanently removed and cannot be undone',
        requiresReason: true,
        cancelText: 'Cancel',
    },
};

export const COLORS = {
    'red': {
        icon: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
        button: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    },
    'amber': {
        icon: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        button: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
    },
    'orange': {
        icon: 'text-orange-500',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        button: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500',
    },
    'green': {
        icon: 'text-green-500',
        bg: 'bg-green-50',
        border: 'border-green-200',
        button: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    },
};



