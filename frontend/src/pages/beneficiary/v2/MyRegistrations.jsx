import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBeneficiaryEventStore } from '../../../store/beneficiary/useBeneficiaryEventStore.js';
import BeneficiaryRegistrationsTabNavigation from '../../../components/beneficiary/v2/registrations/BeneficiaryRegistrationsTabNavigation.jsx';
import BeneficiaryRegisteredEventsList from '../../../components/beneficiary/v2/registrations/BeneficiaryRegisteredEventsList.jsx';
import BeneficiaryPendingRegistrationsTable from '../../../components/beneficiary/v2/registrations/BeneficiaryPendingRegistrationsTable.jsx';
import BeneficiaryRegistrationReviewModal from '../../../components/modal/v2/beneficiary/BeneficiaryRegistrationReviewModal.jsx';
import BeneficiaryRegistrationCancelModal from '../../../components/modal/v2/beneficiary/BeneficiaryRegistrationCancelModal.jsx';

// Constants
const DEFAULT_PAGE_SIZE = 10;
const INITIAL_PAGE = 1;

const MyRegistrations = () => {
  const {
    registeredEvents,
    pendingRegistrations,
    getRegisteredEvents,
    getPendingRegistrations,
    cancelRegistration,
    isLoading,
  } = useBeneficiaryEventStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'registered';
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: INITIAL_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    totalRecords: 0,
    totalPages: 1,
  });

  // Set default tab
  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'registered' });
    }
  }, [searchParams, setSearchParams]);

  // Helper functions
  const loadInitialData = async () => {
    await Promise.all([
      getRegisteredEvents(INITIAL_PAGE, DEFAULT_PAGE_SIZE),
      getPendingRegistrations(INITIAL_PAGE, DEFAULT_PAGE_SIZE)
    ]);
  };

  const loadTabData = async (tab) => {
    if (tab === 'registered') {
      await getRegisteredEvents(INITIAL_PAGE, DEFAULT_PAGE_SIZE);
    } else if (tab === 'pending') {
      await fetchPendingRegistrations(INITIAL_PAGE);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      getRegisteredEvents(INITIAL_PAGE, DEFAULT_PAGE_SIZE),
      getPendingRegistrations(INITIAL_PAGE, DEFAULT_PAGE_SIZE)
    ]);
    
    if (activeTab === 'pending') {
      await fetchPendingRegistrations(INITIAL_PAGE);
    }
  };

  const handleTabChange = (tab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    });
  };

  const fetchPendingRegistrations = async (page = 1, pageSize = null) => {
    const currentPageSize = pageSize || pagination.pageSize;
    const result = await getPendingRegistrations(page, currentPageSize);
    if (result?.success) {
      setPagination(result.pagination || pagination);
    } else {
      setPagination({
        currentPage: 1,
        pageSize: currentPageSize,
        totalRecords: 0,
        totalPages: 1,
      });
    }
  };

  // Load counts for both tabs on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load data on tab change
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const handlePageChange = (page) => {
    fetchPendingRegistrations(page);
  };

  const handlePageSizeChange = (page, pageSize) => {
    fetchPendingRegistrations(page, pageSize);
  };

  const handleReviewRegistration = (registration) => {
    setSelectedRegistration(registration);
    setShowReviewModal(true);
  };

  const handleCancelRegistration = (registration) => {
    setSelectedRegistration(registration);
    setShowCancelModal(true);
  };

  const confirmCancelRegistration = async () => {
    if (selectedRegistration) {
      try {
        await cancelRegistration(selectedRegistration.event_id);
        setShowCancelModal(false);
        setSelectedRegistration(null);
        
        // Refresh all data after cancellation
        await refreshAllData();
        if (activeTab === 'pending') {
          await fetchPendingRegistrations(pagination.currentPage);
        }
      } catch (error) {
        console.error('Failed to cancel registration:', error);
      }
    }
  };


  return (
    <div className="max-h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Registrations
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your event registrations and track their status
              </p>
            </div>
            <button
              onClick={refreshAllData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <BeneficiaryRegistrationsTabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          registeredEventsCount={registeredEvents.length}
          pendingRegistrationsCount={pendingRegistrations.length}
        />

        {/* Tab Content */}
        <div className='mb-[4rem]'>
          {activeTab === 'registered' && (
            <BeneficiaryRegisteredEventsList
              registeredEvents={registeredEvents}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'pending' && (
            <BeneficiaryPendingRegistrationsTable
              pendingRegistrations={pendingRegistrations}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onReviewRegistration={handleReviewRegistration}
              onCancelRegistration={handleCancelRegistration}
            />
          )}
        </div>

        {/* Modals */}
        <BeneficiaryRegistrationReviewModal
          open={showReviewModal}
          setOpen={setShowReviewModal}
          selectedRegistration={selectedRegistration}
        />

        <BeneficiaryRegistrationCancelModal
          open={showCancelModal}
          setOpen={setShowCancelModal}
          selectedRegistration={selectedRegistration}
          onConfirm={confirmCancelRegistration}
        />
      </div>
    </div>
  );
};

export default MyRegistrations;
