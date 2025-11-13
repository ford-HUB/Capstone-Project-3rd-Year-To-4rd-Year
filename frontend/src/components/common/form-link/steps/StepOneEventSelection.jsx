import React from 'react';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const StepOneEventSelection = ({ register, errors, events, loading }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select an Event</h3>
        <p className="text-gray-600">Choose the event that this form will be associated with</p>
        {events && events.length === 0 && !loading && (
          <p className="text-red-500 text-sm mt-2">No events available for form creation</p>
        )}
        {events && events.length > 0 && (
          <p className="text-blue-600 text-sm mt-2">
            {events.length} event{events.length > 1 ? 's' : ''} available for form creation. 
            Events with both volunteer and beneficiary forms are automatically hidden.
          </p>
        )}
      </div>
      
      <div className="group">
        <label htmlFor="event_id" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>Select Event</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            {...register('event_id')}
            className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
              errors.event_id ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">
              {loading ? 'Loading events...' : 'Choose an event'}
            </option>
            {events.map((event) => (
              <option key={event.event_id} value={event.event_id}>
                {event.title} - {new Date(event.event_started).toLocaleDateString()}
              </option>
            ))}
          </select>
          {!errors.event_id && (
            <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.event_id && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.event_id.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepOneEventSelection;
