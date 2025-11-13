export const documentTypeCounter = (documents) => {
    const counter = {};
  
    documents?.forEach((document) => {
      const type = document.file_type;
      if (type) {
        counter[type] = (counter[type] || 0) + 1;
      }
    });
  
    return counter;
  };
  