import React from 'react';
import { Calendar, MapPin, Clock, Users, CheckCircle, AlertCircle, Heart } from 'lucide-react';
import dayjs from 'dayjs';

const BeneficiaryEventDetailsStep = ({ userProfile, userEmail, formValues, eventData }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Event Registration Summary
                </h2>
                <p className="text-gray-600 text-sm">
                    Review your registration details before confirming
                </p>
            </div>

            <div className="space-y-6">
                {/* Event Information */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2">
                        <Heart className="w-5 h-5" />
                        <span>Event Details</span>
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-green-800 mb-2">{eventData.title}</h4>
                            <p className="text-sm text-green-700">{eventData.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-4 h-4 text-green-600" />
                                <div>
                                    <p className="text-xs text-green-600 font-medium">Date</p>
                                    <p className="text-sm text-green-800">
                                        {dayjs(eventData.event_started).format('MMMM D, YYYY')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Clock className="w-4 h-4 text-green-600" />
                                <div>
                                    <p className="text-xs text-green-600 font-medium">Time</p>
                                    <p className="text-sm text-green-800">
                                        {dayjs(eventData.event_started).format('h:mm A')} - {dayjs(eventData.event_ended).format('h:mm A')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 md:col-span-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                <div>
                                    <p className="text-xs text-green-600 font-medium">Location</p>
                                    <p className="text-sm text-green-800">{eventData.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Personal Information
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Full Name</p>
                                <p className="text-gray-900">
                                    {formValues.firstname} {formValues.middle_initial} {formValues.lastname}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700">Email</p>
                                <p className="text-gray-900">{userEmail || 'Not provided'}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700">Phone Number</p>
                                <p className="text-gray-900">{formValues.phone_number || 'Not provided'}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700">Age</p>
                                <p className="text-gray-900">{formValues.age ? `${formValues.age} years old` : 'Not provided'}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700">Gender</p>
                                <p className="text-gray-900">
                                    {formValues.gender === 'M' ? 'Male' : 
                                     formValues.gender === 'F' ? 'Female' : 
                                     formValues.gender === 'O' ? 'Other' : 'Not provided'}
                                </p>
                            </div>

                            {userProfile?.organization_name && formValues.organization_name && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Organization</p>
                                    <p className="text-gray-900">{formValues.organization_name}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Current Address</p>
                            <p className="text-gray-900">{formValues.current_address || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Needs Assessment Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Needs Assessment
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Current Situation</p>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                {formValues.current_situation || 'Not provided'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Your Needs</p>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                {formValues.needs || 'Not provided'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">How We Can Help</p>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                {formValues.how_can_we_help || 'Not provided'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ID Verification Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ID Verification
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Uploaded ID Photos</p>
                            {formValues.id_files && formValues.id_files.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                                    {Array.from(formValues.id_files).map((file, index) => (
                                        <div key={index} className="relative border border-gray-300 rounded-lg p-3">
                                            <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-2">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`ID Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-600 truncate">{file.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No ID photos uploaded</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-900 mb-2">
                                Important Information
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• You will receive a confirmation email after registration</li>
                                <li>• Event organizers may contact you for additional details</li>
                                <li>• Please arrive 15 minutes before the event starts</li>
                                <li>• Please arrange your own transportation to and from the event venue</li>
                                <li>• Contact the organizer if you need to cancel your registration</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryEventDetailsStep;
