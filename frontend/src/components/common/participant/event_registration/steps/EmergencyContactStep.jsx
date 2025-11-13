import React from 'react';
import { MapPin, Shield, AlertCircle, Users, CheckCircle } from 'lucide-react';
import InputField from '../InputField';

const EmergencyContactStep = ({ register, userProfile, errors, focusRef }) => (
    <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress & Header */}
        <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Step 2 of 3</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
            <p className="text-gray-600 mt-1">Help us ensure your safety and provide the best event experience</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Current Address</h3>
                        <p className="text-sm text-gray-600">We may need this for event communications and logistics</p>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {`Current Address`} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div
                            className={`w-full bg-gray-100 cursor-not-allowed pl-4 pr-4 py-3 border-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 border-gray-200`}>
                                { userProfile.Student.current_address }
                            </div>
                        </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">
                            <strong>Privacy note:</strong> Your address is kept confidential and used only for event-related purposes such as sending important updates or materials.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div ref={focusRef} className="p-6">
                <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Emergency Contact Information</h3>
                        <p className="text-sm text-gray-600">Optional: Someone we can reach if needed during the event</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        name="emergencyContactName"
                        label="Emergency Contact's Full Name (Optional)"
                        placeholder="Enter your emergency contact name"
                        {...register('emergency_contact_fullname')}
                        error={errors?.emergency_contact_fullname?.message}
                        className="focus:ring-blue-500 focus:border-blue-500"
                    />
                    <InputField
                        name="emergencyContactPhone"
                        label="Emergency Contact's Phone Number (Optional)"
                        type="tel"
                        placeholder="e.g., 0981******"
                        {...register('emergency_contact_number')}
                        error={errors?.emergency_contact_number?.message}
                        className="focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        name="relationship"
                        label="Relationship to You (Optional)"
                        {...register('relationship')}
                        error={errors?.relationship?.message}
                        placeholder="e.g., Spouse, Parent, Friend"
                        className="focus:ring-blue-500 focus:border-blue-500"
                    />
                    <InputField
                        name="emergencyContactEmail"
                        label="Emergency Contact's Email (Optional)"
                        type="email"
                        {...register('emergency_contact_email')}
                        placeholder="john.smith@email.com"
                        error={errors?.emergency_contact_email?.message}
                        className="focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start">
                        <Shield className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                            <p className="font-medium mb-1">Your safety is our priority</p>
                            <p>This contact will only be used in genuine emergencies during the event. We never share this information with third parties.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
            <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tips for choosing an emergency contact:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Choose someone who knows your medical conditions or allergies</li>
                        <li>• Pick someone who is usually available during event hours</li>
                        <li>• Consider selecting someone in your local area if possible</li>
                        <li>• Make sure they know they're listed as your emergency contact</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Help Section */}
        <div className="text-center py-4">
            <p className="text-sm text-gray-500">
                Questions about this information? <button className="text-blue-600 hover:text-blue-800 font-medium">Contact our support team</button>
            </p>
        </div>
    </div>
);

export default EmergencyContactStep;