import { create } from "zustand";
import { generateBothQr } from "../../services/event/QrService.js";
import toast from "react-hot-toast";

export const useQrStore = create((set) => ({
    timeInQrCode: null,
    timeOutQrCode: null,

    generateBothQr: async (eventId) => {
        try {
            const response = await generateBothQr(eventId)
            if(!response.success) {
                set({ timeInQrCode: null })
                set({ timeOutQrCode: null })
                console.log(response.message)
                return false
            }

            console.log('operating embedded qrcode')
            set({ timeInQrCode: response.timeInQrcode })
            set({ timeOutQrCode: response.timeOutQrcode })
            return true
        } catch (error) {
            console.log('generate both qr code failed: ', error.message)
        }

    }
}))