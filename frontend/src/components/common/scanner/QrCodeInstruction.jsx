import { Smartphone, Lightbulb, Camera, Eye, CheckCircle } from 'lucide-react';

const QrCodeInstruction = () => {
    const steps = [
        {
            icon: <Smartphone className="w-5 h-5" />,
            title: 'Position your phone',
            description: 'Center the QR code within the camera frame',
        },
        {
            icon: <Lightbulb className="w-5 h-5" />,
            title: 'Check lighting',
            description: 'Ensure good lighting and clean camera lens',
        },
        {
            icon: <Camera className="w-5 h-5" />,
            title: 'Use back camera',
            description: 'Rear camera scans faster and more accurately',
        },
        {
            icon: <Eye className="w-5 h-5" />,
            title: 'Wait for detection',
            description: 'Scanner will automatically process the code',
        },
        {
            icon: <CheckCircle className="w-5 h-5" />,
            title: 'Review results',
            description: 'Check content before taking any action',
        },
    ];

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 text-center">
                    How to Scan a QR Code
                </h2>
            </div>

            {/* Steps */}
            <div className="p-6">
                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex items-start space-x-4 group">
                            {/* Step Number */}
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                    {index + 1}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0 pt-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="text-gray-400">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-base font-medium text-gray-900">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Tips */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                    Having trouble? Try different angles, improve lighting, or
                    clean your lens
                </p>
            </div>
        </div>
    );
}

export default QrCodeInstruction
