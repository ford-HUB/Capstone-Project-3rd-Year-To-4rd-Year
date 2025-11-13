import React from "react";
import { AlertCircle } from "lucide-react";
import RHFSelectField from "../RHFSelectField.jsx";
import StepHeader from "../StepHeader.jsx";
import InfoBox from "../InfoBox.jsx";

const RHFAcademicInfoStep = ({ register, errors, watch, setValue, departmentCourses }) => {
  const department = watch('department');
  const isSeniorHighDepartment = watch('department') === 'Senior High Department'

  // Reset course when department changes
  React.useEffect(() => {
    if (department) {
      setValue('course', '');
    }
  }, [department, setValue]);

  return (
    <div className="space-y-6">
      <StepHeader title="Academic Information" description="Your course and department details" />
      
      <RHFSelectField
        label="Department"
        name="department"
        register={register}
        error={errors.department}
        placeholder="Select your department"
        options={Object.keys(departmentCourses).map(dept => ({ value: dept, label: dept }))}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RHFSelectField
          label= { isSeniorHighDepartment ? "Strand" : "Course"}
          name="course"
          register={register}
          error={errors.course}
          placeholder="Select your course"
          options={(departmentCourses[department] || []).map(course => ({ value: course, label: course }))}
          required
        />
        
        <RHFSelectField
          label={ isSeniorHighDepartment ? "Grade Level" : "Year Level" }
          name="yearLevel"
          register={register}
          error={errors.yearLevel}
          placeholder={ `Select your ${isSeniorHighDepartment ? `grade level` : `year level`}` }
          options={ isSeniorHighDepartment ? [
            { value: "11", label: "Grade 11" },
            { value: "12", label: "Grade 12" },
          ] 
            : [
            { value: "1", label: "1st Year" },
            { value: "2", label: "2nd Year" },
            { value: "3", label: "3rd Year" },
            { value: "4", label: "4th Year" }
          ] }
          required
        />
      </div>
      
      <InfoBox type="warning" title="Important Note:" icon={AlertCircle}>
        <p>Make sure your department and course information matches exactly with your student ID. This will be verified in the next step.</p>
      </InfoBox>
    </div>
  );
};

export default RHFAcademicInfoStep;