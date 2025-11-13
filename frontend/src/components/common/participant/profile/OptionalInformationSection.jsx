import React from "react";
import FormField from "./fields/FormField";
import Select from "./fields/Select";

const OptionalInformationSection = ({ register, watch }) => {
    const [isAgreeToAdd, setIsAgreeToAdd] = React.useState(false);
    const genderOptions = [
      { value: 'M', label: 'Male' },
      { value: 'F', label: 'Female' },
      { value: 'prefer not to say', label: 'Non-binary' }
    ]
  
    const disabilityOptions = [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]

    const disabilityValue = watch('disability');
    const showDisabilitySpecification = disabilityValue === 'Yes';
  
    return (
      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-4">
          Providing additional personal information is optional but helps us provide a more personalized experience.
        </p>
        <div className="mb-6 flex items-center space-x-3">
          <input
            type="checkbox"
            id='additional info'
            value={isAgreeToAdd} 
            onChange={(e) => setIsAgreeToAdd(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"/>
            <label htmlFor='additional info' className="flex-1 text-sm text-gray-700">
                I agree to provide more information about myself.
            </label>
        </div>
  
        <div className={`grid ${ !isAgreeToAdd ? 'bg-gray-100 cursor-not-allowed': '' } transition-all duration-300 p-3 grid-cols-1 md:grid-cols-2 gap-6`}>
                <FormField
                    label="Gender"
                    helpText="Gender is used for impact reporting, in support of education research, and to award top instructors."
                >
                    <Select
                    disabled={!isAgreeToAdd}
                    {...register('gender')}
                    options={genderOptions}
                    />
                </FormField>
                <FormField
                    label="Disability"
                    helpText="Disability information is used for impact reporting purposes only and is not associated with your account."
                >
                    <Select
                    disabled={!isAgreeToAdd}
                    {...register('disability')}
                    options={disabilityOptions}
                    />
                </FormField>
                
                {showDisabilitySpecification && (
                    <FormField
                        label="Please specify your disability"
                        helpText="This information helps us provide better accommodations and support."
                    >
                        <textarea
                            disabled={!isAgreeToAdd}
                            {...register('disability_specification')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            rows={3}
                            placeholder="Please describe your disability or specific needs..."
                        />
                    </FormField>
                )}
            </div>
      </div>
    );
};

export default OptionalInformationSection;