import React from "react";
import { ProgressBar } from "../../components/common/documents/ProgressBar";
import StepOne from "../../components/common/documents/steps/StepOne";
import StepTwo from "../../components/common/documents/steps/StepTwo";
import StepThree from "../../components/common/documents/steps/StepThree";
import { FileList } from "../../components/common/documents/FileList";
import { Navigation } from "../../components/common/documents/Navigation";
import { SUPPORTED_TYPES } from "../../constants/documentSupport.js";
import { validateFile } from "../../utils/validateFile.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { uploadDocumentSchema } from "../../forms/DocumentSchema.js";
import { useDocumentStore } from "../../store/common/useDocumentStore.js";

const DocumentUpload = () => {
    const [files, setFiles] = React.useState([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [currentStep, setCurrentStep] = React.useState(1);
    const [showHelp, setShowHelp] = React.useState(false);
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const { uploadDocs } = useDocumentStore()
    const { handleSubmit, watch, reset, getValues, register, trigger, formState: { errors } } = useForm({
        resolver: zodResolver(uploadDocumentSchema),
        defaultValues: {
            title: '',
            category: '',
            tags: '',
        }
    })

    const [fileErrors, setFileErrors] = React.useState({})

    const fileInputRef = React.useRef(null);
  
    const handleFiles = (fileList) => {
      const newFiles = Array.from(fileList).map(file => {
        const error = validateFile(file, files);
        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
          type: SUPPORTED_TYPES[file.type]?.name || 'Unknown',
          error,
          status: error ? 'error' : 'ready'
        };
      });
  
      setFiles(prev => [...prev, ...newFiles]);
      
      if (newFiles.some(f => !f.error) && currentStep === 1) {
        setTimeout(() => setCurrentStep(2), 500);
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
      handleFiles(e.dataTransfer.files);
    };
  
    const handleFileInput = (e) => {
      handleFiles(e.target.files);
    };
  
    const removeFile = (id) => {
      setFiles(prev => prev.filter(f => f.id !== id));
    };
  
    const validateStep = async (step) => {
        let fieldsToValidate = []

        if(step === 2 || step === 3) {
            fieldsToValidate = ['title', 'category']
        }

        const isValid = await trigger(fieldsToValidate)
        
        const newErrors = [];
        
        if (step === 1 || step === 3) {
            if (files.length === 0) {
            newErrors.files = 'Please select at least one file to upload';
            } else if (files.some(f => f.error)) {
            newErrors.files = 'Please fix the file issues above';
            }
        }

        setFileErrors(newErrors)
    
        return isValid && Object.keys(newErrors).length === 0;
    };
  
    const handleNext = async () => {

        const isStepValid = await validateStep(currentStep)

        if (isStepValid) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };
  
    const handleBack = () => {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    };
  

    const onSubmit = async (data) => {
      if (!validateStep(3)) return;
  
      const validFiles = files.filter(f => !f.error);
      validFiles.forEach(f => {
        f.status = 'uploading';
        setFiles(prev => [...prev]);
      })

      const formData = new FormData()
        formData.append('title', data.title)
        formData.append('category', data.category)
        formData.append('tags', data.tags)
        validFiles.forEach((file) => {
            formData.append('file', file.file)
            console.log(file)
        })

        const success = await uploadDocs(formData)
        if(!success) return validFiles.forEach(f => f.status = 'failed');
        
        validFiles.forEach(f => f.status = 'completed');
        setFiles(prev => [...prev]);

        reset({
            title: '',
            description: '',
            category: '',
            tags: ''
        })
        
        setFiles([]);
        setCurrentStep(1);
    };
  
    const validFilesCount = files.filter(f => !f.error).length;
    const isUploading = files.some(f => f.status === 'uploading');
    const canProceed = currentStep === 1 ? validFilesCount > 0 : true;
  
    return (
      <div className="w-full mx-auto p-6 bg-white min-h-screen">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Upload Your Documents</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your files securely with our simple 3-step process. We'll help you organize and upload your documents.
          </p>
        </div>
  
        <ProgressBar currentStep={currentStep} />
  
        <div className="space-y-6">
          {currentStep === 1 && (
            <StepOne
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileInput}
              errors={{...fileErrors}}
              showHelp={showHelp}
              onToggleHelp={() => setShowHelp(!showHelp)}
              fileInputRef={fileInputRef}
            />
          )}
  
          {currentStep === 2 && (
            <StepTwo
              register={register}
              watcher={watch}
              errors={errors}
              showAdvanced={showAdvanced}
              onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
            />
          )}
  
          {currentStep === 3 && (
            <StepThree getValues={getValues} />
          )}
  
          <FileList files={files} onRemove={removeFile} />
  
          <Navigation
            currentStep={currentStep}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit(onSubmit)}
            canProceed={canProceed}
            isUploading={isUploading}
            validFilesCount={validFilesCount}
          />
        </div>
      </div>
    );
};
  
  export default DocumentUpload;