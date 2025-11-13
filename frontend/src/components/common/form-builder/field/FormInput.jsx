import { INPUT_STYLES } from "../../../../constants/formBuilder.js";

const FormInput = ({ label, value, onChange, type = "text", placeholder, className = "", ...props }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={INPUT_STYLES}
        {...props}
      />
    </div>
);

export default FormInput