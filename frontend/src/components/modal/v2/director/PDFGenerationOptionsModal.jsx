import React from 'react';
import { X, FileText, Calendar, Users } from 'lucide-react';

const PDFGenerationOptionsModal = ({ 
    open, 
    setOpen, 
    selectedCount,
    onSelectPerEvent,
    onSelectBeneficiaryList,
    onCancel 
}) => {
    if (!open) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
            if (onCancel) onCancel();
        }
    };

    const handlePerEvent = () => {
        if (onSelectPerEvent) {
            onSelectPerEvent();
        }
        setOpen(false);
    };

    const handleBeneficiaryList = () => {
        if (onSelectBeneficiaryList) {
            onSelectBeneficiaryList();
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
        if (onCancel) onCancel();
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            
            {/* Modal */}
            <div 
                className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Generate PDF Report</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Choose the type of report you want to generate
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> You have selected <strong>{selectedCount}</strong> beneficiary(ies). 
                            Please choose how you want to generate the report:
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Option 1: Per Event */}
                        <button
                            onClick={handlePerEvent}
                            className="w-full p-5 border-2 border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all text-left"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-600 rounded-lg flex-shrink-0">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Per Event</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Generate PDF reports for beneficiaries registered per event. Each event will have its own separate PDF document with event details and beneficiary information.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Best for: Event-specific reports with event details and beneficiary registrations
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Option 2: Beneficiary List Info */}
                        <button
                            onClick={handleBeneficiaryList}
                            className="w-full p-5 border-2 border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all text-left"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-600 rounded-lg flex-shrink-0">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Beneficiary List Info</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Generate a single PDF document containing all selected beneficiaries' personal information only. This will create one comprehensive list with all beneficiary details on a single page.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Best for: Complete beneficiary directory with personal information
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PDFGenerationOptionsModal;

