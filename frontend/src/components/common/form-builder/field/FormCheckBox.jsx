
const FormCheckBox = ({ label, checked, onChange, className = "" }) => (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
);

export default FormCheckBox
