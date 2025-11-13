import { CATEGORIES } from "../../../constants/documentSupport.js";
import { AlertCircle } from "lucide-react";

export const CategorySelector = ({ error, selectedValue, ...register }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        What type of documents are these? *
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <label
            key={cat.value}
            className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedValue === cat.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="category"
              value={cat.value}
              {...register}
              className="mt-1"
            />
            <div>
              <div className="font-medium text-gray-900">{cat.label}</div>
              <div className="text-sm text-gray-500">{cat.desc}</div>
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
);