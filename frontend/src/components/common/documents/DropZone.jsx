import { Upload } from 'lucide-react';


export const DropZone = ({ isDragging, onDragOver, onDragLeave, onDrop, onFileSelect, hasError, fileInputRef }) => (
    <div
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
        isDragging
          ? 'border-blue-500 bg-blue-50 scale-105'
          : hasError
          ? 'border-red-300 bg-red-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Upload className={`mx-auto h-16 w-16 mb-4 ${
        isDragging ? 'text-blue-500' : 'text-gray-400'
      }`} />
      <div className="space-y-2">
        <p className="text-lg">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="font-semibold text-blue-600 hover:text-blue-700 underline"
          >
            Click to choose files
          </button>
          <span className="text-gray-600"> or drag them here</span>
        </p>
        <p className="text-sm text-gray-500">
          We support PDF, Word, Excel, PowerPoint, and text files up to 10MB each
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf"
        onChange={onFileSelect}
        className="hidden"
      />
    </div>
);