import React from 'react';
import { User, Mail, MapPin, Calendar, Building, Phone, Edit3, AlertCircle } from 'lucide-react';

const BeneficiaryPersonalInfoStep = ({ 
    userProfile, 
    userEmail, 
    register, 
    errors, 
    isEditable = false,
    focusRef 
}) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Personal Information
                </h2>
                <p className="text-gray-600 text-sm">
                    {isEditable ? 'Update your personal details for event registration' : 'Verify your personal details for event registration'}
                </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>First Name *</span>
                        </label>
                        {isEditable ? (
                            <div>
                                <input
                                    ref={focusRef}
                                    type="text"
                                    {...register('firstname')}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                        errors.firstname ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your first name"
                                    defaultValue={userProfile?.firstname || ''}
                                />
                                {errors.firstname && (
                                    <p className="text-red-600 text-sm flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.firstname.message}</span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-900">{userProfile?.firstname || 'Not provided'}</span>
                            </div>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Last Name *</span>
                        </label>
                        {isEditable ? (
                            <div>
                                <input
                                    type="text"
                                    {...register('lastname')}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                        errors.lastname ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your last name"
                                    defaultValue={userProfile?.lastname || ''}
                                />
                                {errors.lastname && (
                                    <p className="text-red-600 text-sm flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.lastname.message}</span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-900">{userProfile?.lastname || 'Not provided'}</span>
                            </div>
                        )}
                    </div>

                    {/* Middle Initial */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Middle Initial</span>
                        </label>
                        {isEditable ? (
                            <div>
                                <input
                                    type="text"
                                    {...register('middle_initial')}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                        errors.middle_initial ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter middle initial"
                                    defaultValue={userProfile?.middle_initial || ''}
                                    maxLength={1}
                                />
                                {errors.middle_initial && (
                                    <p className="text-red-600 text-sm flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.middle_initial.message}</span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-900">{userProfile?.middle_initial || 'Not provided'}</span>
                            </div>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>Phone Number *</span>
                        </label>
                        {isEditable ? (
                            <div>
                                <input
                                    type="tel"
                                    {...register('phone_number')}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                        errors.phone_number ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your phone number"
                                    defaultValue={userProfile?.phone_number || ''}
                                />
                                {errors.phone_number && (
                                    <p className="text-red-600 text-sm flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.phone_number.message}</span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-900">{userProfile?.phone_number || 'Not provided'}</span>
                            </div>
                        )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email Address</span>
                        </label>
                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                            <span className="text-gray-900">{userEmail || 'Not provided'}</span>
                        </div>
                    </div>

                    {/* Current Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Current Address *</span>
                        </label>
                        {isEditable ? (
                            <div>
                                <textarea
                                    {...register('current_address')}
                                    rows={2}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none ${
                                        errors.current_address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your current address"
                                    defaultValue={userProfile?.current_address || ''}
                                />
                                {errors.current_address && (
                                    <p className="text-red-600 text-sm flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.current_address.message}</span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-900">{userProfile?.current_address || 'Not provided'}</span>
                            </div>
                        )}
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Age *</span>
                        </label>
                        {isEditable ? (
                            <div>
                                <input
                                    type="number"
                                    {...register('age')}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                        errors.age ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your age"
                                    defaultValue={userProfile?.age || ''}
                                    min="1"
                                    max="120"
                                />
                                {errors.age && (
                                    <p className="text-red-600 text-sm flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.age.message}</span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-900">{userProfile?.age ? `${userProfile.age} years old` : 'Not provided'}</span>
                            </div>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Gender *</span>
                        </label>
                        {isEditable ? (
                            <div>
                                <select
                                    {...register('gender')}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                        errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    defaultValue={userProfile?.gender || ''}
                                >
                                    <option value="">Select gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-600 text-sm flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.gender.message}</span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-900">
                                    {userProfile?.gender === 'M' ? 'Male' : 
                                     userProfile?.gender === 'F' ? 'Female' : 
                                     userProfile?.gender === 'O' ? 'Other' : 'Not provided'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Organization Name */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>Organization Name</span>
                        </label>
                        {isEditable ? (
                            <div>
                                <input
                                    type="text"
                                    {...register('organization_name')}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                        errors.organization_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    } ${!userProfile?.organization_name ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder={userProfile?.organization_name ? "Enter organization name" : "Not applicable for individual beneficiaries"}
                                    defaultValue={userProfile?.organization_name || ''}
                                    disabled={!userProfile?.organization_name}
                                />
                                {errors.organization_name && (
                                    <p className="text-red-600 text-sm flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.organization_name.message}</span>
                                    </p>
                                )}
                                {!userProfile?.organization_name && (
                                    <p className="text-gray-500 text-xs mt-1">
                                        This field is disabled for individual beneficiaries
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-900">{userProfile?.organization_name || 'Not applicable'}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-xs font-bold">i</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-blue-900 mb-1">
                                {isEditable ? 'Information Update' : 'Information Verification'}
                            </h4>
                            <p className="text-sm text-blue-700">
                                {isEditable 
                                    ? 'Please ensure all your personal information is accurate and up-to-date. This information will be used for event coordination and emergency contacts.'
                                    : 'Please ensure all your personal information is accurate. This information will be used for event coordination and emergency contacts.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryPersonalInfoStep;
