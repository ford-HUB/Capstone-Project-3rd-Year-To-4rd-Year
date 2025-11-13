import { X, Check, FileIcon, AlertCircle } from "lucide-react";

import { formatFileSize } from "../../../utils/formatFileSize";

export const FileItem = ({ file, onRemove }) => (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
        file.error
          ? 'border-red-200 bg-red-50'
          : file.status === 'completed'
          ? 'border-green-200 bg-green-50'
          : file.status === 'uploading'
          ? 'border-blue-200 bg-blue-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center space-x-4">
        <FileIcon className={`h-6 w-6 ${
          file.error
            ? 'text-red-500'
            : file.status === 'completed'
            ? 'text-green-500'
            : file.status === 'uploading'
            ? 'text-blue-500'
            : 'text-gray-500'
        }`} />
        <div>
          <p className="font-medium text-gray-900">{file.name}</p>
          <p className="text-sm text-gray-500">
            {file.type} • {formatFileSize(file.size)}
          </p>
          {file.error && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {file.error}
            </p>
          )}
          {file.status === 'uploading' && (
            <p className="text-sm text-blue-600">Uploading...</p>
          )}
          {file.status === 'completed' && (
            <p className="text-sm text-green-600">✓ Uploaded successfully</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {file.status === 'uploading' && (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
        )}
        {file.status === 'completed' && (
          <Check className="h-5 w-5 text-green-500" />
        )}
        {file.status !== 'uploading' && (
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className="p-1 text-gray-400 hover:text-red-500 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
);