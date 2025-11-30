import React from 'react';
import { X, Mail, Phone, Shield, Building, Calendar, User, Image, FileText, GraduationCap, IdCard } from 'lucide-react';

const UserInfoModal = ({ open, setOpen, userData }) => {
    if (!open || !userData) return null;


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-bold text-xl">
                                    {userData.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                                <p className="text-gray-600">{userData.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            userData.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : userData.status === 'deactivated' 
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                        }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                userData.status === 'active'
                                    ? 'bg-green-500'
                                    : userData.status === 'deactivated'
                                        ? 'bg-amber-500'
                                        : 'bg-red-500'
                            }`}></div>
                            {userData.status}
                        </span>
                    </div>

                    {/* User Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Basic Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-gray-900">{userData.email}</p>
                                    </div>
                                </div>
                                {userData.phone && userData.phone !== 'No phone' && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="text-gray-900">{userData.phone}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            userData.role === 'Coordinator' || userData.role === 'Event Coordinator' || userData.role === 'Director'
                                                ? 'bg-purple-100 text-purple-800'
                                            : userData.role === 'Admin'
                                                ? 'bg-red-100 text-red-800'
                                            : userData.role === 'Beneficiary'
                                                ? 'bg-orange-100 text-orange-800'
                                            : userData.role === 'Donor'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {userData.role}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Beneficiary-specific fields */}
                                {userData.type === 'beneficiary' && userData.details && (
                                    <>
                                        {userData.details.age && (
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Age</p>
                                                    <p className="text-gray-900">{userData.details.age} years old</p>
                                                </div>
                                            </div>
                                        )}
                                        {userData.details.gender && (
                                            <div className="flex items-center gap-3">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Gender</p>
                                                    <p className="text-gray-900">{userData.details.gender === 'M' ? 'Male' : userData.details.gender === 'F' ? 'Female' : userData.details.gender}</p>
                                                </div>
                                            </div>
                                        )}
                                        {userData.details.current_address && (
                                            <div className="flex items-center gap-3">
                                                <Building className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Address</p>
                                                    <p className="text-gray-900">{userData.details.current_address}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {/* Donor-specific fields */}
                                {userData.type === 'donor' && userData.details && (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Verification Status</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    userData.details.is_verified
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {userData.details.is_verified ? 'Verified' : 'Not Verified'}
                                                </span>
                                            </div>
                                        </div>
                                        {userData.details.auth_provider && (
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Auth Provider</p>
                                                    <p className="text-gray-900 capitalize">{userData.details.auth_provider}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {/* School ID for campus users */}
                                {(userData.type === 'student' || userData.type === 'staff' || userData.type === 'faculty' || userData.type === 'alumni') && userData.details?.school_number && (
                                    <div className="flex items-center gap-3">
                                        <GraduationCap className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">School ID</p>
                                            <p className="text-gray-900 font-mono">{userData.details.school_number}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Department/Organization Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                {userData.type === 'beneficiary' ? 'Organization Information' : 'Department Information'}
                            </h3>
                            <div className="space-y-3">
                                {userData.type === 'beneficiary' ? (
                                    <>
                                        {userData.details?.organization_name ? (
                                            <div className="flex items-center gap-3">
                                                <Building className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Organization</p>
                                                    <p className="text-gray-900">{userData.details.organization_name}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Building className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Organization</p>
                                                    <p className="text-gray-500 italic">Individual Beneficiary</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Building className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Department</p>
                                            <p className="text-gray-900">{userData.department || 'No department'}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">User ID</p>
                                        <p className="text-gray-900 font-mono text-sm">{userData.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Image Section */}
                    {userData.details?.profile_image && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Image className="w-4 h-4" />
                                Profile Image
                            </h4>
                            <div className="flex justify-center">
                                <img 
                                    src={userData.details.profile_image} 
                                    alt="Profile" 
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-32 h-32 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                                    No Image
                                </div>
                            </div>
                        </div>
                    )}

                    {userData.details?.school_image_id && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <IdCard className="w-4 h-4" />
                                Valid ID
                            </h4>
                            <div className="flex justify-center">
                                <div 
                                    className="relative border border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                                    onClick={() => window.open(userData.details.school_image_id, '_blank')}
                                    title="Click to view full size"
                                >
                                    <img 
                                        src={userData.details.school_image_id} 
                                        alt="Valid ID" 
                                        className="max-w-full h-auto max-h-64 object-contain bg-white"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '';
                                            e.target.style.display = 'none';
                                            const errorDiv = e.target.parentElement.nextSibling;
                                            if (errorDiv) {
                                                errorDiv.style.display = 'flex';
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                        <span className="text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-1 rounded">
                                            Click to view full size
                                        </span>
                                    </div>
                                </div>
                                <div className="max-w-full h-64 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                                    No Valid ID Image
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Signature Section for Staff and Coordinators */}
                    {(userData.type === 'staff' || userData.type === 'coordinator') && userData.details?.signature_img && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Digital Signature
                            </h4>
                            <div className="flex justify-center">
                                <img 
                                    src={userData.details.signature_img} 
                                    alt="Signature" 
                                    className="h-16 object-contain rounded border border-gray-200 bg-white p-2"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="h-16 bg-gray-200 rounded border border-gray-200 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                                    No Signature
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Status Details */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Account Status Details</h4>
                        <div className="text-sm text-gray-600">
                            {userData.status === 'active' && (
                                <p>This account is currently active and can access all system features.</p>
                            )}
                            {userData.status === 'deactivated' && (
                                <p>This account has been temporarily deactivated. The user cannot log in or access system features.</p>
                            )}
                            {userData.status === 'deleted' && (
                                <p>This account has been soft deleted and is no longer accessible.</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoModal;
