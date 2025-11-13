import React from 'react';
import { CheckCircle, QrCode, Clock, AlertCircle, Award, FileText } from 'lucide-react';

const AttendanceTrackingSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Attendance & Tracking</h3>
            <p className="text-gray-600">How to check in and track your volunteer hours</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <QrCode className="w-5 h-5 text-blue-600 mr-2" />
              QR Code Check-in
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Step 1: Access Scanner</h5>
                <p className="text-sm text-gray-600">Navigate to "Scan QR Attendance" in the main menu</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Step 2: Scan QR Code</h5>
                <p className="text-sm text-gray-600">Point your camera at the event QR code</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Step 3: Confirm Attendance</h5>
                <p className="text-sm text-gray-600">Verify your details and confirm check-in</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 text-green-600 mr-2" />
              Time Tracking
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Automatic time calculation</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-5 h-5 text-blue-600">ℹ</div>
                <span className="text-sm text-gray-700">Hours tracked from check-in to check-out</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">Accumulated hours visible in profile</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
              Troubleshooting
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <h5 className="font-medium text-amber-800 mb-1">QR Code Not Scanning</h5>
                <p className="text-sm text-amber-700">Ensure good lighting and steady camera positioning</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h5 className="font-medium text-red-800 mb-1">Check-in Failed</h5>
                <p className="text-sm text-red-700">Contact event coordinator immediately</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-1">Missing Hours</h5>
                <p className="text-sm text-blue-700">Check with coordinator to verify attendance</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 text-indigo-600 mr-2" />
              Attendance Records
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>View attendance history in your profile</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Download attendance certificates</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Track total volunteer hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTrackingSection;
