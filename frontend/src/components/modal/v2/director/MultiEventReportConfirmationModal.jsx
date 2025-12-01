import React from 'react';
import { X, FileText, Calendar, Users, CheckCircle } from 'lucide-react';
import { formatDate } from '../../../../utils/dateUtils.js';

const MultiEventReportConfirmationModal = ({ 
    open, 
    setOpen, 
    groupedByEvent, 
    onConfirm, 
    onConfirmCombined,
    onCancel 
}) => {
    if (!open) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
            if (onCancel) onCancel();
        }
    };

    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    };

    const handleConfirmCombined = () => {
        if (onConfirmCombined) {
            onConfirmCombined();
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
        if (onCancel) onCancel();
    };

    const eventCount = Object.keys(groupedByEvent).length;
    const totalBeneficiaries = Object.values(groupedByEvent).reduce(
        (sum, group) => sum + group.beneficiaries.length, 
        0
    );

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            
            {/* Modal */}
            <div 
                className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden z-10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Generate Multiple Reports</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Beneficiaries are from different events
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
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> You have selected <strong>{totalBeneficiaries}</strong> beneficiary(ies) from <strong>{eventCount}</strong> different event(s). 
                            Choose how you want to generate the report:
                        </p>
                    </div>

                    <div className="mb-6 space-y-3">
                        <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Generate as Whole List</h3>
                                    <p className="text-sm text-gray-600">
                                        Generate a single PDF containing all beneficiaries from all selected events with the title "List of Beneficiaries"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-600 rounded-lg">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Generate Separately</h3>
                                    <p className="text-sm text-gray-600">
                                        Generate separate PDF reports for each event (one PDF per event)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(groupedByEvent).map(([eventId, group], index) => {
                            const event = group.event;
                            const beneficiaries = group.beneficiaries;
                            
                            return (
                                <div key={eventId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {event?.title || 'Unknown Event'}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>{formatDate(event?.event_started)}</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {beneficiaries.length} beneficiary(ies)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 pl-11">
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <p className="text-xs font-medium text-gray-700 mb-2">Beneficiaries:</p>
                                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                                {beneficiaries.map((record, idx) => (
                                                    <div key={record.event_registration_id} className="flex items-center gap-2 text-sm text-gray-700">
                                                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                                        <span>
                                                            {record.beneficiary?.firstname} {record.beneficiary?.lastname}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleConfirmCombined}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Generate All in One Page
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Generate Separately ({eventCount})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiEventReportConfirmationModal;

