
export const documentColorPicker = (fileType) => {
  switch (fileType) {
    case "application/pdf":
      return "bg-red-500 text-white"; 
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "bg-blue-500 text-white"; 
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "bg-green-500 text-white"; 
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "bg-orange-500 text-white";
    case "image/jpeg":
    case "image/png":
      return "bg-purple-500 text-white";
    case "text/plain":
      return "bg-gray-500 text-white";  
    default:
      return "bg-slate-400 text-white"; 
  }
};

