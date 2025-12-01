import React from "react";
import { AlertCircle } from "lucide-react";
import RHFSelectField from "../RHFSelectField.jsx";
import StepHeader from "../StepHeader.jsx";
import InfoBox from "../InfoBox.jsx";
import { getAllGraduatedYears } from "../../../../services/common/departmentService.js";

const RHFAcademicInfoStep = ({ register, errors, watch, setValue, departmentCourses }) => {
  const department = watch('department');
  const participantType = watch('participantType');
  const isSeniorHighDepartment = watch('department') === 'Senior High Department';
  const isStaffOrFaculty = participantType === 'staff' || participantType === 'faculty';
  const isAlumni = participantType === 'alumni';
  
  const [graduatedYears, setGraduatedYears] = React.useState([]);
  const [loadingGraduatedYears, setLoadingGraduatedYears] = React.useState(false);

  // Fetch graduated years when component mounts or when alumni is selected
  React.useEffect(() => {
    if (isAlumni) {
      const fetchGraduatedYears = async () => {
        setLoadingGraduatedYears(true);
        try {
          const response = await getAllGraduatedYears();
          if (response.success && response.data) {
            setGraduatedYears(response.data);
          }
        } catch (error) {
          console.error('Error fetching graduated years:', error);
        } finally {
          setLoadingGraduatedYears(false);
        }
      };
      fetchGraduatedYears();
    }
  }, [isAlumni]);

  // Reset course when department changes
  React.useEffect(() => {
    if (department) {
      setValue('course', '');
    }
  }, [department, setValue]);

  // Clear course and yearLevel when staff or faculty is selected
  React.useEffect(() => {
    if (isStaffOrFaculty) {
      setValue('course', '');
      setValue('yearLevel', undefined);
    }
  }, [isStaffOrFaculty, setValue]);

  // Clear yearLevel and set graduatedYear when alumni is selected, or vice versa
  React.useEffect(() => {
    if (isAlumni) {
      setValue('yearLevel', undefined);
    } else if (participantType && participantType !== 'alumni' && participantType !== 'staff' && participantType !== 'faculty') {
      setValue('graduatedYear', undefined);
    }
  }, [isAlumni, participantType, setValue]);

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
          label={isStaffOrFaculty ? "Course (Not Applicable)" : (isSeniorHighDepartment ? "Strand" : "Course")}
          name="course"
          register={register}
          error={errors.course}
          placeholder={isStaffOrFaculty ? "Not Applicable" : "Select your course"}
          options={(departmentCourses[department] || []).map(course => ({ value: course, label: course }))}
          required={!isStaffOrFaculty}
          disabled={isStaffOrFaculty}
        />
        
        {isAlumni ? (
          <RHFSelectField
            label="Graduated Year"
            name="graduatedYear"
            register={register}
            error={errors.graduatedYear}
            placeholder={loadingGraduatedYears ? "Loading..." : "Select your graduated year"}
            options={graduatedYears.map(gy => {
              // Format the year display - if it's a single year, convert to "YYYY-YYYY" format
              // If it's already in "YYYY-YYYY" format, use it as-is
              let displayYear = gy.year?.toString() || '';
              
              // If it's a single year (4 digits), convert to academic year format
              if (displayYear && /^\d{4}$/.test(displayYear)) {
                const year = parseInt(displayYear);
                displayYear = `${year}-${year + 1}`;
              }
              
              // If empty or invalid, use fallback
              if (!displayYear) {
                displayYear = `Year ${gy.gy_id}`;
              }
              
              return {
                value: gy.gy_id.toString(),
                label: displayYear
              };
            })}
            required
            disabled={loadingGraduatedYears}
          />
        ) : (
          <RHFSelectField
            label={isStaffOrFaculty ? "Year Level (Not Applicable)" : (isSeniorHighDepartment ? "Grade Level" : "Year Level")}
            name="yearLevel"
            register={register}
            error={errors.yearLevel}
            placeholder={isStaffOrFaculty ? "Not Applicable" : `Select your ${isSeniorHighDepartment ? `grade level` : `year level`}`}
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
            required={!isStaffOrFaculty}
            disabled={isStaffOrFaculty}
          />
        )}
      </div>
      
      <InfoBox type="warning" title="Important Note:" icon={AlertCircle}>
        {isStaffOrFaculty ? (
          <p>Make sure your department information is accurate. Course and year level are not applicable for staff and faculty members.</p>
        ) : isAlumni ? (
          <p>Make sure your department, course, and graduated year information is accurate. This will be verified in the next step.</p>
        ) : (
          <p>Make sure your department and course information matches exactly with your student ID. This will be verified in the next step.</p>
        )}
      </InfoBox>
    </div>
  );
};

export default RHFAcademicInfoStep;