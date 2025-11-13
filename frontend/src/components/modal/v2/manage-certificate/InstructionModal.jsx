import React from 'react';
import InstructionStep from '../../../director/manage-certificate/ui/InstructionStep';
import { X, Search, Users, Check } from "lucide-react";


const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">How to Assign Certificate Templates</h2>
            <button onClick={onClose} className="text-blue-100 hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <InstructionStep
              icon={<Search className="h-5 w-5 text-blue-600" />}
              title="Step 1: Browse & Select Template"
              description="Use the search bar and filters to find the perfect template. Click on any template to select it for assignment."
              bgColor="bg-blue-100"
            />

            <InstructionStep
              icon={<Users className="h-5 w-5 text-green-600" />}
              title="Step 2: Choose Category"
              description="Select which certificate category this template will be used for (completion, participation, achievement, etc.)."
              bgColor="bg-green-100"
            />

            <InstructionStep
              icon={<Check className="h-5 w-5 text-purple-600" />}
              title="Step 3: Confirm Assignment"
              description="Review your selection and confirm to apply the template to the chosen category."
              bgColor="bg-purple-100"
            />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips:</h4>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Different templates can be assigned to different certificate categories</li>
                <li>• Preview templates before selecting to ensure they meet your needs</li>
                <li>• Templates automatically populate with participant and event data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal