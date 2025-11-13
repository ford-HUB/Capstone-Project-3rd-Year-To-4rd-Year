import { Trash2 } from "lucide-react";
import Button from "./Button.jsx";
import { INPUT_STYLES } from "../../../../constants/formBuilder.js";

const OptionsEditor = ({ field, onUpdateOption, onRemoveOption, onAddOption }) => (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
      <div className="space-y-2">
        {field.options?.map((option, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input
              type="text"
              value={option}
              onChange={(e) => onUpdateOption(field.id, idx, e.target.value)}
              className={INPUT_STYLES}
            />
            <Button
              variant="ghost"
              onClick={() => onRemoveOption(field.id, idx)}
              disabled={field.options.length <= 2}
              className="!p-2 text-red-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        <button
          onClick={() => onAddOption(field.id)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Add Option
        </button>
      </div>
    </div>
);

export default OptionsEditor