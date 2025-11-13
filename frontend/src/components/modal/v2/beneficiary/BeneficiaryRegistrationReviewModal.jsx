import React from 'react';
import { X, Calendar, MapPin, Clock, FileText, User, Eye, Shield } from 'lucide-react';
import { getRegistrationStatusConfig } from '../../../../constants/registrationStatusConfig.jsx';
import dayjs from 'dayjs';

const BeneficiaryRegistrationReviewModal = ({ 
  open, 
  setOpen, 
  selectedRegistration 
}) => {
  if (!open || !selectedRegistration) return null;

  const formatDate = (dateString) => dayjs(dateString).format('MMM D, YYYY');
  const formatTime = (dateString) => dayjs(dateString).format('h:mm A');
  const formatDateTime = (dateString) => dayjs(dateString).format('MMM D, YYYY h:mm A');


  const statusConfig = getRegistrationStatusConfig(selectedRegistration.status);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col z-10">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${statusConfig.headerBg} rounded-t-2xl flex-shrink-0`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${statusConfig.iconBg} rounded-full flex items-center justify-center`}>
              <FileText className={`w-6 h-6 ${statusConfig.iconColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Registration Details</h2>
              <p className="text-sm text-gray-600 mt-1">
                Review your event registration information
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Event Information Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {selectedRegistration.event?.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {selectedRegistration.event?.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-800">{formatDate(selectedRegistration.event?.event_started)}</p>
                        <p className="text-gray-500 text-xs">Event Date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-800">{formatTime(selectedRegistration.event?.event_started)}</p>
                        <p className="text-gray-500 text-xs">Start Time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-800 truncate">{selectedRegistration.event?.location}</p>
                        <p className="text-gray-500 text-xs">Location</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details Card */}
            {(selectedRegistration.current_situation || selectedRegistration.needs || selectedRegistration.how_can_we_help) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Application Details</h3>
                    
                    <div className="space-y-4">
                      {selectedRegistration.current_situation && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-800 mb-2">Current Situation</h4>
                          <p className="text-gray-600 leading-relaxed">{selectedRegistration.current_situation}</p>
                        </div>
                      )}
                      
                      {selectedRegistration.needs && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-800 mb-2">Your Needs</h4>
                          <p className="text-gray-600 leading-relaxed">{selectedRegistration.needs}</p>
                        </div>
                      )}
                      
                      {selectedRegistration.how_can_we_help && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-800 mb-2">How We Can Help</h4>
                          <p className="text-gray-600 leading-relaxed">{selectedRegistration.how_can_we_help}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ID Verification Files Card */}
            {selectedRegistration.id_verification_files && selectedRegistration.id_verification_files.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">ID Verification Documents</h3>
                    <p className="text-sm text-gray-600 mb-4">Click on any image to view full size</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedRegistration.id_verification_files.map((file, index) => (
                        <div key={index} className="relative border border-gray-300 rounded-lg p-3 hover:border-gray-400 transition-colors bg-gray-50">
                          <div 
                            className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-2 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => window.open(file.url, '_blank')}
                            title="Click to view full size"
                          >
                            <img
                              src={file.url}
                              alt={`ID Verification ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-600 truncate flex-1">
                              {file.filename}
                            </p>
                            <div className="flex gap-1">
                              <button
                                onClick={() => window.open(file.url, '_blank')}
                                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-700 transition-colors"
                                title="View Full Size"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Information Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Registration Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">Application Date</h4>
                      <p className="text-gray-600">{formatDateTime(selectedRegistration.registration_date)}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">Current Status</h4>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.icon}
                          <span className="ml-2">{statusConfig.label}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice for Approved Events */}
            {selectedRegistration.status === 'registered' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Important Reminder</h3>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Arrival Instructions</h4>
                          <p className="text-green-700 mb-3">
                            Please arrive at the venue <strong>15 minutes before</strong> the event starts to ensure smooth check-in and seating arrangements.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <h5 className="font-medium text-green-800 mb-1">Event Start Time</h5>
                              <p className="text-green-600">{formatDateTime(selectedRegistration.event?.event_started)}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <h5 className="font-medium text-green-800 mb-1">Arrival Time</h5>
                              <p className="text-green-600">{formatDateTime(dayjs(selectedRegistration.event?.event_started).subtract(15, 'minutes').toISOString())}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 p-2 border-gray-200 bg-white rounded-b-2xl flex-shrink-0">
                <button
                    onClick={() => setOpen(false)}
                    className="px-6 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                >
                    Close
                </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BeneficiaryRegistrationReviewModal;
