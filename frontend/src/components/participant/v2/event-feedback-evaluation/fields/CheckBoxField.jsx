
const CheckboxField = ({ label, ...props }) => (
    <label className="flex items-start">
      <input
        type="checkbox"
        {...props}
        className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
);

export default CheckboxField