import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const BeneficiaryRegistrationsTabNavigation = ({
  activeTab,
  onTabChange,
  registeredEventsCount,
  pendingRegistrationsCount
}) => {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8">
        <button
          onClick={() => onTabChange('registered')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'registered'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approved Events ({registeredEventsCount})
          </div>
        </button>
        <button
          onClick={() => onTabChange('pending')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'pending'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Pending Approval ({pendingRegistrationsCount})
          </div>
        </button>
      </nav>
    </div>
  );
};

export default BeneficiaryRegistrationsTabNavigation;
