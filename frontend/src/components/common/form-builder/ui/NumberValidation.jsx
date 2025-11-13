import FormInput from "../field/FormInput";

const NumberValidation = ({ field, onUpdateValidation }) => (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <FormInput
        label="Min Value"
        type="number"
        value={field.validation?.min || ''}
        onChange={(e) => onUpdateValidation(field.id, 'min', e.target.value)}
      />
      <FormInput
        label="Max Value"
        type="number"
        value={field.validation?.max || ''}
        onChange={(e) => onUpdateValidation(field.id, 'max', e.target.value)}
      />
    </div>
);

export default NumberValidation