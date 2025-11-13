import React, { useState } from 'react';
import { X, Download, Eye } from 'lucide-react';

const CertificateDetailsModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                CCNA: Switching, Routing, and Wireless Essentials
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Certificate Icon and Title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-16 border-2 border-green-300 rounded-lg flex items-center justify-center bg-green-50 flex-shrink-0">
                  <svg 
                    className="w-12 h-10 text-green-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <rect x="4" y="4" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M6 10L8 12L10 10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <line x1="12" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="12" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="12" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="12" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 12L7 16L8 15L9 16L8 12Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    CCNAv7: Switching, Routing, and Wireless Essentials
                  </h3>
                  <p className="text-gray-600">--</p>
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Issued Date
                  </h4>
                  <p className="text-lg font-semibold text-gray-900">Jan 21, 2025</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Instructor
                  </h4>
                  <p className="text-lg font-semibold text-gray-900">Analou Cag-ong</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Total Hours
                  </h4>
                  <p className="text-lg font-semibold text-gray-900">--</p>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Skills You Learn
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    CCNA: Switching, Routing, and Wireless Essentials
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                  <Eye className="w-4 h-4 mr-2" />
                  <Download className="w-4 h-4 mr-2" />
                  View & Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateDetailsModal;