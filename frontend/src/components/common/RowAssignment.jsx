import React from 'react';
import { Book } from 'lucide-react';

const RowAssignment = ({ dueDate, title, description }) => {
    return (
      <div className="border-l-4 border-orange-500 hover:border-blue-600 hover:border-l-4 hover:bg-gray-50 pl-4 transition ease-in-out duration-300">
        <div className="text-xs text-gray-500 mb-1">Started At {dueDate}</div>
        <div className="font-medium text-gray-900 mb-1">{title}</div>
        <div className="flex items-center space-x-2">
          <Book className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">{description}</span>
        </div>
      </div>
    );
};

export default RowAssignment;