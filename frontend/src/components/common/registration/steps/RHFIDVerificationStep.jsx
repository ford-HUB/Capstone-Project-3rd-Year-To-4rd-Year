import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import StepHeader from "../StepHeader.jsx";
import InfoBox from "../InfoBox.jsx";
import FileUpload from "../FileUpload.jsx";

const RHFIDVerificationStep = ({ 
  register, 
  errors, 
  watch, 
  preview, 
  onFileUpload, 
  onRemoveFile, 
  isProcessingOCR 
}) => {
  const isBeneficiary = watch('isBeneficiary') === 'true';

  if (isBeneficiary) {
    return (
      <div className="space-y-6">
        <StepHeader title="Registration Complete" description="You're all set to join our community!" />
        
        <InfoBox type="success" title="Beneficiary Registration:">
          <p>As a beneficiary volunteer, you don't need to upload a student ID. You can now participate in community programs and receive assistance.</p>
        </InfoBox>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepHeader title="ID Verification" description="Upload a clear photo of your student ID" />
      
      <div className="space-y-4">
        <FileUpload
          preview={preview}
          onFileUpload={onFileUpload}
          onRemoveFile={() => onRemoveFile()}
          error={errors.studentIdFile}
          disabled={isProcessingOCR}
        />
        
        {isProcessingOCR && (
          <div className="flex items-center space-x-2 text-blue-600 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing ID image and extracting text...</span>
          </div>
        )}
        
        {errors.studentIdFile && (
          <div className="flex items-center space-x-1 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.studentIdFile.message}</span>
          </div>
        )}
      </div>
      
      <InfoBox type="success" title="ID Verification Process:">
        <ul className="space-y-1">
          <li>• We'll automatically extract text from your ID using OCR technology</li>
          <li>• Your name on the ID must match the information you provided</li>
          <li>• Ensure all text on your ID is clearly readable</li>
          <li>• Take the photo in good lighting and avoid shadows or glare</li>
        </ul>
      </InfoBox>
    </div>
  );
};

export default RHFIDVerificationStep;