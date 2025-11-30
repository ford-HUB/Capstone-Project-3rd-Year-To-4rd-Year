import React from 'react';
import { Search, Plus, ChevronDown, Edit2, Trash2, ArrowUpDown, Menu, MoreVertical, Eye, PackageOpen, ChevronLeft, ChevronRight, QrCode } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import CreateEvent from '../../components/modal/CreateEvent.jsx';
import EditEvent from '../../components/modal/EditEvent.jsx';
import DeleteModal from '../../components/modal/DeleteEventModal.jsx';
import JoinEventModal from '../../components/modal/JoinEventModal.jsx';
import DonationIconButton from '../../components/common/DonationIconButton.jsx';
import DonationOptionModal from '../../components/modal/v2/donation-option/DonationOptionModal.jsx';
import QRCodeModal from '../../components/modal/QRCodeModal.jsx';
import { useEventStore } from '../../store/event/useEventStore.js';
import { useDonationStore } from '../../store/donation/useDonationStore.js';
import { useAuthStore as useAuthManagementStore } from '../../store/management/useAuthStore.js';
import { useAuthStore as useAuthDirectorStore } from '../../store/director/useAuthStore.js';
import { useProfileStore as useManagementProfileStore } from '../../store/management/useProfileStore.js';

const getDefaultOrganizerAvatar = () => {
  return '';
};

const ManageEvents = () => {
  const location = useLocation();
  const isDirectorRoute = location.pathname.includes('/director/');
  
  const { listEvents, getListEvents, loading, error, deleteEvent } = useEventStore();
  const { enableOrDisableFundsEventDonation, enableOrDisableGoodsEventDonation } = useDonationStore();
  
  // Use director auth if on director route, otherwise use management auth
  const { authenticatedManagement, checkAuth: checkManagementAuth } = useAuthManagementStore();
  const { authenticatedDirector, checkAuth: checkDirectorAuth } = useAuthDirectorStore();
  const { managementCurrentProfile, currentProfile } = useManagementProfileStore();
  
  // Determine which auth to use based on route
  const authenticatedUser = isDirectorRoute ? authenticatedDirector : authenticatedManagement;
  const checkAuth = isDirectorRoute ? checkDirectorAuth : checkManagementAuth;
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('');
  const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [deleteModalState, setDeleteModalState] = React.useState({
    isOpen: false,
    eventName: '',
    eventId: null
  });
  const [showEventBoardModal, setShowEventBoardModal] = React.useState(false);
  const [openActionMenu, setOpenActionMenu] = React.useState(null); // Track which row's menu is open
  const [menuPosition, setMenuPosition] = React.useState({ top: 0, right: 0 }); // Track menu position
  const [showDonationModal, setShowDonationModal] = React.useState(false);
  const [donationEvent, setDonationEvent] = React.useState(null);
  const [showQRCodeModal, setShowQRCodeModal] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Get user role and department
  const userRole = authenticatedUser?.Role?.name;
  const isCoordinator = userRole === 'coordinator' || userRole === 'assistant_coordinator';
  const coordinatorDepartment = managementCurrentProfile?.Department?.department_name;

  // Fetch user profile on mount if coordinator
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (isCoordinator && !managementCurrentProfile && authenticatedUser) {
        await currentProfile();
      }
    };
    if (authenticatedUser) {
      fetchProfile();
    } else {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticatedUser, isCoordinator, managementCurrentProfile]); // Run when auth state changes

  // Fetch events on mount
  React.useEffect(() => {
    if (listEvents.length === 0) {
      getListEvents().catch(err => console.error("Failed to fetch events:", err));
    }
  }, [getListEvents, listEvents.length]);

  // Map listEvents to formatted events using useMemo
  const events = React.useMemo(() => {
    if (!listEvents || !Array.isArray(listEvents)) return [];

    return listEvents.map(event => ({
      id: event.event_id,
      event_id: event.event_id,
      title: event.title,
      type: event.Categories?.[0]?.name || 'Uncategorized',
      date: dayjs(event.event_started).format('DD/MM/YYYY'),
      dateFull: dayjs(event.event_started).format('MMMM D, YYYY'),
      startTime: dayjs(event.event_started).format('h:mm A'),
      endTime: dayjs(event.event_ended).format('h:mm A'),
      timeRange: `${dayjs(event.event_started).format('h:mm A')} - ${dayjs(event.event_ended).format('h:mm A')}`,
      location: event.location,
      maxParticipants: event.max_participants,
      currentParticipants: event.participants || 0,
      description: event.description,
      event_image: event.event_image,
      organizer: event.Organizer?.name || 'Unknown',
      department: event.Departments?.[0]?.department_name,
      funds: event.funds_donation,
      goods: event.goods_donation,
      status: event.status,
      beneficiary_applicable: event.beneficiary_applicable || false,
      max_beneficiaries: event.max_beneficiaries || null,
      // Store raw event data for edit modal
      rawEvent: event
    }));
  }, [listEvents]);

  // Filtered and sorted events
  const filteredEvents = React.useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === '' || event.type === selectedType;
      
      // Filter by department if user is coordinator
      let matchesDepartment = true;
      if (isCoordinator && coordinatorDepartment) {
        // Only show events from coordinator's department
        matchesDepartment = event.department === coordinatorDepartment;
      }
      
      return matchesSearch && matchesType && matchesDepartment;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'date') {
          aValue = dayjs(a.date, 'DD/MM/YYYY').toDate();
          bValue = dayjs(b.date, 'DD/MM/YYYY').toDate();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [events, searchTerm, selectedType, sortConfig, isCoordinator, coordinatorDepartment]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, Math.min(totalPages - maxVisiblePages + 1, currentPage - 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Derive unique event types
  const eventTypes = React.useMemo(() => {
    return [...new Set(events.map(event => event.type))];
  }, [events]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleCreateEvent = () => {
    setShowCreateModal(false);
    getListEvents();
  };

  const handleEditEvent = (event) => {
    const rawEvent = event.rawEvent || event;
    const eventForEdit = {
      ...event,
      ...rawEvent,
      id: event.id || event.event_id,
      event_id: event.event_id || event.id,
      date: rawEvent.event_started 
        ? dayjs(rawEvent.event_started).format('MM/DD/YYYY')
        : event.date ? dayjs(event.date, 'DD/MM/YYYY').format('MM/DD/YYYY') : '',
      startTime: event.startTime || (rawEvent.event_started ? dayjs(rawEvent.event_started).format('h:mm A') : ''),
      endTime: event.endTime || (rawEvent.event_ended ? dayjs(rawEvent.event_ended).format('h:mm A') : ''),
      maxParticipants: event.maxParticipants || rawEvent.max_participants,
      currentParticipants: event.currentParticipants || rawEvent.participants || 0,
      organizer: event.organizer || rawEvent.Organizer?.name,
      department: event.department || rawEvent.Departments?.[0]?.department_name,
      type: event.type || rawEvent.Categories?.[0]?.name,
      funds: event.funds || rawEvent.funds_donation,
      goods: event.goods || rawEvent.goods_donation,
      beneficiary_applicable: event.beneficiary_applicable !== undefined ? event.beneficiary_applicable : (rawEvent.beneficiary_applicable || false),
      max_beneficiaries: event.max_beneficiaries !== undefined ? event.max_beneficiaries : rawEvent.max_beneficiaries
    };
    setSelectedEvent(eventForEdit);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    setShowEditModal(false);
    setSelectedEvent(null);
    await getListEvents();
  };

  const handleDeleteEvent = async (eventId) => {
    const success = await deleteEvent(eventId);
    if (success) {
      await getListEvents();
      setDeleteModalState({ isOpen: false, eventName: '', eventId: null });
    }
  };

  const handleViewMoreDetails = (event) => {
    setSelectedEvent(event);
    setShowEventBoardModal(true);
  };

  const handleCloseEventBoard = () => {
    setShowEventBoardModal(false);
    setSelectedEvent(null);
  };

  const handleToggleActionMenu = (eventId, event) => {
    if (openActionMenu === eventId) {
      setOpenActionMenu(null);
    } else {
      // Get button position
      const button = event?.currentTarget;
      if (button) {
        const rect = button.getBoundingClientRect();
        setMenuPosition({
          top: rect.top + window.scrollY - 8,
          right: window.innerWidth - rect.right + window.scrollX,
          transform: 'translateY(-100%)'
        });
      }
      setOpenActionMenu(eventId);
    }
  };

  const handleActionClick = (action, event) => {
    setOpenActionMenu(null);
    if (action === 'view') {
      handleViewMoreDetails(event);
    } else if (action === 'edit') {
      handleEditEvent(event);
    } else if (action === 'delete') {
      setDeleteModalState({
        isOpen: true,
        eventName: event.title,
        eventId: event.id
      });
    } else if (action === 'donation') {
      const eventForDonation = {
        ...(event.rawEvent || event),
        id: event.id || event.event_id,
        funds: event.funds || event.rawEvent?.funds_donation,
        goods: event.goods || event.rawEvent?.goods_donation
      };
      setDonationEvent(eventForDonation);
      setShowDonationModal(true);
      setOpenActionMenu(null);
    } else if (action === 'qrcode') {
      const eventForQR = {
        ...(event.rawEvent || event),
        id: event.id || event.event_id,
        title: event.title || event.rawEvent?.title || ''
      };
      setSelectedEvent(eventForQR);
      setShowQRCodeModal(true);
    }
  };

  const handleDonationOption = async ({ funds, goods, goodsTypes }) => {
    const eventId = donationEvent?.id || donationEvent?.event_id;
    if (!eventId) {
      console.error('Event ID is missing');
      return;
    }
    await enableOrDisableFundsEventDonation(eventId, { funds: funds });
    await enableOrDisableGoodsEventDonation(eventId, { goods: goods, goodsTypes: goodsTypes || [] });
    setShowDonationModal(false);
    setDonationEvent(null);
    await getListEvents();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-purple-100 text-purple-800';
      case 'Ongoing':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    if (type === 'Paid' || type.toLowerCase().includes('paid')) {
      return 'text-purple-600 font-medium';
    }
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Error loading events: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <span>Home</span>
        <span className="mx-2">-</span>
        <span className="text-gray-900 font-medium">All Events</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-blue-600 rounded"></div>
          <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                {selectedType || 'All Types'}
                <ChevronDown size={16} />
              </button>
              
              {showTypeDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                  <button
                    onClick={() => { setSelectedType(''); setShowTypeDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                  >
                    All Types
                  </button>
                  {eventTypes.map((type, index) => (
                    <button
                      key={index}
                      onClick={() => { setSelectedType(type); setShowTypeDropdown(false); }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Create Event
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('event_id')}
                >
                  <div className="flex items-center gap-2">
                    <span>ID No</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Organizer</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    <span>Event Name</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center gap-2">
                    <span>Venue</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-2">
                    <span>Type</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  current/max
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <p className="text-gray-500">No events found</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create Your First Event
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((event, index) => {
                  const hasDonation = event.funds || event.goods;
                  const baseBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50';
                  const donationBg = hasDonation ? 'bg-blue-50' : '';
                  
                  return (
                  <tr 
                    key={event.id} 
                    className={`hover:bg-gray-50 transition-colors ${hasDonation ? donationBg : baseBg}`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.event_id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={'https://ui-avatars.com/api/?name=Organizer&background=6366f1&color=fff&size=128'}
                          alt={event.organizer}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/32?text=O';
                          }}
                        />
                        <span className="text-sm text-gray-900">{event.organizer}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {event.location}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        <span className="text-purple-600 font-medium">{event.currentParticipants}</span> / {event.maxParticipants}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {event.timeRange}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {event.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={(e) => handleToggleActionMenu(event.id, e)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                          title="Actions"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredEvents.length > 0 && totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(endIndex, filteredEvents.length)}</span> of <span className="font-semibold">{filteredEvents.length}</span> results
                </div>
                <div className="text-sm text-gray-500">
                  Page <span className="font-semibold text-blue-600">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {openActionMenu && filteredEvents.find(e => e.id === openActionMenu) && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenActionMenu(null)}
          />
          <div 
            className="fixed w-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1"
            style={{
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
              transform: menuPosition.transform || 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const event = filteredEvents.find(e => e.id === openActionMenu);
              if (!event) return null;
              return (
                <>
                  <button
                    onClick={() => handleActionClick('view', event)}
                    className="w-full px-3 py-2 hover:bg-gray-50 flex items-center justify-center"
                    title="View More Details"
                  >
                    <Eye size={18} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleActionClick('qrcode', event)}
                    className="w-full px-3 py-2 hover:bg-gray-50 flex items-center justify-center"
                    title="View QR Codes"
                  >
                    <QrCode size={18} className="text-gray-700" />
                  </button>
                  {event.type !== 'School' && (
                    <button
                      className="w-full px-3 py-2 hover:bg-gray-50 flex items-center justify-center"
                      title="Enable Donation"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick('donation', event);
                      }}
                    >
                      <PackageOpen size={18} className="text-gray-700" />
                    </button>
                  )}
                  <button
                    onClick={() => handleActionClick('edit', event)}
                    className="w-full px-3 py-2 hover:bg-gray-50 flex items-center justify-center"
                    title="Edit Event"
                  >
                    <Edit2 size={18} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleActionClick('delete', event)}
                    className="w-full px-3 py-2 hover:bg-red-50 flex items-center justify-center"
                    title="Delete Event"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </>
              );
            })()}
          </div>
        </>
      )}

      {showCreateModal && (
        <CreateEvent
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateEvent}
        />
      )}

      {showEditModal && selectedEvent && (
        <EditEvent
          event={selectedEvent}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {showEventBoardModal && selectedEvent && (
        <JoinEventModal
          event={{
            ...(selectedEvent.rawEvent || selectedEvent),
            id: selectedEvent.id || selectedEvent.event_id || selectedEvent.rawEvent?.event_id,
            maxParticipants: selectedEvent.maxParticipants || selectedEvent.rawEvent?.max_participants || 0,
            currentParticipants: selectedEvent.currentParticipants || selectedEvent.rawEvent?.participants || 0,
            participants: selectedEvent.currentParticipants || selectedEvent.rawEvent?.participants || 0,
            max_participants: selectedEvent.maxParticipants || selectedEvent.rawEvent?.max_participants || 0,
            // Ensure date and time fields are available
            date: selectedEvent.date || selectedEvent.dateFull || (selectedEvent.rawEvent?.event_started ? dayjs(selectedEvent.rawEvent.event_started).format('MMMM D, YYYY') : ''),
            startTime: selectedEvent.startTime || (selectedEvent.rawEvent?.event_started ? dayjs(selectedEvent.rawEvent.event_started).format('h:mm A') : ''),
            endTime: selectedEvent.endTime || (selectedEvent.rawEvent?.event_ended ? dayjs(selectedEvent.rawEvent.event_ended).format('h:mm A') : ''),
            location: selectedEvent.location || selectedEvent.rawEvent?.location || '',
            description: selectedEvent.description || selectedEvent.rawEvent?.description || '',
            organizer: selectedEvent.organizer || selectedEvent.rawEvent?.Organizer?.name || 'Unknown',
            title: selectedEvent.title || selectedEvent.rawEvent?.title || ''
          }}
          onClose={handleCloseEventBoard}
          onRemoveParticipant={() => {}}
        />
      )}

      <DeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, eventName: '', eventId: null })}
        onConfirm={() => handleDeleteEvent(deleteModalState.eventId)}
        event={deleteModalState.eventName}
        action="delete"
      />

      {showDonationModal && donationEvent && (
        <DonationOptionModal
          event={donationEvent}
          open={showDonationModal}
          setOpen={setShowDonationModal}
          onConfirm={handleDonationOption}
        />
      )}

      {showQRCodeModal && selectedEvent && (
        <QRCodeModal
          event={selectedEvent}
          isOpen={showQRCodeModal}
          onClose={() => {
            setShowQRCodeModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageEvents;
