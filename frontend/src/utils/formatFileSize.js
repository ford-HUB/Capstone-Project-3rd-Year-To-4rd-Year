
export const formatFileSize = (bytes) => {
    // Handle null, undefined, or non-number values
    if (!bytes || isNaN(bytes) || bytes < 0) return 'Unknown size';
    
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    // Ensure i is within bounds
    const index = Math.min(i, sizes.length - 1);
    
    return parseFloat((bytes / Math.pow(k, index)).toFixed(1)) + ' ' + sizes[index];
};



