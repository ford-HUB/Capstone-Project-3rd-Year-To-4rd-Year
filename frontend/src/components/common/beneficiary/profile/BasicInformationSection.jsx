import React from "react";
import FormField from "./fields/FormField";
const BasicInformationSection = ({ register, errors }) => (
    <div className="mb-8 space-y-3.5">
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Basic Information</h2>
            <p className="text-sm text-gray-600 mb-4">
                Please ensure all information is accurate and properly formatted. Use proper capitalization for names and provide complete details.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                    {...register('firstname')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                    {...register('lastname')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Initial</label>
                <input
                    {...register('middle_initial')}
                    type="text"
                    maxLength="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.middle_initial && <p className="text-red-500 text-sm mt-1">{errors.middle_initial.message}</p>}
            </div>
        
        </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        {...register('gender')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        defaultValue=""
                    >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                        {...register('age', { valueAsNumber: true })}
                        type="number"
                        min="1"
                        max="120"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                </div>
            </div>

        <div>
                <FormField
                    label={'Current Address'}
                    error={errors?.current_address?.message}>
                    <textarea
                        {...register('current_address')}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Please provide your complete address including street number, street name, barangay, city/municipality, and province. Example: "123 Main Street, Barangay Basak, Lapu-Lapu City, Cebu"
                    </p>
                </FormField>
        </div>
    </div>
);

export default BasicInformationSection;