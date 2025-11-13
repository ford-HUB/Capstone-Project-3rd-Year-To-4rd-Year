import { Upload } from "lucide-react";
import { INPUT_STYLES } from "../../../../constants/formBuilder.js";

const PreviewField = ({ field }) => {
    const commonProps = {
      placeholder: field.placeholder,
      required: field.required,
      className: INPUT_STYLES
    };
  
    const renderField = () => {
      switch (field.type) {
        case 'textarea':
          return <textarea {...commonProps} rows="4" />;
        case 'select':
          return (
            <select {...commonProps}>
              <option value="">Choose an option</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          );
        case 'checkbox':
          return (
            <div className="flex items-start">
              <input type="checkbox" className="mt-1 mr-3" />
              <span>{field.label}</span>
            </div>
          );
        case 'radio':
          return (
            <div className="space-y-3">
              {field.options?.map((option, idx) => (
                <label key={idx} className="flex items-center">
                  <input type="radio" name={`field-${field.id}`} value={option} className="mr-3" />
                  {option}
                </label>
              ))}
            </div>
          );
        case 'file':
          return (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            </div>
          );
        case 'number':
          return (
            <input 
              type="number" 
              {...commonProps}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          );
        default:
          return <input type={field.type} {...commonProps} />;
      }
    };
  
    return (
      <div className="space-y-2">
        {field.type !== 'checkbox' && (
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {field.description && (
          <p className="text-sm text-gray-500">{field.description}</p>
        )}
        {renderField()}
      </div>
    );
};

export default PreviewField