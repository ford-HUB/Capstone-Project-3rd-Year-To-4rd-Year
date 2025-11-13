import { HelpCircle } from 'lucide-react';
import { SUPPORTED_TYPES } from '../../../constants/documentSupport.js';

export const HelpSection = ({ showHelp, onToggle }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 text-blue-700 font-medium"
      >
        <HelpCircle className="h-4 w-4" />
        <span>What file types can I upload?</span>
      </button>
      {showHelp && (
        <div className="mt-3 text-sm text-blue-600 grid grid-cols-2 gap-2">
          {Object.values(SUPPORTED_TYPES).map((type, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="font-medium">{type.name}</span>
              <span>{type.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
);