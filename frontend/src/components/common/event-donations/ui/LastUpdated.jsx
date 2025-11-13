import React from 'react';
import { Clock } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const LastUpdated = ({ lastUpdated }) => {
    const formatLastUpdated = (timestamp) => {
        if (!timestamp) return 'Never updated';
        
        const now = dayjs();
        const updated = dayjs(timestamp);
        const diffInMinutes = now.diff(updated, 'minute');
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        
        return updated.format('MMM DD, YYYY [at] h:mm A');
    };

    return (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
        </div>
    );
};

export default LastUpdated;
