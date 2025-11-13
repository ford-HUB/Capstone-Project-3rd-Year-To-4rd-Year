import React, { useState } from 'react';
import { Shield, AlertCircle, Upload, X, Eye } from 'lucide-react';

const BeneficiaryVerificationStep = ({ focusRef, register, errors, userProfile, shouldShowErrors = false, setValue, watch }) => {
    const [previewImages, setPreviewImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [hasRestored, setHasRestored] = useState(false);
    
    // Get current form values to restore preview images
    const formValues = watch();
    
    // Restore preview images from form values when component mounts
    React.useEffect(() => {
        if (formValues.id_files && formValues.id_files.length > 0 && !hasRestored) {
            const files = Array.from(formValues.id_files);
            const restoredPreviews = files.map((file, index) => ({
                id: Date.now() + index,
                file: file,
                preview: URL.createObjectURL(file),
                name: file.name
            }));
            setPreviewImages(restoredPreviews);
            setHasRestored(true);
        }
    }, [formValues.id_files, hasRestored]);
    
    // Cleanup object URLs when component unmounts
    React.useEffect(() => {
        return () => {
            previewImages.forEach(image => {
                if (image.preview && image.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(image.preview);
                }
            });
        };
    }, [previewImages]);

    const handleFileChange = (e) => {
        setHasInteracted(true);
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newPreviews = [];
            let loadedCount = 0;
            
            files.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    newPreviews.push({
                        id: Date.now() + index,
                        file: file,
                        preview: event.target.result,
                        name: file.name
                    });
                    loadedCount++;
                    
                    if (loadedCount === files.length) {
                        setPreviewImages(prev => {
                            const updated = [...prev, ...newPreviews];
                            // Update the form field with all files using setValue
                            const allFiles = updated.map(img => img.file);
                            const fileList = new DataTransfer();
                            allFiles.forEach(file => fileList.items.add(file));
                            
                            
                            // Use setValue to update the form field
                            if (setValue) {
                                setValue('id_files', fileList.files);
                            }
                            
                            return updated;
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setHasInteracted(true);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            const newPreviews = [];
            let loadedCount = 0;
            
            files.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    newPreviews.push({
                        id: Date.now() + index,
                        file: file,
                        preview: event.target.result,
                        name: file.name
                    });
                    loadedCount++;
                    
                    if (loadedCount === files.length) {
                        setPreviewImages(prev => {
                            const updated = [...prev, ...newPreviews];
                            // Update the form field with all files using setValue
                            const allFiles = updated.map(img => img.file);
                            const fileList = new DataTransfer();
                            allFiles.forEach(file => fileList.items.add(file));
                            
                            // Use setValue to update the form field
                            if (setValue) {
                                setValue('id_files', fileList.files);
                            }
                            
                            return updated;
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (imageId) => {
        setPreviewImages(prev => {
            const updated = prev.filter(img => img.id !== imageId);
            // Update the form field with remaining files using setValue
            const remainingFiles = updated.map(img => img.file);
            const fileList = new DataTransfer();
            remainingFiles.forEach(file => fileList.items.add(file));
            
            // Use setValue to update the form field
            if (setValue) {
                setValue('id_files', fileList.files);
            }
            
            return updated;
        });
    };

    const removeAllImages = () => {
        setPreviewImages([]);
        // Reset the form field using setValue
        if (setValue) {
            setValue('id_files', new DataTransfer().files);
        }
    };


    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    ID Verification
                </h2>
                <p className="text-gray-600 text-sm">
                    Please provide a valid government-issued ID for verification purposes
                </p>
            </div>

            <div className="space-y-6">
                {/* ID Photo Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Upload className="w-4 h-4 text-purple-600" />
                        <span>Upload Photos of Your Valid ID(s)</span>
                    </label>
                    
                    {previewImages.length === 0 ? (
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragActive 
                                    ? 'border-purple-500 bg-purple-50' 
                                    : errors.id_files && shouldShowErrors
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300 hover:border-purple-400'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => setHasInteracted(true)}
                        >
                            <input
                                {...register('id_files')}
                                type="file"
                                id="id_files"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileChange}
                                multiple
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, WebP up to 5MB each • Multiple files allowed
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Uploaded Images Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {previewImages.map((image) => (
                                    <div key={image.id} className="relative border border-gray-300 rounded-lg p-3">
                                        <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-2">
                                            <img
                                                src={image.preview}
                                                alt="ID Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 truncate mb-2">{image.name}</p>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Open image in new tab for full view
                                                    window.open(image.preview, '_blank');
                                                }}
                                                className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                                title="View full size"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(image.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Remove image"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Add More Button */}
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setHasInteracted(true);
                                        const fileInput = document.getElementById('id_files');
                                        if (fileInput) {
                                            // Clear the current selection to allow new files
                                            fileInput.value = '';
                                            fileInput.click();
                                        }
                                    }}
                                    className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                                >
                                    + Add More IDs
                                </button>
                            </div>
                            
                            {/* Hidden file input for adding more */}
                            <input
                                {...register('id_files')}
                                type="file"
                                id="id_files"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileChange}
                                multiple
                                className="hidden"
                            />
                        </div>
                    )}
                    
                    {errors.id_files && shouldShowErrors && (
                        <p className="text-red-600 text-sm flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.id_files.message}</span>
                        </p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                        Please upload a clear photo of your valid, up-to-date government-issued ID. Ensure all text is readable and the ID is not expired. This helps us verify your citizenship and identity.
                    </p>
                </div>

                {/* Information Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-900 mb-1">
                                Privacy & Security
                            </h4>
                            <p className="text-sm text-blue-700">
                                Your ID information is used solely for verification purposes and is handled securely. 
                                We do not store or share your personal identification details with third parties.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryVerificationStep;
