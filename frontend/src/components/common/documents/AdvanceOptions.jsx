import { Eye, EyeOff } from "lucide-react";

import { InputField } from "./InputField";

export const AdvancedOptions = ({ showAdvanced, onToggle, ...props}) => (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
      >
        {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        <span>{showAdvanced ? 'Hide' : 'Show'} advanced options</span>
      </button>
      
      {showAdvanced && (
        <div className="mt-4 space-y-4">
          <InputField
            id="tags"
            name="tags"
            label="Tags (optional)"
            {...props}
            placeholder="Add tags separated by commas (e.g., urgent, Q4, finance)"
          />
        </div>
      )}
    </div>
);