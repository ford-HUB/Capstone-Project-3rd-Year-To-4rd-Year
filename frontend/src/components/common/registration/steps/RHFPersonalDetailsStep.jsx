import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import RHFInputField from '../RHFInputField.jsx';
import RHFSelectField from '../RHFSelectField.jsx';
import StepHeader from '../StepHeader.jsx';

const RHFPersonalDetailsStep = ({ register, errors }) => (
    <div className="space-y-6">
        <StepHeader
            title="Personal Details"
            description="Tell us about yourself"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RHFInputField
                label="First Name"
                name="firstName"
                register={register}
                error={errors.firstName}
                placeholder="One"
                required
            />

            <RHFInputField
                label="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName}
                placeholder="Dev"
                required
            />

            <RHFInputField
                label="Middle Initial"
                name="middleName"
                register={register}
                error={errors.middleName}
                placeholder="M"
                maxLength="1"
                required
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFInputField
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                register={register}
                error={errors.phoneNumber}
                placeholder="0912 345 6789"
                icon={Phone}
                required
                maxLength="11"
                pattern="[0-9]{11}"
            />

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label
                        htmlFor='age'
                        className="block text-sm font-medium text-gray-700">
                        Age
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <div className="relative">
                        <input
                            id="age"
                            type="number"
                            placeholder="18"
                            {...register('age', { 
                                valueAsNumber: true,
                                setValueAs: value => (value === '' ? undefined : Number(value))
                              })}
                            maxLength={60}
                            min={16}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                            ${
                                errors.age
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />

                    </div>

                    {errors.age && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.age.message}
                        </p>
                    )}
                </div>
                {/* <RHFInputField
          label="Age"
          type="number"
          name="age"
          register={register}
          error={errors.age}
          placeholder="18"
          min={16}
          max={60}
          required
        /> */}

                <RHFSelectField
                    label="Gender"
                    name="gender"
                    register={register}
                    error={errors.gender}
                    placeholder="Select Gender"
                    options={[
                        { value: 'M', label: 'Male' },
                        { value: 'F', label: 'Female' },
                    ]}
                    required
                />
            </div>
        </div>

        <RHFInputField
            label="Current Address"
            name="currentAddress"
            register={register}
            error={errors.currentAddress}
            placeholder="123 Main Street, City, Province"
            icon={MapPin}
            required
        />
    </div>
);

export default RHFPersonalDetailsStep;
