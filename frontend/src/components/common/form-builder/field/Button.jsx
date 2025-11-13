import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "../../../../constants/formBuilder.js";


const Button = ({ variant = "primary", children, onClick, disabled = false, className = "", ...props }) => {
    const baseClasses = "flex items-center font-medium transition-colors";
    const variantClasses = {
      primary: BUTTON_PRIMARY,
      secondary: BUTTON_SECONDARY,
      danger: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700",
      ghost: "px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
    };
  
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        {...props}
      >
        {children}
      </button>
    );
};

export default Button