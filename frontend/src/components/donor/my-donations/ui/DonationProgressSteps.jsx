import React from 'react';
import { 
    CheckCircle,
    Clock,
    Award,
    Users
} from 'lucide-react';

// Get progress steps configuration
export const getProgressSteps = () => {
    // Color-coded steps per app design
    return [
        { key: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" />, bg: 'bg-gray-600', border: 'border-gray-600' },
        { key: 'received', label: 'Received', icon: <CheckCircle className="w-4 h-4" />, bg: 'bg-blue-600', border: 'border-blue-600' },
        { key: 'distribution', label: 'Distribution', icon: <Users className="w-4 h-4" />, bg: 'bg-yellow-500', border: 'border-yellow-500' },
        { key: 'complete', label: 'Complete', icon: <Award className="w-4 h-4" />, bg: 'bg-green-600', border: 'border-green-600' }
    ];
};

// Get current progress index based on status
export const getCurrentProgressIndex = (statusRaw, eventStatusRaw) => {
    const steps = getProgressSteps();
    const normalize = (s) => (s || '').toString().toLowerCase();
    const status = normalize(statusRaw);
    const eventStatus = normalize(eventStatusRaw);

    // Direct status mappings
    if (['complete', 'completed', 'verified'].includes(status)) return 3;
    if (['distribution', 'in_distribution', 'distributing', 'distributed'].includes(status)) return 2;
    if (['received'].includes(status)) return 1;
    if (['paid'].includes(status)) return 1;

    // Event-driven progression
    if (['ongoing', 'starting', 'started'].includes(eventStatus)) return 2;
    if (['completed', 'finished', 'ended'].includes(eventStatus)) return 3;

    // Default
    if (['pending'].includes(status)) return 0;
    // If unknown, fall back to first step
    return 0;
};

// Get the current status label that matches the progress tracker
export const getCurrentStatusLabel = (statusRaw, eventStatusRaw) => {
    const steps = getProgressSteps();
    const currentIndex = getCurrentProgressIndex(statusRaw, eventStatusRaw);
    return steps[currentIndex]?.label || 'Pending';
};

// DonationProgressSteps Component
const DonationProgressSteps = ({ status, eventStatus }) => {
    const effectiveStatus = status || 'pending';
    const effectiveEventStatus = eventStatus || '';
    const steps = getProgressSteps();
    const current = getCurrentProgressIndex(effectiveStatus, effectiveEventStatus);

    return (
        <div className="flex items-center justify-center">
            {steps.map((step, index) => {
                const isCompleted = index <= current;
                const isLast = index === steps.length - 1;
                const circleCls = isCompleted
                    ? `${step.bg} ${step.border} text-white`
                    : `bg-white border ${step.border} text-gray-500`;
                const lineCls = index < current ? step.bg : 'bg-gray-200';
                return (
                    <div key={step.key} className="flex items-center">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full ${circleCls}`}>
                            {step.icon}
                        </div>
                        <div className={`ml-2 mr-3 text-xs font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.label}
                        </div>
                        {!isLast && (
                            <div className={`h-[2px] w-10 md:w-16 ${lineCls}`}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DonationProgressSteps;
