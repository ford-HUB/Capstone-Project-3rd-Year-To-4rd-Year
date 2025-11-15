import { create } from "zustand";
import { getAllAttendanceRecords, getListAttendanceParticipantLog, ScanQrAttendance } from "../../services/common/attendanceService.js";

export const useScanQRAttendanceStore = create((set) => ({
    attendanceListData: [],
    loading: false,
    message: '',
    
    scanQrTrigger: async (decodedLink) => {
        try {
            const response = await ScanQrAttendance(decodedLink)
            return {
                success: response?.success || false,
                message: response?.message || 'Failed to scan QR code',
                eventDetails: response?.eventDetails || null
            }
        } catch (error) {
            console.error('scan qr trigger failed: ', error.message)
            return {
                success: false,
                message: error?.message || 'Failed to scan QR code. Please try again.',
                eventDetails: null
            }
        }
    },

    getListAttendanceParticipantLog: async () => {
        set({ loading: true })
        try {
            const response = await getListAttendanceParticipantLog()
            if(!response.success) {
                set({ attendanceListData: null, loading: false })
                return false
            }

            set({ attendanceListData: response.attendanceData, loading: false })
            return true

        } catch (error) {
            console.error('attendance log failed:', error)
        }finally {
            set({ loading: false })
        }
    },

    getAllAttendanceRecords: async (page, limit, filters = {}) => {
        try {
            const response = await getAllAttendanceRecords(page, limit, filters)
            if(!response.success) {
                console.log('fetching attendance records failed')
                return {
                    success: false,
                    attendanceData: [],
                    pagination: {
                        total: 0,
                        page: page,
                        totalPages: 0
                    },
                    statistics: {
                        participantTypeCounts: [],
                        statusCounts: { present_count: 0, in_progress_count: 0 },
                        totalRecords: 0
                    }
                }
            }

            return {
                success: response.success,
                attendanceData: response.attendanceData,
                pagination: {
                    total: response.pagination.total,
                    page: response.pagination.page,
                    totalPages: response.pagination.totalPages
                },
                statistics: response.statistics
            }
        } catch (error) {
            console.log('get all attendance records failed: ', error)
            return {
                success: false,
                attendanceData: [],
                pagination: {
                    total: 0,
                    page: page,
                    totalPages: 0
                },
                statistics: {
                    participantTypeCounts: [],
                    statusCounts: { present_count: 0, in_progress_count: 0 },
                    totalRecords: 0
                }
            }
        }
    }
}))
