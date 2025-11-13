export const SUPPORTED_TYPES = {
    'application/pdf': { name: 'PDF', desc: 'PDF Documents' },
    'application/msword': { name: 'DOC', desc: 'Word 97-2003' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { name: 'DOCX', desc: 'Word Documents' },
    'application/vnd.ms-excel': { name: 'XLS', desc: 'Excel 97-2003' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { name: 'XLSX', desc: 'Excel Spreadsheets' },
    'application/vnd.ms-powerpoint': { name: 'PPT', desc: 'PowerPoint 97-2003' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { name: 'PPTX', desc: 'PowerPoint Presentations' },
    'text/plain': { name: 'TXT', desc: 'Text Files' },
    'text/csv': { name: 'CSV', desc: 'Spreadsheet Data' },
    'application/rtf': { name: 'RTF', desc: 'Rich Text Format' }
};
  
export const CATEGORIES = [
    { value: 'Annual Report', label: 'Annual Report', desc: 'Yearly summary of activities and performance' },
    { value: 'Monthly Report', label: 'Monthly Report', desc: 'Month-by-month progress and updates' },
    { value: 'Financial Statement', label: 'Financial Statement', desc: 'Balance sheets, income statements, and financial data' },
    { value: 'Compliance Document', label: 'Compliance Document', desc: 'Policies, certifications, and regulatory compliance files' },
    { value: 'Special', label: 'Special', desc: 'Any special or ad-hoc document not in other categories' }
  ];
  
  
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 10;