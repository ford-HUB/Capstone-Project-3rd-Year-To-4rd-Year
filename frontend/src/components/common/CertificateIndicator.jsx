import React from 'react';
import { Award } from 'lucide-react';

const CertificateIndicator = ({ type, title, progress }) => {
    return (
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center">
          <Award className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">{type}</div>
          <div className="text-sm font-medium text-gray-900 mb-2">
            {title}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className={`h-full bg-green-500 rounded`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    );
};

export default CertificateIndicator;