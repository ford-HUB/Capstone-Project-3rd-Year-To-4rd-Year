import { Check } from "lucide-react";

export const StepIndicator = ({ step, title, completed, active }) => (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        completed ? 'bg-green-500 text-white' :
        active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        {completed ? <Check className="w-4 h-4" /> : step}
      </div>
      <span className={`ml-2 text-sm font-medium ${
        active ? 'text-blue-600' : completed ? 'text-green-600' : 'text-gray-500'
      }`}>
        {title}
      </span>
    </div>
);