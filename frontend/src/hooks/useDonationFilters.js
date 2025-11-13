import { useState, useEffect } from 'react';
import { useInternalDonationStore } from '../store/common/useInternalDonationStore';

export const useDonationFilters = (currentPage = 1, limitPerPage = 10, onFilterChange) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDonations, setSelectedDonations] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [filterEvent, setFilterEvent] = useState('all');
    const [eventOptions, setEventOptions] = useState([]);

    const { 
        allDonations,
        filteredDonations, 
        loading, 
        getInternalDonationList,
        getOpenDonationEvents
    } = useInternalDonationStore();

    // Set event options when data is loaded
    useEffect(() => {
        const fetchOpenEvents = async () => {
            try {
                const events = await getOpenDonationEvents();
                setEventOptions(events);
            } catch (error) {
                console.error('Failed to fetch open donation events:', error);
                // Fallback to empty array
                setEventOptions([]);
            }
        };
        
        fetchOpenEvents();
    }, [getOpenDonationEvents]);

    // Note: Filter changes are now handled by the parent component to avoid infinite loops
    // The parent component should call onFilterChange when filters actually change

    // Toggle donation selection (only allow goods donations with PENDING status)
    const toggleDonationSelection = (donationId) => {
        // Find the donation to check if it's a goods donation with pending status
        const donation = allDonations.find(d => d.donation_id === donationId);
        
        // Only allow selection of goods donations with pending status
        if (donation && (donation.donation_type !== 'GOODS' || donation.status !== 'PENDING')) {
            return; // Don't allow selection of money donations or non-pending goods
        }
        
        setSelectedDonations((prev) =>
            prev.includes(donationId)
                ? prev.filter((id) => id !== donationId)
                : [...prev, donationId]
        );
    };

    // Select all donations (only goods donations with PENDING status)
    const selectAllDonations = (filteredList) => {
        // Filter to only include goods donations with pending status
        const goodsDonations = filteredList.filter(donation => 
            donation.donation_type === 'GOODS' && donation.status === 'PENDING'
        );
        
        if (selectedDonations.length === goodsDonations.length && goodsDonations.length > 0) {
            setSelectedDonations([]);
        } else {
            setSelectedDonations(goodsDonations.map((d) => d.donation_id));
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterType('all');
        setFilterEvent('all');
        setSelectedDonations([]);
    };

    return {
        // State
        searchTerm,
        selectedDonations,
        filterStatus,
        filterType,
        filterEvent,
        eventOptions,
        allDonations,
        filteredDonations,
        loading,
        
        // Actions
        setSearchTerm,
        setFilterStatus,
        setFilterType,
        setFilterEvent,
        toggleDonationSelection,
        selectAllDonations,
        resetFilters
    };
};
