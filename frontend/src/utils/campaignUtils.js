/**
 * Utility functions for campaign/event transformations and filtering
 */

/**
 * Transform event data into campaign format
 * @param {Object} event - Event object from API
 * @returns {Object} Formatted campaign object
 */
export const transformEventToCampaign = (event) => {
    const donationTypes = [];
    if (event.funds_donation) donationTypes.push('Funds');
    if (event.goods_donation) donationTypes.push('Goods');

    // Use real donation data from the API
    const totalRaised = event.donationStats?.totalRaised || 0;
    const donorCount = event.donationStats?.donorCount || 0;
    const progressPercentage = event.donationStats?.progressPercentage || 0;
    const totalDonations = event.donationStats?.totalDonations || 0;
    const averageDonation = event.donationStats?.averageDonation || 0;
    const goodsDonationCount = event.donationStats?.goodsDonationCount || 0;

    // Get category from Categories array (many-to-many relationship)
    const categoryName =
        event.Categories && event.Categories.length > 0
            ? event.Categories[0].name
            : 'General';

    return {
        id: event.event_id,
        category: categoryName,
        title: event.title,
        description: event.description,
        endDate: new Date(event.event_ended).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }),
        icon: '🎯',
        gradient: 'from-blue-400 to-cyan-400',
        image: event.event_image || null,
        progress: Math.round(progressPercentage),
        raised: totalRaised,
        donors: donorCount,
        donationTypes: donationTypes,
        funds: event.funds_donation || false,
        goods: event.goods_donation || false,
        status: event.status,
        location: event.location,
        organizer: event.Organizer?.name || 'UCLM CARES',
        totalDonations: totalDonations,
        averageDonation: averageDonation,
        goodsDonationCount: goodsDonationCount,
    };
};

/**
 * Filter events to only show upcoming events
 * @param {Array} events - Array of events
 * @returns {Array} Filtered array of upcoming events
 */
export const filterUpcomingEvents = (events) => {
    const todayForFilter = new Date();
    todayForFilter.setHours(0, 0, 0, 0);

    return events.filter((event) => {
        // Exclude events with 'Ongoing' status (already started)
        if (event.status === 'Ongoing') return false;

        // Exclude events where event_started date has passed
        if (event.event_started) {
            const eventStartDate = new Date(event.event_started);
            eventStartDate.setHours(0, 0, 0, 0);
            if (eventStartDate < todayForFilter) return false;
        }

        return true; // Include only upcoming events
    });
};

/**
 * Get unique categories from events
 * @param {Array} events - Array of events
 * @returns {Array} Array of unique category names, prefixed with 'All'
 */
export const getUniqueCategories = (events) => {
    const categorySet = new Set();
    events.forEach((event) => {
        if (event.Categories && event.Categories.length > 0) {
            event.Categories.forEach((cat) => categorySet.add(cat.name));
        }
    });
    return ['All', ...Array.from(categorySet).sort()];
};

/**
 * Filter campaigns by search query and category
 * @param {Array} campaigns - Array of campaigns
 * @param {string} searchQuery - Search query string
 * @param {string} selectedCategory - Selected category filter
 * @returns {Array} Filtered campaigns
 */
export const filterCampaigns = (campaigns, searchQuery, selectedCategory) => {
    return campaigns.filter((campaign) => {
        const matchesSearch =
            !searchQuery ||
            campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.organizer.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            !selectedCategory || selectedCategory === 'All' || campaign.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
};

