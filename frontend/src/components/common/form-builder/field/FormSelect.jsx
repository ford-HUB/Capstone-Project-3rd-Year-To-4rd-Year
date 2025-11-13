import { INPUT_STYLES } from '../../../../constants/formBuilder';

const FormSelect = ({
    label,
    value,
    onChange,
    placeholder,
    options = [],
    className = '',
    ...props
}) => {
    const handleChange = (e) => {
        const selectedId = e.target.value;
        if (selectedId === '') {
            onChange(null);
        } else {
            const selectedOption = options.find(opt => opt.id.toString() === selectedId);
            onChange(selectedOption);
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <select
                value={value?.id || ''}
                onChange={handleChange}
                className={INPUT_STYLES}
                {...props}>
                {placeholder && <option value="" disabled className='bg-gray-100'>{placeholder}</option>}

                {options.map((option) => (
                    <option
                        key={option.id}
                        value={option.id}>
                        {option.value}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormSelect;
