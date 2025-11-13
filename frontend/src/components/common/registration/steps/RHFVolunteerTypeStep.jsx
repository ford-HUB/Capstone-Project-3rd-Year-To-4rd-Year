import React from "react";
import StepHeader from "../StepHeader.jsx";
import InfoBox from "../InfoBox.jsx";
import RHFInputField from "../RHFInputField.jsx";

const RHFVolunteerTypeStep = ({ register, watch, errors }) => {
  const isBeneficiary = watch('isBeneficiary') === 'true';
  const beneficiaryType = watch('beneficiaryType');

  return (
    <div className="space-y-6">
      <StepHeader title="Volunteer Type" description="Choose your volunteer role" />
      
      
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <input
              type="radio"
              id="regular-volunteer"
              value="false"
              {...register('isBeneficiary')}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="flex-1">
              <label htmlFor="regular-volunteer" className="text-sm font-medium text-gray-900 cursor-pointer">
                Regular Volunteer
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I want to volunteer for community service events and activities. I will need to upload my student ID for verification.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <input
              type="radio"
              id="beneficiary-volunteer"
              value="true"
              {...register('isBeneficiary')}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="flex-1">
              <label htmlFor="beneficiary-volunteer" className="text-sm font-medium text-gray-900 cursor-pointer">
                Beneficiary Volunteer
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I am a beneficiary who wants to participate in community programs and receive assistance. No student ID upload required.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Beneficiary Type Selection - Only show for beneficiaries */}
      {isBeneficiary && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Beneficiary Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  id="individual-beneficiary"
                  value="individual"
                  {...register('beneficiaryType')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="flex-1">
                  <label htmlFor="individual-beneficiary" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Individual
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    I am registering as an individual beneficiary
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  id="organization-beneficiary"
                  value="organization"
                  {...register('beneficiaryType')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="flex-1">
                  <label htmlFor="organization-beneficiary" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Organization
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    I am registering on behalf of an organization
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Show error message if beneficiary type is not selected */}
          {isBeneficiary && !beneficiaryType && (
            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p>Please select whether you are registering as an individual or on behalf of an organization.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Organization Name Field - Only show for organization beneficiaries */}
      {isBeneficiary && beneficiaryType === 'organization' && (
        <div className="mt-6">
          <RHFInputField
            label="Organization Name"
            name="organization_name"
            register={register}
            error={errors.organization_name}
            placeholder="Enter your organization name (e.g., Barangay Health Center, Local NGO)"
            required
          />
          
          {/* Show warning if organization name is required but not provided */}
          {isBeneficiary && beneficiaryType === 'organization' && !watch('organization_name')?.trim() && (
            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
              <p>Organization name is required when registering on behalf of an organization.</p>
            </div>
          )}
        </div>
      )}
      
      <InfoBox type="info" title="Volunteer Types:">
        <ul className="space-y-1">
          <li>• <strong>Regular Volunteer:</strong> Students who volunteer for community service</li>
          <li>• <strong>Beneficiary Volunteer:</strong> Community members who receive assistance and may also volunteer</li>
        </ul>
      </InfoBox>
    </div>
  );
};

export default RHFVolunteerTypeStep;