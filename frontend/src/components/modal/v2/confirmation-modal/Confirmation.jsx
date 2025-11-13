import React from "react";
import { X } from "lucide-react";
import { TYPES, COLORS } from "../../../../constants/ConfirmationModalUtils.js";
import ActionButtons from "./ActionButton.jsx";

const Confirmation = ({
    open,
    setOpen,
    onConfirm,
    type = 'DELETE',
    userData,
    isLoading = false,
}) => {

    const config = TYPES[type];
    const colors = COLORS[config?.color.trim().toLowerCase()];
    const Icon = config?.icon;
    const [reason, setReason] = React.useState('');

    React.useEffect(() => {
        if (!open) {
            setReason('')
        }
    }, [open])

    const handleConfirm = () => {
        console.log('on confirm in confirmation modal is working')
        onConfirm({ action: type, userData: userData, reason: reason?.trim() });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <div
                            className={`p-3 rounded-full ${colors.bg} ${colors.border} border`}>
                            <Icon className={`w-5 h-5 ${colors.icon}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {config.title}
                            </h3>
                            <div className="space-y-1">
                                {userData.name && (
                                    <p className="text-sm text-gray-600 truncate">
                                        <span className="font-medium text-gray-900">
                                            "{userData.name}"
                                        </span>
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">
                                    {config.message}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {config?.requiresReason && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder={`Please provide a reason to ${config.action.toLowerCase()} this account...`}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                            />
                            <p className="mt-1 text-xs text-gray-500">This reason will be emailed to the user.</p>
                        </div>
                    )}

                    <ActionButtons
                        onCancel={() => setOpen(false)}
                        onConfirm={handleConfirm}
                        config={config}
                        colors={colors}
                        loading={isLoading}
                        disabled={config?.requiresReason && reason.trim().length === 0}
                    />
                </div>
            </div>
        </div>
    );
};

export default Confirmation
