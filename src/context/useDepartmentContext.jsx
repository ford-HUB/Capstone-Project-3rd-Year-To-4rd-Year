import { useContext, createContext } from "react";

const DepartmentContext = createContext();

const departmentCourses = {
  "College of Teacher Education": [
    "BSED - Bachelor of Secondary Education",
    "BEED - Bachelor of Elementary Education",
    "BTLEd - Bachelor of Technology and Livelihood Education"
  ],
  "College of Hospitality & Tourism Management": [
    "BSHM - Bachelor of Science in Hospitality Management",
    "BSTM - Bachelor of Science in Tourism Management"
  ],
  "College of Computer Studies": [
    "BSIT - Bachelor of Science in Information Technology",
    "BSCS - Bachelor of Science in Computer Science"
  ],
  "College of Nursing": [
    "BSN - Bachelor of Science in Nursing"
  ],
  "College of Maritime": [
    "BSMarE - Bachelor of Science in Marine Engineering",
    "BSMT - Bachelor of Science in Marine Transportation"
  ],
  "College of Business Administration": [
    "BSBA-Marketing - Bachelor of Science in Business Administration Major in Marketing",
    "BSBA-HRM - Bachelor of Science in Business Administration Major in HRM"
  ],
  "College of Customs Administration": [
    "BSCA - Bachelor of Science in Customs Administration"
  ],
  "College of Bussines & Accountancy": [
    "BSBA - Bachelor of Science in Business Administration",
    "BSA - Bachelor of Science in Accountancy"
  ],
  "College of Engeneering": [
    "BSCpE - Bachelor of Science in Computer Engineering",
    "BSEE - Bachelor of Science in Electrical Engineering",
    "BSCE - Bachelor of Science in Civil Engineering"
  ]
};



export const DepartmentProvider = ({ children }) => {
  return (
    <DepartmentContext.Provider
      value={{ departmentCourses }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartment = () => useContext(DepartmentContext);
