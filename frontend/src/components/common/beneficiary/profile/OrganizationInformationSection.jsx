import React from "react";

const OrganizationInformationSection = ({ register, errors }) => (
    <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Organization Information</h2>
        <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name (Optional)</label>
                <input
                    {...register('organization_name')}
                    type="text"
                    placeholder="Leave empty if you are an individual beneficiary"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.organization_name && <p className="text-red-500 text-sm mt-1">{errors.organization_name.message}</p>}
                <p className="text-xs text-gray-500 mt-1">If you represent an organization, enter the organization name here</p>
            </div>
        </div>
    </div>
);

export default OrganizationInformationSection;


