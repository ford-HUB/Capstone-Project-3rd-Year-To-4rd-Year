
const FieldTypeButton = ({ fieldType, onAdd }) => {
    const Icon = fieldType.icon;
    return (
      <button
        onClick={() => onAdd(fieldType.type)}
        className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Icon size={18} className="mr-3 text-gray-600" />
        <span className="font-medium">{fieldType.label}</span>
      </button>
    );
};

export default FieldTypeButton