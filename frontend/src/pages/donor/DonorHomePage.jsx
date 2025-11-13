import React from 'react';
import DonationChoiceModal from '../../components/modal/v2/donor/DonationChoiceModal';
import CampaignCard from '../../components/donor/homepage/CampaignCard';
import CampaignCalendar from '../../components/donor/homepage/CampaignCalendar';
import ImpactWidget from '../../components/donor/homepage/ImpactWidget';
import CampaignSearchFilters from '../../components/donor/homepage/CampaignSearchFilters';
import CampaignTrackingModal from '../../components/donor/homepage/CampaignTrackingModal';
import { useDonorHomePage } from '../../hooks/useDonorHomePage';
import '../../styles/scrollable.css';

const DonorHomePage = () => {
    const {
        currentDate,
        searchQuery,
        selectedCategory,
        trackingCampaignId,
        isModalOpen,
        selectedCampaignId,
        campaigns,
        categories,
        trackedCampaign,
        campaignDonations,
        filteredEvents,
        stats,
        loading,
        error,
        setSearchQuery,
        setSelectedCategory,
        navigatePrevMonth,
        navigateNextMonth,
        handleDonateClick,
        closeModal,
        handleTrackClick,
        handleTrackDonateClick,
        setTrackingCampaignId,
    } = useDonorHomePage();

    return (
        <div className="bg-gray-50 h-min-screen">
            {/* Main Container */}
            <div className="flex gap-6 p-6 max-w-[1600px] mx-auto">
                {/* Main Content */}
                <main
                    className="flex-1 bg-white rounded-2xl p-8 shadow-sm overflow-y-auto scrollable"
                    style={{ maxHeight: 'calc(95vh - 100px)' }}>
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Discover Campaigns
                                </h1>
                                <p className="text-gray-600">
                                    Support meaningful causes and make a difference
                                    in your community
                                </p>
                            </div>
                        </div>

                        {/* Search and Filter Bar */}
                        <CampaignSearchFilters
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            categories={categories}
                        />
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">
                                    Loading events open for donations...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && campaigns.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="text-center">
                                <div className="text-6xl mb-6"></div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    No Events Available
                                </h3>
                                <p className="text-gray-600 max-w-md">
                                    There are currently no events open for donations.
                                    Check back later for new opportunities to make a
                                    difference in your community.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Campaigns Grid */}
                    {!loading && !error && campaigns.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {campaigns.map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    onTrackClick={handleTrackClick}
                                    onDonateClick={handleDonateClick}
                                    isTracking={trackingCampaignId === campaign.id}
                                    hasDonated={campaign.hasDonated}
                                />
                            ))}
                        </div>
                    )}
                </main>

                {/* Tracking Modal */}
                {trackingCampaignId && trackedCampaign && (
                    <CampaignTrackingModal
                        campaign={trackedCampaign}
                        donations={campaignDonations}
                        onClose={() => setTrackingCampaignId(null)}
                        onDonateClick={handleTrackDonateClick}
                    />
                )}

                {/* Right Sidebar - Calendar & Impact */}
                <aside
                    className="w-[380px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto scrollable"
                    style={{ maxHeight: 'calc(95vh - 100px)' }}>
                    {/* Calendar Widget */}
                    <CampaignCalendar
                        currentDate={currentDate}
                        onPrevMonth={navigatePrevMonth}
                        onNextMonth={navigateNextMonth}
                        events={filteredEvents}
                    />

                    {/* Impact Widget */}
                    <ImpactWidget stats={stats} />
                </aside>
            </div>

            {/* Donation Choice Modal */}
            <DonationChoiceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                campaignId={selectedCampaignId}
            />
        </div>
    );
};

export default DonorHomePage;
