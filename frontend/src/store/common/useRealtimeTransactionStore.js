import { create } from "zustand";
import { initSocket, getSocket } from "../../api/socket.js";
import { getDonationList } from "../../services/common/donationTrackingService.js";

export const useRealtimeTransactionStore = create((set, get) => {
    const socket = initSocket();
    let donationListenerCleanup = null;

    // Setup connection listeners
    socket.on('connect', () => {
        set({ isConnected: true });
        console.log('Transaction socket connected');
    });

    socket.on('disconnect', () => {
        set({ isConnected: false });
        console.log('Transaction socket disconnected');
    });

    socket.on('connect_error', (error) => {
        set({ isConnected: false, error: error.message });
        console.error('Transaction socket connection error:', error);
    });

    // Setup new donation listener
    const handleNewDonation = (donationData) => {
        // Debug: log incoming socket data
        console.log('Socket donation data received:', donationData);
        
        // Normalize donor name - check if anonymous
        let donorName = 'Donor';
        
        // Check if anonymous first
        if (donationData.is_anonymous) {
            donorName = 'Anonymous';
            console.log('Donation is anonymous');
        } else if (donationData.donor_name) {
            // Check for anonymous variations in the name
            const donorNameLower = donationData.donor_name.toLowerCase();
            if (donorNameLower === 'anonymous' || donorNameLower === 'anonymouse' || donorNameLower === 'anonuymouse') {
                donorName = 'Anonymous';
            } else {
                // Use the actual donor name
                donorName = donationData.donor_name;
            }
            console.log('Using donor_name from socket:', donorName);
        } else {
            console.log('No donor_name in socket data, using fallback');
        }
        
        const newTransaction = {
            id: donationData.donation_id || Date.now(),
            donation_id: donationData.donation_id,
            type: donationData.donation_type || 'MONEY',
            amount: donationData.amount || 0,
            status: donationData.status || 'PENDING',
            donor_name: donorName,
            event_name: donationData.event_name || 'General Donation',
            goods_description: donationData.goods_description || '',
            goods_quantity: donationData.goods_quantity || '',
            timestamp: donationData.timestamp || new Date(),
            payment_method: donationData.payment_method || '',
            transaction_id: donationData.transaction_id || ''
        };

        // Add new transaction at the beginning and keep only the 10 newest
        set((state) => {
            const updatedTransactions = [newTransaction, ...state.transactions];
            // Keep only the 10 newest transactions
            return {
                transactions: updatedTransactions.slice(0, 10)
            };
        });
    };

    socket.on('new_donation', handleNewDonation);
    donationListenerCleanup = () => {
        socket.off('new_donation', handleNewDonation);
    };

    return {
        transactions: [],
        socket: socket,
        isConnected: socket.connected,
        loading: false,
        error: null,

        // Fetch initial transactions (can be called manually to refresh)
        fetchInitialTransactions: async () => {
            set({ loading: true, error: null });
            try {
                const response = await getDonationList({ 
                    page: 1, 
                    limit: 10,
                    status: 'all',
                    type: 'all',
                    dateRange: 'today' // Fetch only today's donations
                });
                
                if (response.success && response.data) {
                    // Data is already formatted by backend controller
                    set({ transactions: response.data, loading: false });
                } else {
                    set({ loading: false });
                }
            } catch (error) {
                console.error('Failed to fetch initial transactions:', error);
                set({ error: error.message, loading: false });
            }
        },

        // Clear transactions
        clearTransactions: () => {
            set({ transactions: [] });
        },

        // Clear error
        clearError: () => {
            set({ error: null });
        },

        // Cleanup socket listeners (if needed for manual cleanup)
        cleanup: () => {
            if (donationListenerCleanup && typeof donationListenerCleanup === 'function') {
                donationListenerCleanup();
            }
        },

        // Reset store
        reset: () => {
            const { cleanup } = get();
            if (cleanup) cleanup();
            set({
                transactions: [],
                isConnected: socket.connected,
                error: null
            });
        }
    };
});

