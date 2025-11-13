import React from "react";
import { User, Mail } from "lucide-react";
import InputField from "../InputField.jsx";
import PasswordField from "../PasswordField.jsx";
import StepHeader from "../StepHeader.jsx";
import InfoBox from "../InfoBox.jsx";

const AccountInfoStep = ({ 
  formData, 
  errors, 
  showPassword, 
  showConfirmPassword, 
  setShowPassword, 
  setShowConfirmPassword, 
  onInputChange 
}) => (
  <div className="space-y-6">
    <StepHeader title="Account Information" description="Create your login credentials" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Student ID Number"
        value={formData.studentId}
        onChange={(value) => onInputChange('studentId', value)}
        error={errors.studentId}
        placeholder={formData.isBeneficiary ? "Not required for beneficiaries" : "Enter your student ID"}
        icon={User}
        required={!formData.isBeneficiary}
        disabled={formData.isBeneficiary}
      />
      
      <InputField
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(value) => onInputChange('email', value)}
        error={errors.email}
        placeholder="student@university.edu"
        icon={Mail}
        required
      />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PasswordField
        label="Password"
        value={formData.password}
        onChange={(value) => onInputChange('password', value)}
        error={errors.password}
        placeholder="Create a strong password"
        required
        showPassword={showPassword}
        togglePassword={() => setShowPassword(!showPassword)}
      />
      
      <PasswordField
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={(value) => onInputChange('confirmPassword', value)}
        error={errors.confirmPassword}
        placeholder="Confirm your password"
        required
        showPassword={showConfirmPassword}
        togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />
    </div>
    
    <InfoBox type="info" title="Password Requirements:">
      <ul className="space-y-1">
        <li>• At least 8 characters long</li>
        <li>• Include uppercase and lowercase letters</li>
        <li>• Include at least one number</li>
      </ul>
    </InfoBox>
  </div>
);

export default AccountInfoStep;
