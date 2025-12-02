import React from "react";
import { Upload } from "lucide-react";

const FileUpload = ({ preview, onFileUpload, onRemoveFile, error, disabled = false }) => {
  if (preview) {
    return (
      <div className="relative group">
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <img
            src={preview}
            alt="Student ID Preview"
            className="rounded-lg h-64 w-full object-contain bg-gray-50"
          />
        </div>
        {!disabled && (
          <>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-xl">
              <label className="cursor-pointer text-white text-center">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Click to re-upload</p>
                <p className="text-xs">PNG, JPG (MAX. 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={onRemoveFile}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 transition-colors ${
      disabled 
        ? 'cursor-not-allowed opacity-50' 
        : 'cursor-pointer hover:bg-gray-100'
    }`}>
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={onFileUpload}
        disabled={disabled}
        className="hidden"
      />
    </label>
  );
};

export default FileUpload;
