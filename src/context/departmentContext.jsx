import { useContext, createContext } from "react";

const DepartmentContext = createContext();

const uclmCurrentDepartment = [
  "College of Teacher Education",
  "College of Hospitality & Tourism Management",
  "College of Computer Studies",
  "College of Nursing",
  "College of Maritime",
  "College of Business Administration",
  "College of Customs Administration",
  "College of Bussines & Accountancy",
  "College of Engeneering",
];

const uclmCurrentCourses = [
  "Bachelor of Elementary Education",
  "Bachelor of Secondary Education",

  "Bachelor of Science in Hospitality Management",
  "Barista NC II",
  "Bartending NC II",
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Nursing",
  "Bachelor of Science in Marine Engineering",
  "Bachelor of Science in Marine Transportation",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Customs Administration",
  "Bachelor of Science in Accountancy",
  "Bachelor of Science in Computer Engineering",
  "Bachelor of Science in Electrical Engineering",
  "Bachelor of Science in Electronics & Communications Engineering",
  "Bachelor of Science in Industrial Engineering",
];

export const DepartmentProvider = ({ children }) => {
  return (
    <DepartmentContext.Provider
      value={{ uclmCurrentDepartment, uclmCurrentCourses }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartment = () => useContext(DepartmentContext);
