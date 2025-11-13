export const getEventStatusColor = (status) => {
    switch (status) {
        case 'Ongoing':
            return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        case 'Upcoming':
            return 'text-blue-600 bg-blue-50 border-blue-200';
        case 'Completed':
            return 'text-green-600 bg-green-50 border-green-200';
        case 'Cancelled':
            return 'text-red-600 bg-red-50 border-red-200';
        case 'Draft':
            return 'text-gray-600 bg-gray-50 border-gray-200';
        default:
            return 'text-gray-600 bg-gray-50 border-gray-200';
    }
};

export const getProofStatusColor = (isUploaded) => {
    return isUploaded
        ? 'text-green-700 bg-green-100'
        : 'text-orange-700 bg-orange-100';
};

export const getEvaluationStatusColor = (isCompleted) => {
    return isCompleted
        ? 'text-green-700 bg-green-100'
        : 'text-orange-700 bg-orange-100';
};

export const getProofStatusText = (isUploaded) => {
    return isUploaded ? 'Uploaded' : 'Pending';
};

export const getEvaluationStatusText = (isCompleted) => {
    return isCompleted ? 'Completed' : 'Pending';
};

export const getAvatar = (title) => {
    if (!title) return 'EV';
    return title
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
};
