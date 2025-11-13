import { AlertCircle } from "lucide-react";

const DynamicCheckboxField = ({ label, error, required = false, options = [], ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
            {label} {required && '*'}
        </label>

        <div className="space-y-2">
            {options.map((option) => (
                <label key={option} className="flex items-center">
                    <input
                        type="checkbox"
                        value={option}
                        {...props}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                </label>
            ))}
        </div>

        {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
            </p>
        )}
    </div>
);

export default DynamicCheckboxField;
