import { apiInstance } from "../../api/_base.js"

export const enableOrDisableFunds = async (id, funds) => {
    const response = await apiInstance.put(`/api/donation/enable-funds-event-donation/${id}`, funds)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const enableOrDisableGoods = async (id, goods) => {
    const response = await apiInstance.put(`/api/donation/enable-goods-event-donation/${id}`, goods)
    return {
        success: response.data.success,
        message: response.data.message
    }
}