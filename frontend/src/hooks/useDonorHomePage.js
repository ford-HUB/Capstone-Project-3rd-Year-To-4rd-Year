import { useState, useEffect } from 'react';
import { useDonationEventsStore } from '../store/donor/useDonationEventsStore';
import { useMyDonationsStore } from '../store/donor/useMyDonationsStore';
import { useDonorProfileStore } from '../store/donor/useDonorProfileStore';
import { getSocket, initSocket } from '../api/socket';
import {
    transformEventToCampaign,
    filterUpcomingEvents,
    getUniqueCategories,
    filterCampaigns,
} from '../utils/campaignUtils';

export const useDonorHomePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [trackingCampaignId, setTrackingCampaignId] = useState(null);

    const {
        events,
        loading,
        error,
        getEventsOpenForDonations,
        setupDonationUpdates,
        setupNewEventNotifications,
    } = useDonationEventsStore();

    const { myDonations, fetchMyDonations } = useMyDonationsStore();
    const { stats, fetchStats } = useDonorProfileStore();

    // Initialize data
    useEffect(() => {
        initSocket();
        getEventsOpenForDonations();
        fetchMyDonations();
        fetchStats();
    }, [getEventsOpenForDonations, fetchMyDonations, fetchStats]);

    // Setup socket listeners
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        
        const cleanupDonationUpdates = setupDonationUpdates(socket);
        const cleanupEventNotifications = setupNewEventNotifications(socket);
        
        return () => {
            cleanupDonationUpdates?.();
            cleanupEventNotifications?.();
        };
    }, [setupDonationUpdates, setupNewEventNotifications]);

    // Transform and filter events
    const filteredEvents = filterUpcomingEvents(events);
    const categories = getUniqueCategories(filteredEvents);
    
    // Get set of event IDs the donor has donated to
    const donatedEventIds = new Set(
        myDonations
            .filter(donation => donation.event_id)
            .map(donation => donation.event_id)
    );
    
    // Transform events to campaigns and add donation status
    const campaigns = filteredEvents.map(event => {
        const campaign = transformEventToCampaign(event);
        return {
            ...campaign,
            hasDonated: donatedEventIds.has(campaign.id)
        };
    });
    
    const displayedCampaigns = filterCampaigns(
        campaigns,
        searchQuery,
        selectedCategory
    );

    // Get tracked campaign and its donations
    const trackedCampaign = campaigns.find((c) => c.id === trackingCampaignId);
    const campaignDonations = trackingCampaignId && trackedCampaign
        ? myDonations.filter(
              (donation) => donation.campaign === trackedCampaign.title
          )
        : [];

    // Calendar navigation
    const navigatePrevMonth = () => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const navigateNextMonth = () => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Event handlers
    const handleDonateClick = (campaignId) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        
        if (!campaign) return;
        
        const { funds: hasFunds, goods: hasGoods } = campaign;
        
        // Redirect directly if only one donation type is enabled
        if (hasFunds && !hasGoods) {
            window.location.href = `/donor/donate?campaign=${campaignId}`;
            return;
        }
        
        if (hasGoods && !hasFunds) {
            window.location.href = `/donor/goods-donation?campaign=${campaignId}`;
            return;
        }
        
        // Show choice modal if both or neither are enabled
        setSelectedCampaignId(campaignId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCampaignId(null);
    };

    const handleTrackClick = (campaignId) => {
        if (trackingCampaignId === campaignId) {
            setTrackingCampaignId(null);
        } else {
            setTrackingCampaignId(campaignId);
        }
    };

    const handleTrackDonateClick = (campaignId) => {
        setTrackingCampaignId(null);
        handleDonateClick(campaignId);
    };

    return {
        // State
        currentDate,
        searchQuery,
        selectedCategory,
        trackingCampaignId,
        isModalOpen,
        selectedCampaignId,
        // Data
        campaigns: displayedCampaigns,
        categories,
        trackedCampaign,
        campaignDonations,
        filteredEvents,
        stats,
        loading,
        error,
        // Handlers
        setSearchQuery,
        setSelectedCategory,
        navigatePrevMonth,
        navigateNextMonth,
        handleDonateClick,
        closeModal,
        handleTrackClick,
        handleTrackDonateClick,
        setTrackingCampaignId,
    };
};

