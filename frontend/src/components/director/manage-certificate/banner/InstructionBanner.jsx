import React from 'react';
import { Info } from "lucide-react";

const InstructionsBanner = ({ showInstructions, onShowInstructions }) => {
  if (showInstructions) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">Need help assigning templates?</span>
        </div>
        <button
          onClick={onShowInstructions}
          className="text-blue-600 hover:text-blue-800 font-medium underline"
        >
          View Instructions
        </button>
      </div>
    </div>
  );
};

export default InstructionsBanner;