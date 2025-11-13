import { create } from "zustand";
import { submitEventEvaluation } from "../../services/participant/evaluationService.js";
import toast from "react-hot-toast";

export const useFeedbackStore = create((set) => ({


    submitEventEvaluation: async (event_id, formData) => {
        try {
            const response = await submitEventEvaluation(event_id, formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('submit event evaluation failed: ', error.message)
        }
    }
}))