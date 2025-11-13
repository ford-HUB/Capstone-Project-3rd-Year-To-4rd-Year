import { Type, Mail, Hash, Phone, Calendar, FileText, ChevronDown, CheckSquare, Circle, Upload } from "lucide-react";

export const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'phone', label: 'Phone', icon: Phone },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'textarea', label: 'Long Text', icon: FileText },
  { type: 'select', label: 'Dropdown', icon: ChevronDown },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Multiple Choice', icon: Circle },
  { type: 'file', label: 'File Upload', icon: Upload },
];

 // Common input styles
export const INPUT_STYLES = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";
export const BUTTON_PRIMARY = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700";
export const BUTTON_SECONDARY = "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700";

