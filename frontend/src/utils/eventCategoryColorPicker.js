/**
 * Event Category Color Picker Utility
 * Provides consistent color coding for event categories
 */

export const eventCategoryColorPicker = (category) => {
  switch (category?.toLowerCase()) {
    case "school":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",  
        border: "border-blue-200",
        dot: "bg-blue-500"
      };
    case "community":
      return {
        bg: "bg-green-100",
        text: "text-green-800", 
        border: "border-green-200",
        dot: "bg-green-500"
      };
    case "emergency":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200", 
        dot: "bg-red-500"
      };
    case "donation drive":
      return {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-200",
        dot: "bg-purple-500"
      };
    case "charity":
      return {
        bg: "bg-pink-100",
        text: "text-pink-800",
        border: "border-pink-200",
        dot: "bg-pink-500"
      };
    case "relief program":
      return {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-200",
        dot: "bg-orange-500"
      };
    case "health":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
        dot: "bg-emerald-500"
      };
    case "outreach":
      return {
        bg: "bg-teal-100",
        text: "text-teal-800",
        border: "border-teal-200",
        dot: "bg-teal-500"
      };
    case "training":
      return {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        border: "border-indigo-200",
        dot: "bg-indigo-500"
      };
    case "seminar":
      return {
        bg: "bg-cyan-100",
        text: "text-cyan-800",
        border: "border-cyan-200",
        dot: "bg-cyan-500"
      };
    case "others":
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
        dot: "bg-gray-500"
      };
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-800",
        border: "border-slate-200",
        dot: "bg-slate-500"
      };
  }
};

/**
 * Get a simplified color class for small indicators
 */
export const getEventCategoryColor = (category) => {
  const colors = eventCategoryColorPicker(category);
  return colors.dot;
};

/**
 * Get full color scheme for category display
 */
export const getEventCategoryColors = (category) => {
  return eventCategoryColorPicker(category);
};
