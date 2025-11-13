
export const getMessageInfo = (msg) => {
    const lowerMsg = msg.toLowerCase();
    
    if (lowerMsg.includes('not registered')) {
        return {
            type: 'registration',
            icon: 'user-x',
            title: 'Registration Required',
            description: 'You need to be registered for this event to mark attendance.',
            color: 'amber',
            instructions: [
                'Check if you registered for the correct event',
                'Check if the event is not already started yet',
                'Register for the event if you haven\'t already'
            ]
        }
    }
    
    if (lowerMsg.includes('not started') || lowerMsg.includes('wait until')) {
        return {
            type: 'timing',
            icon: 'clock',
            title: 'Event Not Started',
            description: 'The event hasn\'t begun yet. Please wait for the official start time.',
            color: 'blue',
            instructions: [
                'Wait for the event to officially begin',
                'Check the event schedule for the correct start time',
                'Try scanning again once the event starts'
            ]
        }
    }
    
    if (lowerMsg.includes('already done') && lowerMsg.includes('time-in')) {
        return {
            type: 'duplicate',
            icon: 'check-circle',
            title: 'Already Checked In',
            description: 'You have successfully checked in to this event already.',
            color: 'green',
            instructions: [
                'Your attendance has been recorded',
                'No further action needed for check-in',
                'Remember to check out when leaving the event'
            ]
        }
    }
    
    if (lowerMsg.includes('already done') && lowerMsg.includes('time-out')) {
        return {
            type: 'duplicate',
            icon: 'check-circle',
            title: 'Already Checked Out',
            description: 'You have successfully checked out of this event already.',
            color: 'green',
            instructions: [
                'Your attendance has been fully recorded',
                'Thank you for participating in the event',
                'No further action needed'
            ]
        }
    }
    
    if (lowerMsg.includes('qr code cannot be found') || lowerMsg.includes('invalid')) {
        return {
            type: 'qr-error',
            icon: 'alert-triangle',
            title: 'QR Code Issue',
            description: 'There\'s an issue with the QR code you scanned.',
            color: 'red',
            instructions: [
                'Make sure you\'re scanning the correct QR code',
                'Check if the QR code is clear and not damaged',
                'Ask the event staff for assistance'
            ]
        }
    }
    
    return {
        type: 'general',
        icon: 'info',
        title: 'Unable to Process',
        description: 'We couldn\'t process your attendance at this time.',
        color: 'gray',
        instructions: [
            'Please try scanning the QR code again',
            'Contact event staff if the issue persists',
            'Check your internet connection'
        ]
    }
}

export const getColorClasses = (colorName) => {
    const colors = {
        blue: {
            gradient: 'from-blue-500 to-indigo-600',
            bg: 'from-blue-50 to-indigo-50',
            border: 'border-blue-100',
            text: 'text-blue-800',
            button: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        },
        amber: {
            gradient: 'from-amber-500 to-orange-600',
            bg: 'from-amber-50 to-orange-50',
            border: 'border-amber-100',
            text: 'text-amber-800',
            button: 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
        },
        green: {
            gradient: 'from-green-500 to-emerald-600',
            bg: 'from-green-50 to-emerald-50',
            border: 'border-green-100',
            text: 'text-green-800',
            button: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
        },
        red: {
            gradient: 'from-red-500 to-rose-600',
            bg: 'from-red-50 to-rose-50',
            border: 'border-red-100',
            text: 'text-red-800',
            button: 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
        },
        gray: {
            gradient: 'from-gray-500 to-slate-600',
            bg: 'from-gray-50 to-slate-50',
            border: 'border-gray-100',
            text: 'text-gray-800',
            button: 'from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700'
        }
    };
    return colors[colorName] || colors.gray;
}

export const renderIcon = (iconName) => {
    const iconProps = "w-10 h-10 text-white";
    
    switch(iconName) {
        case 'clock':
            return (
                <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'user-x':
            return (
                <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            );
        case 'check-circle':
            return (
                <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'alert-triangle':
            return (
                <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            );
        default:
            return (
                <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
    }
};