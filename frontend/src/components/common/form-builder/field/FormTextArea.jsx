import { INPUT_STYLES } from "../../../../constants/formBuilder.JS";

const FormTextArea = ({ label, value, onChange, placeholder, rows = 3, className = "", ...props }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={INPUT_STYLES}
        {...props}
      />
    </div>
);

export default FormTextArea