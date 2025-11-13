
const Button = ({ 
    children, 
    onClick, 
    disabled, 
    variant = 'primary', 
    size = 'md', 
    className = '',
    'aria-label': ariaLabel,
    ...props 
}) => {
    const baseClasses = 'font-medium rounded-md focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2';
    
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50',
        secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
    };
    
    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-3 py-3 sm:py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            style={{ touchAction: 'manipulation' }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button