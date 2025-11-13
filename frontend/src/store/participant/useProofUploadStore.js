import { create } from "zustand";
import { uploadEventProof, getEventProofStatus, markEvaluationCompleted } from "../../services/participant/proofUploadService.js";
import toast from "react-hot-toast";

export const useProofUploadStore = create((set) => ({
    uploadEventProof: async (eventId, files) => {
        try {
            const response = await uploadEventProof(eventId, files);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }

            toast.success(response.message);
            return true;
        } catch (error) {
            console.log('Upload proof failed:', error.message);
            toast.error('Failed to upload proof. Please try again.');
            return false;
        }
    },

    getEventProofStatus: async (eventId) => {
        try {
            const response = await getEventProofStatus(eventId);
            if (!response.success) {
                console.log('Get proof status failed:', response.message);
                return null;
            }
            return response.data;
        } catch (error) {
            console.log('Get proof status failed:', error.message);
            return null;
        }
    },

    markEvaluationCompleted: async (eventId) => {
        try {
            const response = await markEvaluationCompleted(eventId);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }

            toast.success(response.message);
            return true;
        } catch (error) {
            console.log('Mark evaluation completed failed:', error.message);
            toast.error('Failed to mark evaluation as completed.');
            return false;
        }
    }
}));
