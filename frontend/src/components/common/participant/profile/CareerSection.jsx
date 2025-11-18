import React from "react";
import Section from "./Section";
import FormField from "./fields/FormField";
import Select from "./fields/Select";
import { useDepartment } from "../../../../context/useDepartmentContext";

const CareerSection = ({ watch, register, errors }) => {
    const { departmentCourses } = useDepartment()

    const selectedDepartment = watch('department')
    const courseValue = watch('course')
    const yearLevelValue = watch('year_level')
    const isSeniorHighDepartment = selectedDepartment === 'Senior High Department'

    const isCourseEmpty = !courseValue || courseValue === ''
    const isYearLevelEmpty = yearLevelValue === undefined

    const YearOptions = isSeniorHighDepartment ? [
      { value: 11, label: 'Grade 11' },
      { value: 12, label: 'Grade 12' }
    ] : [
      { value: 1, label: '1st Year' },
      { value: 2, label: '2nd Year' },
      { value: 3, label: '3rd Year' },
      { value: 4, label: '4th Year' }
    ];
  
    return (
      <Section title="Education" helpIcon>
        <div className="space-y-6">
            <FormField label="School ID Number">
        
            </FormField>
            <div className="grid sm:grid-cols-3 md:grid-cols-3 gap-6">
                <FormField label="Department" error={errors?.department?.message}>
                <select
                    name="department"
                    {...register('department')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">{'Department'}</option>
                    {Object.keys(departmentCourses).map((department) => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                </select>
                </FormField>

                <FormField label={isSeniorHighDepartment ? "Strand" : "Course"} error={errors?.course?.message}>
                <select
                    {...register('course')}
                    disabled={!selectedDepartment || isCourseEmpty}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${(!selectedDepartment || isCourseEmpty) ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                    {
                        isCourseEmpty ? 
                        <option value={'Not Applicable'}>Not Applicable</option>
                        :
                        <>
                            {(departmentCourses[selectedDepartment] || []).map((course) => (
                            <option key={course} value={course}>{course}</option>
                            ))}
                        </>
                    }
                </select>
                </FormField>

                <FormField label={isSeniorHighDepartment ? "Grade Level" : "Year Level"} error={errors?.year_level?.message}>
                {
                    isYearLevelEmpty ? 
                    <option value={'Not Applicable'}>Not Applicable</option>
                    :
                        <>
                            <Select
                                {...register('year_level', {
                                    setValueAs: (v) => v === '' ? undefined : Number(v)
                                })}
                                options={YearOptions}
                                disabled={isYearLevelEmpty}
                            />
                        </>
                    }
                </FormField>
            </div>
        </div>
      </Section>
    );
};

export default CareerSection;