import React from 'react';
import { 
    Clock, 
    Calendar, 
    MapPin, 
    Users, 
    Award, 
    Timer, 
    CheckCircle, 
    AlertCircle, 
    ChevronRight,
    Download,
    Filter,
    Search,
    Star,
    TrendingUp,
    Activity
} from 'lucide-react';
import { useEventStore } from '../../../store/participant/useEventStore.js';
import dayjs from 'dayjs';

const DetailedParticipationHistory = () => {
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
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortBy, setSortBy] = React.useState('newest');
    const [filterBy, setFilterBy] = React.useState('all');

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

    const formatDate = (dateString) => {
        return dayjs(dateString).format('MMM DD, YYYY');
    };

    const formatDateTime = (dateString) => {
        return dayjs(dateString).format('MMM DD, YYYY [at] h:mm A');
    };

    const formatDuration = (startDate, endDate) => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const diff = end.diff(start);
        const duration = dayjs.duration(diff);
        
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        
        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        
        return parts.length > 0 ? parts.join(' ') : '0m';
    };

    // Filter and search functionality
    const filteredData = React.useMemo(() => {
        let filtered = historyData;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.event_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort filter
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.event_started) - new Date(a.event_started);
                case 'oldest':
                    return new Date(a.event_started) - new Date(b.event_started);
                case 'longest':
                    return (b.time_spent_hours || 0) - (a.time_spent_hours || 0);
                case 'shortest':
                    return (a.time_spent_hours || 0) - (b.time_spent_hours || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [historyData, searchTerm, sortBy]);

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
        <div className="h-screen pb-10 bg-gray-50 overflow-y-scroll">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Activity className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Participation History</h1>
                            <p className="text-gray-600 mt-1">
                                Detailed view of your completed volunteer activities
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events, locations, or descriptions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        {/* Sort */}
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="longest">Longest Duration</option>
                                <option value="shortest">Shortest Duration</option>
                            </select>
                        </div>
                    </div>
                </div>


                {/* History List */}
                <div className="space-y-6">
                    {filteredData.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Participation History</h3>
                            <p className="text-gray-600">
                                {searchTerm 
                                    ? 'No events match your search criteria.'
                                    : 'You haven\'t completed any events yet. Start participating to build your history!'
                                }
                            </p>
                        </div>
                    ) : (
                        filteredData.map((item, index) => (
                            <div key={item.registration_id || index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Award className="w-5 h-5 text-green-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {item.event_title}
                                                </h3>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Completed
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {item.event_description}
                                            </p>
                                        </div>
                                        
                                        {/* Time Badge */}
                                        {item.time_spent_formatted && (
                                            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                                                <Timer className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-semibold text-blue-800">
                                                    {item.time_spent_formatted}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Event Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">Event Date</p>
                                                <p>{formatDate(item.event_started)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">Duration</p>
                                                <p>{formatDuration(item.event_started, item.event_ended)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">Location</p>
                                                <p className="truncate">{item.location}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">Participants</p>
                                                <p>{item.event_details?.participants || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Categories and Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.event_details?.categories?.map((category, idx) => (
                                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {category.name}
                                            </span>
                                        ))}
                                        {item.event_details?.departments?.map((dept, idx) => (
                                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {dept.department_name}
                                            </span>
                                        ))}
                                        {item.event_details?.organizer && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {item.event_details.organizer.name}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Attendance Details */}
                                    {item.attendance && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                                <Activity className="w-4 h-4 mr-2" />
                                                Attendance Record
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Time In</p>
                                                    <p className="text-sm text-gray-900">{formatDateTime(item.attendance.time_in)}</p>
                                                </div>
                                                {item.attendance.time_out && (
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Time Out</p>
                                                        <p className="text-sm text-gray-900">{formatDateTime(item.attendance.time_out)}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Method</p>
                                                    <p className="text-sm text-gray-900 capitalize">{item.attendance.method}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
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

export default DetailedParticipationHistory;
