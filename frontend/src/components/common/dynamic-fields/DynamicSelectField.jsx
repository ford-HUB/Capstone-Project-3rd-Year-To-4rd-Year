import { AlertCircle } from "lucide-react";

const DynamicSelectField = ({ label, error, placeholder, required = false, options = [], ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && '*'}
        </label>
        <select
            {...props}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
        >
            <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
        {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
            </p>
        )}
    </div>
);

export default DynamicSelectField;
