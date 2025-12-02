import Tesseract from 'tesseract.js';

// Function to check if text is mostly garbage/noise
const isGarbageText = (text) => {
    if (!text || text.length < 10) {
        return false; // Too short to determine
    }

    // Count various indicators of garbage text
    const textLength = text.length;
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    // Count special characters and symbols (excluding common punctuation)
    const specialCharPattern = /[^a-zA-Z0-9\s.,\-'()]/g;
    const specialCharMatches = text.match(specialCharPattern) || [];
    const specialCharRatio = specialCharMatches.length / textLength;
    
    // Count isolated single/double characters separated by spaces (like "wr", "7", "aha", "RR")
    const isolatedChars = (text.match(/\b[a-zA-Z]{1,2}\b/g) || []).length;
    const isolatedCharRatio = wordCount > 0 ? isolatedChars / wordCount : 0;
    
    // Count uppercase/lowercase alternations within words (common in OCR errors)
    const caseAlternations = (text.match(/[a-z][A-Z]|[A-Z][a-z]/g) || []).length;
    const caseAlternationRatio = caseAlternations / textLength;
    
    // Count random character sequences (like "wr 7 aha RR", "Ty FE ERT")
    const randomPattern = /\b[a-zA-Z]{1,2}\s+\d+\s+[a-zA-Z]{1,2}\s+[A-Z]{1,2}\b/g;
    const randomMatches = text.match(randomPattern) || [];
    
    // Count sequences of 1-2 char words (strong indicator of garbage)
    const shortWordPattern = /\b[a-zA-Z]{1,2}\b/g;
    const shortWords = (text.match(shortWordPattern) || []).length;
    const shortWordRatio = wordCount > 0 ? shortWords / wordCount : 0;
    
    // Check for common readable words (if text has many readable words, it's probably not garbage)
    const commonWords = ['the', 'and', 'of', 'to', 'a', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'philippines', 'republic', 'identification', 'card', 'name', 'address', 'birth', 'date', 'first', 'last', 'middle', 'given', 'surname'];
    const textLower = text.toLowerCase();
    const readableWordCount = commonWords.filter(word => {
        // Check if word appears as a whole word, not just as part of another word
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(textLower);
    }).length;
    
    // Calculate readability score
    const readabilityScore = readableWordCount / Math.max(wordCount, 1);
    
    // If more than 50% special characters, likely garbage
    if (specialCharRatio > 0.5) {
        return true;
    }
    
    // If more than 60% isolated/short characters, likely garbage
    if (isolatedCharRatio > 0.6 || shortWordRatio > 0.6) {
        return true;
    }
    
    // If many random patterns found, likely garbage
    if (randomMatches.length > 3) {
        return true;
    }
    
    // If high case alternation ratio (>15%), likely garbage
    if (caseAlternationRatio > 0.15) {
        return true;
    }
    
    // If very low readability (less than 5% readable words) and high special char ratio, likely garbage
    if (readabilityScore < 0.05 && specialCharRatio > 0.25) {
        return true;
    }
    
    // If more than 70% of words are 1-2 characters and readability is low, likely garbage
    if (shortWordRatio > 0.7 && readabilityScore < 0.1) {
        return true;
    }
    
    return false;
};

const extractImageId = async (image, onProgress = null) => {
    let worker = null;
    try {
        worker = await Tesseract.createWorker('eng');
        
        // Set up progress callback if provided
        if (onProgress) {
            worker.onProgress = onProgress;
        }
        
        const { data: { text } } = await worker.recognize(image);

        // Early detection: Check if text is garbage before processing
        if (isGarbageText(text)) {
            await worker.terminate();
            return null; // Return null to indicate garbage text
        }

        // Clean up extracted text by removing unnecessary spaces and line breaks
        const cleanedText = text
            .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
            .trim();
        
        await worker.terminate();
        return cleanedText;
    } catch (error) {
        console.error('OCR error:', error);
        if (worker) {
            await worker.terminate();
        }
        return ''; // Return empty string on error
    }
};

export default extractImageId;
