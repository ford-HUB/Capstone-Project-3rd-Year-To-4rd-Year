import React from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';

const CertificateRequirementIndicator = ({ 
    status, 
    proofUploaded, 
    proofUploadedAt, 
    proofImages, 
    eventId, 
    onUploadClick 
}) => {
    const getStatusIcon = () => {
        if (proofUploaded) {
            return <CheckCircle className="w-5 h-5 text-green-600" />;
        } else {
            return <AlertCircle className="w-5 h-5 text-blue-600" />;
        }
    };

    const getStatusColor = () => {
        if (proofUploaded) {
            return 'bg-green-100 text-green-800 border-green-200';
        } else {
            return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const downloadFile = (imageUrl, index) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `proof_${index + 1}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {getStatusIcon()}
                    <div>
                        <h3 className="font-semibold text-gray-900">Certificate Requirements</h3>
                        <p className="text-sm text-gray-600">Status: {status}</p>
                    </div>
                </div>
                
                {!proofUploaded && (
                    <button
                        onClick={onUploadClick}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        <span>Upload Proof</span>
                    </button>
                )}
            </div>

            {proofUploaded ? (
                <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">
                                Certificate requirements completed!
                            </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                            You have successfully uploaded your proof of participation.
                        </p>
                    </div>

                    {proofImages && proofImages.length > 0 && (
                        <div>
                            <h5 className="font-medium text-gray-900 mb-2">Uploaded Proof Files:</h5>
                            <div className="space-y-2">
                                {proofImages.map((imageUrl, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">
                                                Proof Image {index + 1}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => downloadFile(imageUrl, index)}
                                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {proofUploadedAt && (
                        <div className="text-xs text-gray-500">
                            <p>Uploaded: {new Date(proofUploadedAt).toLocaleString()}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Main Instruction Alert */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-blue-900 mb-2">
                                    📜 Certificate Requirements
                                </h4>
                                <p className="text-sm text-blue-800 mb-3">
                                    <strong>To receive your volunteer certificate, you must upload proof of your participation in this event.</strong>
                                </p>
                                <div className="bg-white/50 rounded-lg p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium">
                                        💡 <strong>Important:</strong> Your certificate will only be generated after you upload the required proof documents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step-by-step Instructions */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                            <span>Upload Your Proof</span>
                        </h5>
                        <div className="ml-8 space-y-2">
                            <p className="text-sm text-gray-700">
                                Click the "Upload Proof" button below to upload evidence of your participation.
                            </p>
                        </div>
                    </div>

                    {/* Requirements Checklist */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                            <span>What You Need to Upload</span>
                        </h5>
                        <div className="ml-8 space-y-2">
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Photos from the event</strong> - Show yourself participating</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Documents</strong> - Any certificates, forms, or receipts from the event</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Clear and legible</strong> - Make sure text and images are readable</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Maximum 5 files</strong> - You can upload up to 5 images or PDFs</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* What Happens Next */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                            <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                            <span>What Happens Next?</span>
                        </h5>
                        <div className="ml-8 space-y-1 text-sm text-yellow-800">
                            <p>• Your proof will be reviewed by our team</p>
                            <p>• Once approved, your certificate will be generated</p>
                            <p>• You'll receive a notification when your certificate is ready</p>
                            <p>• You can download your certificate from your profile</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateRequirementIndicator;
