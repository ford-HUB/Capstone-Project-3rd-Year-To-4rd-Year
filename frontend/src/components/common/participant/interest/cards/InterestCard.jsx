import React from "react";
import { CheckCircle2 } from "lucide-react";

const InterestCard = ({ interest, isSelected, onToggle }) => (
    <button
      onClick={() => onToggle(interest)}
      className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-md ${
        isSelected
          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{interest.icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">{interest.name}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{interest.description}</p>
          </div>
        </div>
        {isSelected && (
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
        )}
      </div>
      {isSelected && (
        <div className="flex items-center text-green-600 text-sm font-medium">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          Selected
        </div>
      )}
    </button>
);

export default InterestCard