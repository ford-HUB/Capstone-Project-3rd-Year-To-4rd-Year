import React from 'react';
import { Calendar, MapPin, CheckCircle, Clock, Heart, Star } from 'lucide-react';

const EventParticipationSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Event Participation</h3>
            <p className="text-gray-600">How to find, register, and participate in events</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              Finding Events
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Browse Events</p>
                  <p className="text-sm text-gray-600">View the event list and open an event to see full details, schedule, and location.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Check Status</p>
                  <p className="text-sm text-gray-600">Volunteers can register only when an event is marked as <span className="font-medium text-gray-800">Upcoming</span>.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Review Requirements</p>
                  <p className="text-sm text-gray-600">Read the event information carefully before joining. Duplicate registrations are prevented.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Registration Process
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Select "Join" on an Upcoming event to register as a volunteer.</span>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-5 h-5 text-blue-600">ℹ</div>
                <span className="text-sm text-gray-700">Provide emergency contact details (optional). Empty fields are saved as blank.</span>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Confirm to complete registration. You cannot register twice for the same event.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 text-purple-600 mr-2" />
              Event Day
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Before the Event</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Arrive early and locate the QR station.</li>
                  <li>• Make sure your device can scan the event QR.</li>
                  <li>• Verify the venue and schedule.</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">During the Event</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Scan the event QR to record <span className="font-medium text-gray-800">Time-In</span>.</li>
                  <li>• Follow coordinator instructions and participate safely.</li>
                  <li>• You can only <span className="font-medium text-gray-800">Time-Out</span> after the event is marked Completed.</li>
                </ul>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">After the Event</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• When the event ends, scan the QR to record <span className="font-medium text-gray-800">Time-Out</span>.</li>
                  <li>• You may be prompted to upload <span className="font-medium text-gray-800">proof images</span> (images only, max 5) for certificate eligibility.</li>
                  <li>• Your volunteer hours are computed once Time-In and Time-Out are recorded.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 text-red-600 mr-2" />
              Best Practices
            </h4>
            <div className="space-y-2">
              {[
                'Be punctual and reliable',
                'Dress appropriately for the event',
                'Bring a positive attitude',
                'Follow safety guidelines',
                'Respect other participants',
                'Complete all required tasks'
              ].map((practice, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">{practice}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventParticipationSection;
