import React from 'react';
import { Clock, Calendar, MapPin, Users, Award, CheckCircle, XCircle, AlertCircle, Timer } from 'lucide-react';
import { useEventStore } from '../../../store/participant/useEventStore.js';
import dayjs from 'dayjs';

const ParticipantHistory = () => {
    const { getParticipationHistory } = useEventStore();
    const [historyData, setHistoryData] = React.useState([]);
    const [summary, setSummary] = React.useState(null);
    const [pagination, setPagination] = React.useState({
        totalRecords: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const fetchHistoryData = async (page = 1, limit = 10) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getParticipationHistory(page, limit);
            if (response.success) {
                setHistoryData(response.data || []);
                setSummary(response.summary);
                setPagination(response.pagination);
            } else {
                setError('Failed to fetch participation history');
            }
        } catch (err) {
            console.error('Error fetching history:', err);
            setError('An error occurred while fetching your participation history');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchHistoryData();
    }, []);

    const handlePageChange = (newPage) => {
        fetchHistoryData(newPage, pagination.pageSize);
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'registered':
                return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case 'completed':
            case 'completed requirements':
            case 'completed - requirements needed':
                return <Award className="w-5 h-5 text-green-500" />;
            case 'failed':
            case 'failed to attend':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'registered':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
            case 'completed requirements':
            case 'completed - requirements needed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'failed':
            case 'failed to attend':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format('MMM DD, YYYY');
    };

    const formatDateTime = (dateString) => {
        return dayjs(dateString).format('MMM DD, YYYY [at] h:mm A');
    };

    if (isLoading && historyData.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your participation history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading History</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchHistoryData()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <Clock className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Participation History</h1>
                    </div>
                    <p className="text-gray-600">
                        Track your event participation journey and achievements
                    </p>
                </div>

                {/* History List */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Event Participation Timeline</h2>
                    </div>
                    
                    {historyData.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Participation History</h3>
                            <p className="text-gray-600">
                                You haven't participated in any events yet. Start exploring events to build your participation history!
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {historyData.map((item, index) => (
                                <div key={item.registration_id || index} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <Award className="w-5 h-5 text-green-500" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {item.event_title || 'Event Title Not Available'}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                                                        {item.status || 'Completed'}
                                                    </span>
                                                    {item.time_spent_formatted && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                            <Timer className="w-3 h-3 mr-1" />
                                                            {item.time_spent_formatted}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-600 mb-3 line-clamp-2">
                                                {item.event_description || 'No description available'}
                                            </p>
                                            
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Registered: {formatDateTime(item.registration_date)}</span>
                                                </div>
                                                
                                                {item.event_started && (
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Event: {formatDate(item.event_started)}</span>
                                                    </div>
                                                )}
                                                
                                                {item.location && (
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{item.location}</span>
                                                    </div>
                                                )}
                                                
                                                {item.event_details?.participants && (
                                                    <div className="flex items-center space-x-1">
                                                        <Users className="w-4 h-4" />
                                                        <span>{item.event_details.participants} participants</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Event Categories and Department */}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {item.event_details?.categories?.map((category, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                                        {category.name}
                                                    </span>
                                                ))}
                                                {item.event_details?.departments?.map((dept, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                        {dept.department_name}
                                                    </span>
                                                ))}
                                                {item.event_details?.organizer && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                                        {item.event_details.organizer.name}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Attendance Details */}
                                            {item.attendance && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                            Time In: {formatDateTime(item.attendance.time_in)}
                                                        </span>
                                                        {item.attendance.time_out && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                                                Time Out: {formatDateTime(item.attendance.time_out)}
                                                            </span>
                                                        )}
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                                            Method: {item.attendance.method}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
                            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{' '}
                            {pagination.totalRecords} results
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1 || isLoading}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    disabled={isLoading}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                        page === pagination.currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages || isLoading}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantHistory;
