import React from 'react';
import { Calendar } from 'lucide-react';
import BeneficiaryRegistrationCard from './BeneficiaryRegistrationCard.jsx';

const BeneficiaryRegisteredEventsList = ({ 
  registeredEvents, 
  isLoading 
}) => {
  console.log('BeneficiaryRegisteredEventsList: Received props:', { registeredEvents, isLoading });
  console.log('BeneficiaryRegisteredEventsList: registeredEvents length:', registeredEvents?.length);
  console.log('BeneficiaryRegisteredEventsList: registeredEvents data:', registeredEvents);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registered events...</p>
        </div>
      </div>
    );
  }

  if (!registeredEvents?.length) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No registered events
        </h3>
        <p className="text-gray-600">
          You haven't been approved for any events yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {registeredEvents.map((registration) => (
        <BeneficiaryRegistrationCard
          key={registration.event_registration_id}
          registration={registration}
        />
      ))}
    </div>
  );
};

export default BeneficiaryRegisteredEventsList;
