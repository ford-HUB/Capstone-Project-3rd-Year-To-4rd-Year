import React from "react";
import StepHeader from "../StepHeader.jsx";
import InfoBox from "../InfoBox.jsx";
import InputField from "../InputField.jsx";

const VolunteerTypeStep = ({ formData, errors, onInputChange }) => (
  <div className="space-y-6">
    <StepHeader title="Volunteer Type" description="Choose your volunteer role" />
    
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <input
            type="radio"
            id="regular-volunteer"
            name="isBeneficiary"
            checked={!formData.isBeneficiary}
            onChange={() => onInputChange('isBeneficiary', false)}
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
            name="isBeneficiary"
            checked={formData.isBeneficiary}
            onChange={() => onInputChange('isBeneficiary', true)}
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
    
    {/* Organization Name Field - Only show for beneficiaries */}
    {formData.isBeneficiary && (
      <div className="mt-6">
        <InputField
          label="Organization Name"
          value={formData.organization_name || ''}
          onChange={(value) => onInputChange('organization_name', value)}
          error={errors.organization_name}
          placeholder="Enter your organization name (e.g., Barangay Health Center, Local NGO)"
          required
        />
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

export default VolunteerTypeStep;
