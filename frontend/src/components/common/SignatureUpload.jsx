import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';

const SignatureUpload = ({ 
  onFileSelect, 
  selectedFile, 
  onRemoveFile, 
  preview, 
  error,
  disabled = false,
  existingSignature = null
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputReplaceRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  // Determine what to show - new file, existing signature, or upload area
  const hasFile = selectedFile || (existingSignature && !selectedFile);
  const displayPreview = selectedFile ? preview : existingSignature;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Signature Image
      </label>
      
      {!hasFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <Upload className={`mx-auto h-8 w-8 mb-2 ${
            isDragging ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-semibold text-blue-600 hover:text-blue-700">
                Click to upload signature
              </span>
              <span className="text-gray-600"> or drag and drop</span>
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 5MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </div>
      ) : (
        <div className="relative border border-gray-300 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div 
              className="flex-shrink-0 cursor-pointer"
              onClick={() => !disabled && fileInputReplaceRef.current?.click()}
            >
              {displayPreview ? (
                <img
                  src={displayPreview}
                  alt="Signature preview"
                  className="h-12 w-20 object-contain border border-gray-200 rounded hover:border-blue-300 transition-colors"
                />
              ) : (
                <div className="h-12 w-20 bg-gray-100 border border-gray-200 rounded flex items-center justify-center hover:border-blue-300 transition-colors">
                  <Image className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile ? selectedFile.name : (existingSignature ? 'Current Signature' : 'Signature')}
              </p>
              {selectedFile && (
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
              {existingSignature && !selectedFile && (
                <p className="text-xs text-blue-600">
                  Click signature to replace
                </p>
              )}
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={onRemoveFile}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {/* Hidden file input for signature replacement */}
          <input
            ref={fileInputReplaceRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default SignatureUpload;
