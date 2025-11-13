import React, { useState } from 'react';
import { Award, ExternalLink, FileText, ChevronRight } from 'lucide-react';

const CertificateSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen">
      <div className="flex items-center justify-between px-2 pb-4">
        <h4 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="h-6 w-6 text-blue-600" />
          Certificate
        </h4>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          In Progress
        </span>
      </div>

      <div 
        className={`relative overflow-hidden border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 ${
          isHovered ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-gray-50 shadow-lg transform -translate-y-1' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 transform rotate-12">
            <Award className="h-32 w-32 text-blue-600" />
          </div>
          <div className="absolute bottom-4 left-4 transform -rotate-12">
            <FileText className="h-24 w-24 text-blue-600" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center py-6 px-2">
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full bg-blue-100 transition-all duration-300 ${
              isHovered ? 'bg-blue-200 scale-110' : ''
            }`}>
              <Award className={`h-12 w-12 text-blue-600 transition-all duration-300 ${
                isHovered ? 'text-blue-700' : ''
              }`} />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-gray-700">
                No Certificate Yet
              </h3>
              <p className="text-gray-500 max-w-sm">
                Attend event to earn your certificate.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-6">
        <button className="group flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
          <ExternalLink className="h-4 w-4" />
          <span className="underline">Visit Certificate Page</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
        
        <button className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200">
          <FileText className="h-4 w-4" />
          <span className="underline">View Requirements</span>
        </button>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div>
            <h5 className="font-medium text-blue-900 mb-1">What's Next?</h5>
            <p className="text-sm text-blue-700">
              Complete the remaining modules and pass the final assessment to receive your digital certificate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateSection;