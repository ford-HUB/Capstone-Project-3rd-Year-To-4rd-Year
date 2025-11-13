import React from 'react';
import FormField from '../../../common/participant/profile/fields/FormField';
import TextInput from '../../../common/participant/profile/fields/TextInput';

const PersonalInfoStep = ({ formData, handleInputChange, errors }) => {
  const fields = [
    { name: 'firstName', label: 'First Name', required: true },
    { name: 'lastName', label: 'Last Name', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <FormField 
            key={field.name}
            label={field.label} 
            required={field.required} 
            error={errors?.[field.name]}
          >
            <TextInput
              name={field.name}
              type={field.type || 'text'}
              value={formData[field.name]}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors[field.name] ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </FormField>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfoStep;
