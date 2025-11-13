import React from "react";
import { Phone, MapPin } from "lucide-react";
import InputField from "../InputField.jsx";
import SelectField from "../SelectField.jsx";
import StepHeader from "../StepHeader.jsx";

const PersonalDetailsStep = ({ formData, errors, onInputChange }) => (
  <div className="space-y-6">
    <StepHeader title="Personal Details" description="Tell us about yourself" />
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InputField
        label="First Name"
        value={formData.firstName}
        onChange={(value) => onInputChange('firstName', value)}
        error={errors.firstName}
        placeholder="One"
        required
      />
      
      <InputField
        label="Last Name"
        value={formData.lastName}
        onChange={(value) => onInputChange('lastName', value)}
        error={errors.lastName}
        placeholder="Dev"
        required
      />
      
      <InputField
        label="Middle Initial"
        value={formData.middleName}
        onChange={(value) => onInputChange('middleName', value)}
        error={errors.middleName}
        placeholder="M"
        maxLength="1"
      />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Phone Number"
        type="tel"
        value={formData.phoneNumber}
        onChange={(value) => onInputChange('phoneNumber', value)}
        error={errors.phoneNumber}
        placeholder="0912 345 6789"
        icon={Phone}
        required
        maxLength="11"
        pattern="[0-9]{11}"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Age"
          type="number"
          value={formData.age}
          onChange={(value) => onInputChange('age', value)}
          error={errors.age}
          placeholder="18"
          min="16"
          max="60"
        />
        
        <SelectField
          label="Gender"
          value={formData.gender}
          onChange={(value) => onInputChange('gender', value)}
          error={errors.gender}
          placeholder="Select Gender"
          options={[
            { value: "M", label: "Male" },
            { value: "F", label: "Female" }
          ]}
        />
      </div>
    </div>
    
    <InputField
      label="Current Address"
      value={formData.currentAddress}
      onChange={(value) => onInputChange('currentAddress', value)}
      error={errors.currentAddress}
      placeholder="123 Main Street, City, Province"
      icon={MapPin}
      required
    />
  </div>
);

export default PersonalDetailsStep;
