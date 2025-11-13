import React from 'react';
import { MapPin, X, FileText, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import PendingRegistrationsPagination from '../PendingRegistrationsPagination.jsx';
import { getStatusColor, getStatusIcon } from '../../../../constants/registrationStatusConfig.jsx';
// import { getStatusColor, getStatusIcon } from '../../../constants/registrationStatusConfig.js';

const BeneficiaryPendingRegistrationsTable = ({
  pendingRegistrations,
  pagination,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onReviewRegistration,
  onCancelRegistration
}) => {
  const formatDate = (dateString) => dayjs(dateString).format('MMM D, YYYY');
  const formatTime = (dateString) => dayjs(dateString).format('h:mm A');
  const formatDateTime = (dateString) => dayjs(dateString).format('MMM D, YYYY h:mm A');


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending registrations...</p>
        </div>
      </div>
    );
  }

  if (!pendingRegistrations?.length) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No pending registrations
        </h3>
        <p className="text-gray-600">
          You don't have any registrations waiting for approval.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Pagination Info and Controls */}
      {pagination.totalRecords > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of {pagination.totalRecords} pending registrations
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                const newPageSize = parseInt(e.target.value);
                onPageSizeChange(1, newPageSize);
              }}
              disabled={isLoading}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingRegistrations.map((registration) => (
                <tr key={registration.event_registration_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.event?.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {registration.event?.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {registration.event?.participants}/{registration.event?.max_participants} participants
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(registration.event?.event_started)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(registration.event?.event_started)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="truncate max-w-32">
                        {registration.event?.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(registration.registration_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                      {getStatusIcon(registration.status)}
                      <span className="ml-1 capitalize">{registration.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onReviewRegistration(registration)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Review
                      </button>
                      <button
                        onClick={() => onCancelRegistration(registration)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <PendingRegistrationsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default BeneficiaryPendingRegistrationsTable;
