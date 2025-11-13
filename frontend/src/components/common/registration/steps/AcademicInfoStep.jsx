import React from "react";
import { AlertCircle } from "lucide-react";
import SelectField from "../SelectField.jsx";
import StepHeader from "../StepHeader.jsx";
import InfoBox from "../InfoBox.jsx";

const AcademicInfoStep = ({ formData, errors, departmentCourses, onInputChange }) => (
  <div className="space-y-6">
    <StepHeader title="Academic Information" description="Your course and department details" />
    
    <SelectField
      label="Department"
      value={formData.department}
      onChange={(value) => {
        onInputChange('department', value);
        onInputChange('course', ''); // Reset course when department changes
      }}
      error={errors.department}
      placeholder="Select your department"
      options={Object.keys(departmentCourses)}
      required
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SelectField
        label="Course"
        value={formData.course}
        onChange={(value) => onInputChange('course', value)}
        error={errors.course}
        placeholder="Select your course"
        options={departmentCourses[formData.department] || []}
        disabled={!formData.department}
        required
      />
      
      <SelectField
        label="Year Level"
        value={formData.yearLevel}
        onChange={(value) => onInputChange('yearLevel', value)}
        error={errors.yearLevel}
        placeholder="Select year level"
        options={[
          { value: "1", label: "1st Year" },
          { value: "2", label: "2nd Year" },
          { value: "3", label: "3rd Year" },
          { value: "4", label: "4th Year" }
        ]}
        required
      />
    </div>
    
    <InfoBox type="warning" title="Important Note:" icon={AlertCircle}>
      <p>Make sure your department and course information matches exactly with your student ID. This will be verified in the next step.</p>
    </InfoBox>
  </div>
);

export default AcademicInfoStep;
