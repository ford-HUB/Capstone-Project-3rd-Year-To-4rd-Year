import { useContext, createContext, useMemo } from "react";

const GraduatedYearsContext = createContext();

// Generate academic years dynamically based on current date
// Format: "YYYY-YYYY" (e.g., "2025-2026")
const generateGraduatedYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2010; // Start from 2010
  const endYear = currentYear + 1; // Include next year for upcoming graduates
  
  const academicYears = [];
  
  // Generate academic years in descending order (newest first)
  // Format: "YYYY-YYYY" (e.g., "2026-2025", "2025-2024", etc.)
  for (let year = endYear; year >= startYear; year--) {
    const academicYear = `${year}-${year + 1}`;
    academicYears.push({
      value: academicYear, // Use the year string as value
      label: academicYear
    });
  }
  
  return academicYears;
};

export const GraduatedYearsProvider = ({ children }) => {
  // Generate graduated years once and memoize
  const graduatedYears = useMemo(() => generateGraduatedYears(), []);

  return (
    <GraduatedYearsContext.Provider
      value={{
        graduatedYears,
        formattedGraduatedYears: graduatedYears
      }}
    >
      {children}
    </GraduatedYearsContext.Provider>
  );
};

export const useGraduatedYears = () => useContext(GraduatedYearsContext);

