import React, { useEffect, useState } from 'react';
import { Calendar, RefreshCw, Info, X } from 'lucide-react';
import { useEventStore } from '../../../store/participant/useEventStore.js';
import { filterEvents } from '../../../utils/eventFilterUtils.js';
import RegisteredEventFilters from '../../../components/participant/v2/registered-events/RegisteredEventFilters.jsx';
import RegisteredEventPagination from '../../../components/participant/v2/registered-events/RegisteredEventPagination.jsx';
import RegisteredEventTable from '../../../components/participant/v2/registered-events/RegisteredEventTable.jsx';
import RegisteredEventCard from '../../../components/participant/v2/registered-events/RegisteredEventCard.jsx';
import EventDetailsModal from '../../../components/modal/v2/participant/EventDetailsModal.jsx';

const RegisteredEventList = () => {
    const { getAllRegisteredPagination } = useEventStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [proofFilter, setProofFilter] = useState('All');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [events, setEvents] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 3,
        totalRecords: 0,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    const fetchEvents = async (page = 1, showRefresh = false) => {
        if (showRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        
        const result = await getAllRegisteredPagination(page, pagination.pageSize);
        if (result?.success) {
            setEvents(result.records ?? []);
            setPagination(result.pagination ?? pagination);
        } else {
            setEvents([]);
            setPagination({
                currentPage: 1,
                pageSize: 10,
                totalRecords: 0,
                totalPages: 1,
            });
        }
        setLoading(false);
        setRefreshing(false);
    };

    const handleRefresh = () => {
        fetchEvents(pagination.currentPage, true);
    };

    useEffect(() => {
        fetchEvents(1); // load first page
    }, []);

    const handleViewEventDetails = (event, registration) => {
        setSelectedEvent({ event, registration });
        setShowEventDetails(true);
    };

    const handleStatusUpdate = () => {
        fetchEvents(pagination.currentPage);
        setShowEventDetails(false);
    };

    // Filtered events using utility function
    const filteredEvents = filterEvents(events, {
        searchTerm,
        statusFilter,
        proofFilter
    });

    const ViewModeToggle = () => (
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                Table
            </button>
            <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'card'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                Cards
            </button>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white h-full overflow-y-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        My Registered Events
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Track your event participation and progress
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowInstructions(!showInstructions)}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Info className="w-4 h-4" />
                                <span>{showInstructions ? 'Hide Instructions' : 'Show Instructions'}</span>
                            </button>
                            
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                            
                            <ViewModeToggle />
                        </div>
                    </div>

                    <RegisteredEventFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        proofFilter={proofFilter}
                        onProofFilterChange={setProofFilter}
                        disabled={loading}
                    />
                </div>
            </div>

            {/* Certificate Requirements Instructions Panel */}
            {showInstructions && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 shadow-sm">
                    <div className="px-6 py-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <Info className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                        📜 Certificate Requirements Guide
                                    </h3>
                                    <p className="text-sm text-blue-800">
                                        <strong>To receive your volunteer certificates, you must upload proof of your participation in completed events.</strong>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                    <span>Upload Your Proof</span>
                                </h4>
                                <p className="text-sm text-blue-700 mb-3">
                                    Click "Upload Proof" on any completed event to submit evidence of your participation.
                                </p>
                                <ul className="text-xs text-blue-600 space-y-1">
                                    <li>• Look for events with "Completed - Requirements Needed" status</li>
                                    <li>• Click the "Upload Proof" button</li>
                                    <li>• Select your files and submit</li>
                                </ul>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-green-200">
                                <h4 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
                                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                    <span>What to Upload</span>
                                </h4>
                                <ul className="text-sm text-green-700 space-y-2">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500">•</span>
                                        <span><strong>Photos from the event</strong> - Show yourself participating</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500">•</span>
                                        <span><strong>Documents</strong> - Certificates, forms, or receipts</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500">•</span>
                                        <span><strong>Clear and legible</strong> - Make sure files are readable</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500">•</span>
                                        <span><strong>Maximum 5 files</strong> - You can upload up to 5 images or PDFs</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-yellow-200">
                                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
                                    <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    <span>What Happens Next</span>
                                </h4>
                                <ul className="text-sm text-yellow-700 space-y-2">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-yellow-500">•</span>
                                        <span>Your proof will be reviewed by our team</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-yellow-500">•</span>
                                        <span>Once approved, your certificate will be generated</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-yellow-500">•</span>
                                        <span>You'll receive a notification when ready</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-yellow-500">•</span>
                                        <span>Download your certificate from your profile</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2 text-sm text-blue-800">
                                <Info className="w-4 h-4" />
                                <span><strong>Tip:</strong> You can hide this guide anytime by clicking "Hide Instructions" in the header above.</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 p-6">
                {viewMode === 'table' ? (
                    <RegisteredEventTable
                        events={filteredEvents}
                        onViewEventDetails={handleViewEventDetails}
                        onStatusUpdate={() => fetchEvents(pagination.currentPage)}
                        loading={loading}
                    />
                ) : (
                    <RegisteredEventCard
                        events={filteredEvents}
                        onViewEventDetails={handleViewEventDetails}
                        onStatusUpdate={() => fetchEvents(pagination.currentPage)}
                        loading={loading}
                    />
                )}
            </div>

            <div className="px-6 pb-6">
                <RegisteredEventPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={fetchEvents}
                    loading={loading}
                />
            </div>

            <EventDetailsModal
                isOpen={showEventDetails}
                onClose={() => setShowEventDetails(false)}
                event={selectedEvent?.event}
                registration={selectedEvent?.registration}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
};

export default RegisteredEventList;
