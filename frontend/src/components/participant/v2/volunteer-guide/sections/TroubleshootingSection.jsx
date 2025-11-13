import React from 'react';
import { HelpCircle, AlertCircle, Phone, Mail, ExternalLink, Info, Bell } from 'lucide-react';

const TroubleshootingSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Help & Support</h3>
            <p className="text-gray-600">Get assistance when you need it</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              Common Issues
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h5 className="font-medium text-red-800 mb-1">Can't Register for Events</h5>
                <p className="text-sm text-red-700">Check if event is full or registration period has ended</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <h5 className="font-medium text-amber-800 mb-1">QR Code Not Working</h5>
                <p className="text-sm text-amber-700">Ensure good lighting and try refreshing the scanner</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-1">Missing Certificates</h5>
                <p className="text-sm text-blue-700">Verify attendance was properly recorded</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 text-green-600 mr-2" />
              Contact Support
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Phone Support</p>
                  <p className="text-sm text-gray-600">+63 (XXX) XXX-XXXX</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-600">support@uclmcares.edu.ph</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <ExternalLink className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Help Center</p>
                  <p className="text-sm text-gray-600">Visit our online help center</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              FAQ
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-1">How do I update my profile?</h5>
                <p className="text-sm text-gray-600">Go to your profile settings and click "Edit Profile"</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-1">When will I receive my certificate?</h5>
                <p className="text-sm text-gray-600">Certificates are generated automatically after event completion</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-1">Can I cancel my registration?</h5>
                <p className="text-sm text-gray-600">Yes, you can cancel up to 24 hours before the event</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 text-indigo-600 mr-2" />
              System Status
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System is operational</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All features available</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time updates active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingSection;
