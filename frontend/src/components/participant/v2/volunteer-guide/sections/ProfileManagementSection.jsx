import React from 'react';
import { User, Settings, Bell, Calendar, Award, FileText, Download, CheckCircle } from 'lucide-react';

const ProfileManagementSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Profile & Settings</h3>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 text-indigo-600 mr-2" />
              Profile Information
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-1">Personal Details</h5>
                <p className="text-sm text-gray-600">Keep your contact information and bio up to date</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-1">Profile Photo</h5>
                <p className="text-sm text-gray-600">Upload a professional photo for your profile</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-1">Interests & Skills</h5>
                <p className="text-sm text-gray-600">Update your interests to get better event recommendations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 text-gray-600 mr-2" />
              Account Settings
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Change password and security settings</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Manage notification preferences</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Set availability and scheduling preferences</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 text-amber-600 mr-2" />
              Volunteer Statistics
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Events Completed</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-1">Achievement Badges</h5>
                <p className="text-sm text-gray-600">Earn badges for milestones and special contributions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 text-purple-600 mr-2" />
              Document Management
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Upload required documents</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Download className="w-4 h-4 text-blue-500" />
                <span>Download certificates and records</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Track document approval status</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagementSection;
