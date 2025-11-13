import React from 'react';
import { Award, Download, Share2, FileText, Star, CheckCircle } from 'lucide-react';

const CertificatesSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-white">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Certificates & Recognition</h3>
            <p className="text-gray-600">Earn and manage your volunteer certificates</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 text-amber-600 mr-2" />
              Earning Certificates
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-amber-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Event Completion</h5>
                <p className="text-sm text-gray-600">Complete full event participation to earn certificates</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Attendance Requirements</h5>
                <p className="text-sm text-gray-600">Must check in and out properly for certificate eligibility</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Automatic Generation</h5>
                <p className="text-sm text-gray-600">Certificates are automatically generated after event completion</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Download className="w-5 h-5 text-blue-600 mr-2" />
              Certificate Management
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Download className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Download certificates as PDF or PNG</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Share2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Share on social media (manual upload)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">View certificate details and verification</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">How to share without a share button</h5>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>Open your certificate and choose Download (PNG recommended for social).</li>
                <li>Go to your social platform (e.g., Facebook, Instagram, LinkedIn).</li>
                <li>Create a new post and upload the downloaded PNG/PDF.</li>
                <li>Add your caption and publish.</li>
              </ol>
              <p className="text-xs text-gray-500 mt-2">Note: The system currently has no built‑in social share button.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-600 mr-2" />
              Certificate Types
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-medium text-yellow-800 mb-1">Participation Certificate</h5>
                <p className="text-sm text-yellow-700">Awarded for completing individual events</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-1">Appreciation Certificate</h5>
                <p className="text-sm text-blue-700">Recognizes outstanding volunteer contributions</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-1">Hours Milestone</h5>
                <p className="text-sm text-green-700">Celebrates reaching volunteer hour milestones</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Certificate Verification
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Each certificate has a unique verification code</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Digital signatures ensure authenticity</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Certificates are stored permanently in your profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesSection;
