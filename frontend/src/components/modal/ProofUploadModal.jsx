import React, { useState, useRef } from 'react';
import { X, Upload, Image, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProofUploadModal = ({ 
    isOpen, 
    onClose, 
    event, 
    onUploadNow, 
    loading = false 
}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleClose = () => {
        setSelectedFiles([]);
        onClose();
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
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        const fileArray = Array.from(files);
        const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length !== fileArray.length) {
            toast.error('Please select only image files');
            return;
        }

        if (imageFiles.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        // Check file size (max 5MB per file)
        const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('File size should not exceed 5MB');
            return;
        }

        setSelectedFiles(prev => [...prev, ...imageFiles].slice(0, 5));
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadNow = () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select at least one image');
            return;
        }
        onUploadNow(selectedFiles);
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Upload className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Upload Event Proof
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Upload photos and your completed evaluation proof (received via Gmail)
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={loading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Event Info */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                            {event?.title?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase() || 'EV'}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">{event?.title}</h3>
                            <p className="text-sm text-gray-600">
                                {event?.date} • {event?.location}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div className="p-6">
                    <div className="space-y-4">
                        {/* Drag and Drop Area */}
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                dragActive 
                                    ? 'border-blue-400 bg-blue-50' 
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileInput}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            
                            <div className="space-y-3">
                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                    <Image className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-gray-900">
                                        Drop images here or click to browse
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        PNG, JPG, JPEG up to 5MB each (max 5 images)
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Choose Files
                                </button>
                            </div>
                        </div>

                        {/* Selected Files Preview */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-900">
                                    Selected Images ({selectedFiles.length}/5)
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            <div className="mt-1 text-xs text-gray-500 truncate">
                                                {file.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Guidelines */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Upload Guidelines:</p>
                                    <ul className="space-y-1 text-blue-700">
                                        <li>• Photos should clearly show your participation in the event</li>
                                        <li>• Include images of you at the event venue or during activities</li>
                                        <li>• Ensure good lighting and clear visibility</li>
                                        <li>• <strong>Upload your completed evaluation proof</strong> that you received via Gmail</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUploadNow}
                            disabled={loading || selectedFiles.length === 0}
                            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Upload Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProofUploadModal;
