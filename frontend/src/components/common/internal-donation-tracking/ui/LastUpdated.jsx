import React from 'react';
import { Clock } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const LastUpdated = ({ lastUpdated }) => {
    if (!lastUpdated) {
        return (
            <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>No donations yet</span>
            </div>
        );
    }

    const updatedAt = dayjs(lastUpdated);
    const timeAgo = updatedAt.fromNow();

    return (
        <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Last updated {timeAgo}</span>
        </div>
    );
};

export default LastUpdated;
