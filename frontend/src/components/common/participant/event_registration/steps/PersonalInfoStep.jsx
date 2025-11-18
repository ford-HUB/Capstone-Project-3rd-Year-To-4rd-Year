import React from 'react';
import { User, Mail, Phone, UserCheck, Shield, CheckCircle, Icon } from 'lucide-react';
import InputField from '../InputField';

const PersonalInfoStep = ({ userProfile, userEmail }) => (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                <UserCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Step 1 of 3</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Let's Get Started</h2>
            <p className="text-gray-600 mt-1">Tell us a bit about yourself to personalize your event experience</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Your Personal Information</h3>
                        <p className="text-sm text-gray-600">We'll use this information for your event registration and communication</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {`First Name`} <span className="text-blue-500">*</span>
                        </label>
                        <div className="relative">
                            <div
                            className={`w-full bg-gray-100 cursor-not-allowed pl-4 pr-4 py-3 border-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 border-gray-200`}>
                                {userProfile?.CampusUsers?.firstname}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {`Last Name`} <span className="text-blue-500">*</span>
                        </label>
                        <div className="relative">
                            <div
                            className={`w-full pl-4 bg-gray-100 cursor-not-allowed pr-4 py-3 border-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 border-gray-200`}>
                                {userProfile?.CampusUsers?.lastname}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="relative">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {`Email Address`} <span className="text-blue-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <div className={`w-full bg-gray-100 cursor-not-allowed pl-12 pr-4 py-3 border-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 border-gray-200`}>
                                    { userEmail.email }
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            We'll send your event confirmation and important updates to this email
                        </p>
                    </div>

                    <div className="relative">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {`Phone Number`} <span className="text-blue-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <div className={`w-full pl-12 bg-gray-100 cursor-not-allowed pr-4 py-3 border-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 border-gray-200`}>
                                        { userProfile?.CampusUsers?.phone_number }
                                    </div>
                                </div>
                            </div>
                        <p className="text-xs text-gray-500 mt-1">
                            For urgent event updates and verification purposes
                        </p>
                    </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                        <Shield className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Your privacy matters</p>
                            <p>Your personal information is encrypted and will never be shared with third parties. We only use it for event-related communications and registration purposes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
            <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quick tips for a smooth registration:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Use the same email you'd like to receive event updates on</li>
                        <li>• Double-check your phone number for accurate event notifications</li>
                        <li>• Make sure your name matches any ID you might need for the event</li>
                        <li>• All fields marked with * are required to complete registration</li>
                    </ul>
                </div>
            </div>
        </div>
 
    </div>
);

export default PersonalInfoStep;