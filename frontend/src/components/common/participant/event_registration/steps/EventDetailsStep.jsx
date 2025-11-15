import React from 'react';
import TicketCard from '../cards/TicketCard';
import SelectField from '../SelectField';
import InputField from '../InputField';
import CheckboxField from '../CheckboxField';
import { CheckCircle, UserCircle, Users, Edit3, Shield, Mail } from 'lucide-react';

const EventDetailsStep = ({ userProfile, userEmail, formValues}) => (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Almost there!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Review Your Information</h2>
            <p className="text-gray-600 mt-1">Please verify your details and complete the emergency contact information</p>
        </div>

        {/* Personal Information Review Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <UserCircle className="w-5 h-5 mr-2 text-blue-600" />
                        Your Personal Information
                    </h3>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</span>
                        <span className="text-gray-900 font-medium mt-1">{`${userProfile.Student.firstname} ${userProfile.Student.lastname}`}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</span>
                        <span className="text-gray-900 font-medium mt-1">{userEmail.email}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</span>
                        <span className="text-gray-900 font-medium mt-1">{userProfile.Student.phone_number}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</span>
                        <span className="text-gray-900 font-medium mt-1">{userProfile.Student.current_address}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Emergency Contact & Additional Info Display */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mr-3">
                            <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact & Additional Information</h3>
                            <p className="text-sm text-gray-600">Information provided for your safety and event logistics</p>
                        </div>
                    </div>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        {/* <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Address</span>
                            <span className="text-gray-900 font-medium mt-1">{'Not provided'}</span>
                        </div> */}
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Emergency Contact Name</span>
                            <span className="text-gray-900 font-medium mt-1">
                                {formValues.emergency_contact_fullname || 'Not provided'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Relationship</span>
                            <span className="text-gray-900 font-medium mt-1">
                                {formValues.relationship || 'Not provided'}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Emergency Contact Phone</span>
                            <span className="text-gray-900 font-medium mt-1">
                                {formValues.emergency_contact_number || 'Not provided'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Emergency Contact Email</span>
                            <span className="text-gray-900 font-medium mt-1">{formValues.emergency_contact_email ||'Not provided'}</span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <p className="text-sm text-green-800">
                            <strong>Information complete:</strong> Your details have been saved securely. Emergency contact information is optional but recommended for your safety.
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
);

export default EventDetailsStep;