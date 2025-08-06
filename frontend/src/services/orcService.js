import Tesseract from 'tesseract.js';

const extractImageId = async (image) => {
    try {
        const { data: { text } } = await Tesseract.recognize(image, 'eng', {
            logger: (m) => console.log(m), // Logs progress
        });

        // Clean up extracted text by removing unnecessary spaces and line breaks
        const cleanedText = text
            .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
            .trim();
        return cleanedText;
    } catch (error) {
        console.error('I caught an error:', error);
        return ''; // Return empty string on error
    }
};

export default extractImageId;
