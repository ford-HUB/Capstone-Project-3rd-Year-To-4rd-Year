import { SUPPORTED_TYPES, MAX_FILE_SIZE, MAX_FILES } from "../constants/documentSupport";
import { formatFileSize } from "./formatFileSize.js";

export const validateFile = (file, existingFiles) => {
    if (!SUPPORTED_TYPES[file.type]) {
        return `Sorry, ${file.name
            .split('.')
            .pop()
            .toUpperCase()} files aren't supported yet. Try PDF, Word, or Excel files.`;
    }
    if (file.size > MAX_FILE_SIZE) {
        return `File is too large (${formatFileSize(
            file.size
        )}). Please use files under 10MB.`;
    }
    if (existingFiles.length >= MAX_FILES) {
        return `You can upload up to ${MAX_FILES} files at once.`;
    }
    return null;
};