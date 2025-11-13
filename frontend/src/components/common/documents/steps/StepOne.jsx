import { ErrorMessage } from "../ErrorMessage";
import { HelpSection } from "../HelpSection";
import { DropZone } from "../DropZone";

const StepOne = ({ isDragging, onDragOver, onDragLeave, onDrop, onFileSelect, errors, showHelp, onToggleHelp, fileInputRef }) => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">What files would you like to upload?</h2>
        <p className="text-gray-600">Drag and drop your files here, or click to browse</p>
      </div>
  
      <DropZone
        isDragging={isDragging}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onFileSelect={onFileSelect}
        hasError={!!errors.files}
        fileInputRef={fileInputRef}
      />
  
      {errors.files && <ErrorMessage message={errors.files} />}
      
      <HelpSection showHelp={showHelp} onToggle={onToggleHelp} />
    </div>
);

export default StepOne