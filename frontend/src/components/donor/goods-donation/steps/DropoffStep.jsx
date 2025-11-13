import React from 'react';
import { MapPin, Calendar, Clock, MessageSquare } from 'lucide-react';
import FormField from '../../../common/participant/profile/fields/FormField';
import TextInput from '../../../common/participant/profile/fields/TextInput';
import { asset } from '../../../../assets/asset';

const DropoffStep = ({ formData, handleInputChange, errors }) => {
  const dropoffLocations = [
    {
      id: 'uclm_location',
      name: 'UCLM Location',
      address: 'Front Gate 1 - Drop off of the donation',
      hours: 'Mon-Fri: 8AM-5PM, Sat: 9AM-2PM',
      icon: MapPin
    }
  ];

  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  // Generate next 30 days for date selection
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      dates.push({ value: formattedDate, label: displayDate });
    }
    
    return dates;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Drop-off Information</h2>
      {/* <p className="text-gray-600 mb-6">Drop off your donation at the UCLM location.</p> */}
      <div>
              <div className="text-sm text-gray-600 mt-1">Front Gate 1 - Drop off of the donation</div>
              <div className="text-xs text-gray-500 mt-1">Mon-Fri: 8AM-5PM, Sat: 9AM-2PM</div>
            </div>

      {/* UCLM Location Image */}
      <div className="my-4">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-0.5 text-center">
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <img src={asset.uclmFrontBuilding} alt="UCLM Front Building" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      
      <input
        type="hidden"
        name="dropoffLocation"
        value="uclm_location"
      />

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Date *
          </label>
          <select
            name="preferredDate"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange(e.target.name, e.target.value, e.target.type, e.target.checked)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.preferredDate ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a date</option>
            {generateDateOptions().map((date) => (
              <option key={date.value} value={date.value}>
                {date.label}
              </option>
            ))}
          </select>
          {errors.preferredDate && (
            <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Time *
          </label>
          <select
            name="preferredTime"
            value={formData.preferredTime}
            onChange={(e) => handleInputChange(e.target.name, e.target.value, e.target.type, e.target.checked)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.preferredTime ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.preferredTime && (
            <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default DropoffStep;
