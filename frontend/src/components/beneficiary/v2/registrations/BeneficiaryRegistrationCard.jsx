import React from 'react';
import { Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { getStatusColor, getStatusIcon } from '../../../../constants/registrationStatusConfig.jsx';
// import { getStatusColor, getStatusIcon } from '../../../constants/registrationStatusConfig.js';

const BeneficiaryRegistrationCard = ({ registration }) => {
  console.log('BeneficiaryRegistrationCard: Received registration:', registration);
  console.log('BeneficiaryRegistrationCard: Registration status:', registration?.status);
  console.log('BeneficiaryRegistrationCard: Event data:', registration?.event);

  const formatDate = (dateString) => dayjs(dateString).format('MMM D, YYYY');
  const formatTime = (dateString) => dayjs(dateString).format('h:mm A');
  const formatDateTime = (dateString) => dayjs(dateString).format('MMM D, YYYY h:mm A');


  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {registration.event?.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {registration.event?.description}
          </p>
        </div>
        <div className="ml-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              registration.status
            )}`}
          >
            {getStatusIcon(registration.status)}
            <span className="ml-1 capitalize">{registration.status}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formatDate(registration.event?.event_started)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{formatTime(registration.event?.event_started)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{registration.event?.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>
            {registration.event?.participants}/
            {registration.event?.max_participants} participants
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Registered on {formatDateTime(registration.registration_date)}
        </div>
      </div>

      {/* Important Notice for Approved Events */}
      {registration.status === 'registered' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-green-800 mb-1">Important Reminder</p>
              <p className="text-green-700">
                Please arrive at the venue <strong>15 minutes before</strong> the event starts to ensure smooth check-in and seating arrangements.
              </p>
              <p className="text-green-600 text-xs mt-1">
                Arrival time: {formatTime(dayjs(registration.event?.event_started).subtract(15, 'minutes').toISOString())}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryRegistrationCard;
