import { Trash2 } from "lucide-react";
import { FIELD_TYPES } from "../../../../constants/formBuilder.js";
import Button from "../field/Button.jsx";
import FormInput from "../field/FormInput";
import OptionsEditor from "../field/OptionsEditor.jsx";
import NumberValidation from "./NumberValidation.jsx";
import FormCheckBox from "../field/FormCheckBox";

const FieldEditor = ({ field, index, totalFields, onUpdate, onUpdateValidation, onUpdateOption, onRemoveOption, onAddOption, onMove, onRemove }) => {
  const fieldType = FIELD_TYPES.find(ft => ft.type === field.type);
  const Icon = fieldType?.icon || Type;
  const hasOptions = ['select', 'radio'].includes(field.type);
  const hasPlaceholder = !['checkbox', 'radio', 'file'].includes(field.type);
  const hasNumberValidation = field.type === 'number';

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Field Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon size={18} className="mr-2 text-gray-600" />
          <span className="font-medium capitalize">{field.type}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            onClick={() => onMove(field.id, 'up')}
            disabled={index === 0}
            className="!p-1 text-gray-400 hover:text-gray-600"
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            onClick={() => onMove(field.id, 'down')}
            disabled={index === totalFields - 1}
            className="!p-1 text-gray-400 hover:text-gray-600"
          >
            ↓
          </Button>
          <Button
            variant="ghost"
            onClick={() => onRemove(field.id)}
            className="!p-1 text-red-400 hover:text-red-600"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Field Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Label"
          value={field.label}
          onChange={(e) => onUpdate(field.id, 'label', e.target.value)}
        />
        
        {hasPlaceholder && (
          <FormInput
            label="Placeholder"
            value={field.placeholder}
            onChange={(e) => onUpdate(field.id, 'placeholder', e.target.value)}
          />
        )}
      </div>

      <FormInput
        label="Description (Optional)"
        value={field.description}
        onChange={(e) => onUpdate(field.id, 'description', e.target.value)}
        placeholder="Help text for this field..."
        className="mt-4"
      />

      {hasOptions && (
        <OptionsEditor
          field={field}
          onUpdateOption={onUpdateOption}
          onRemoveOption={onRemoveOption}
          onAddOption={onAddOption}
        />
      )}

      {hasNumberValidation && (
        <NumberValidation
          field={field}
          onUpdateValidation={onUpdateValidation}
        />
      )}

      <FormCheckBox
        label="Required field"
        checked={field.required}
        onChange={(e) => onUpdate(field.id, 'required', e.target.checked)}
        className="mt-4"
      />
    </div>
  );
};

export default FieldEditor