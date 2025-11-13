import React, { useEffect, useState } from 'react';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Users, 
    FileText, 
    AlertCircle, 
    CheckCircle2,
    UserCheck,
    TrendingUp,
    RefreshCw,
    ArrowRight,
    Bell,
    ClipboardCheck,
    FileCheck,
    Activity,
    MessageSquare,
    Heart,
    Award,
    Target,
    BarChart3,
    BadgeCheck
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import StatCard from '../../components/common/ui/StatCard';
import { useOverviewStore } from '../../store/management/useOverviewStore.js';
import { useAuthStore as useAuthManagementStore } from '../../store/management/useAuthStore.js';
import { useProfileStore as useManagementProfileStore } from '../../store/management/useProfileStore.js';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

const ManagementOverview = () => {
    const [refreshing, setRefreshing] = useState(false);
    
    const { overview, loading, error, getDepartmentOverview, getStaffOverview } = useOverviewStore();
    const { authenticatedManagement, checkAuth } = useAuthManagementStore();
    const { managementCurrentProfile, currentProfile } = useManagementProfileStore();
    const navigate = useNavigate();

    const userRole = authenticatedManagement?.Role?.name;
    const isCoordinator = userRole === 'coordinator' || userRole === 'assistant_coordinator';
    const isStaff = userRole === 'staff';

    // Fetch profile on mount if coordinator
    useEffect(() => {
        const fetchProfile = async () => {
            if (isCoordinator && !managementCurrentProfile && authenticatedManagement) {
                await currentProfile();
            }
        };
        if (authenticatedManagement) {
            fetchProfile();
        } else {
            checkAuth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticatedManagement, isCoordinator, managementCurrentProfile]);

    // Fetch overview data on mount
    useEffect(() => {
        if (isStaff) {
            getStaffOverview();
        } else if (isCoordinator) {
            getDepartmentOverview();
        }
    }, [getDepartmentOverview, getStaffOverview, isStaff, isCoordinator]);

    const handleRefresh = async () => {
        setRefreshing(true);
        if (isStaff) {
            await getStaffOverview();
        } else if (isCoordinator) {
            await getDepartmentOverview();
        }
        setRefreshing(false);
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format('MMM D, YYYY');
    };

    const formatTime = (dateString) => {
        return dayjs(dateString).format('h:mm A');
    };

    const formatDateTime = (dateString) => {
        return dayjs(dateString).format('MMM D, YYYY h:mm A');
    };

    const getTimeUntil = (dateString) => {
        return dayjs(dateString).fromNow();
    };

    // Format number with thousand separators
    const formatNumber = (number) => {
        const num = parseFloat(number) || 0;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="loading loading-spinner loading-lg text-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading overview...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !overview) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!overview) {
        return null;
    }

    // Staff Dashboard View (similar to Director OverviewPage)
    if (isStaff && overview.stats) {
        // Convert overview.stats to match OverviewPage format
        const stats = {
            users: {
                total: overview.stats.totalVolunteers + overview.stats.totalStudents,
                active: overview.stats.totalVolunteers,
                activationRate: overview.stats.totalVolunteers > 0 
                    ? (overview.stats.totalVolunteers / (overview.stats.totalVolunteers + overview.stats.totalStudents)) * 100 
                    : 0
            },
            events: {
                total: overview.stats.totalEvents,
                upcoming: overview.stats.upcomingEvents,
                ongoing: overview.stats.ongoingEvents,
                completed: overview.stats.completedEvents,
                completionRate: overview.stats.totalEvents > 0 
                    ? (overview.stats.completedEvents / overview.stats.totalEvents) * 100 
                    : 0,
                recent: overview.recentEvents?.length || 0
            },
            volunteers: {
                total: overview.stats.totalVolunteers,
                registrations: overview.stats.totalParticipants,
                recentRegistrations: overview.stats.recentRegistrations
            },
            beneficiaries: {
                total: overview.stats.totalBeneficiaries
            },
            attendance: {
                total: overview.stats.totalAttendance,
                recent: overview.stats.recentAttendance
            },
            donations: {
                recent: 0 // Can be added later if needed
            },
            forms: {
                total: 0 // Can be added later if needed
            },
            documents: {
                total: 0 // Can be added later if needed
            },
            distributed: {
                total: 0 // Can be added later if needed
            }
        };

        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">System Overview</h1>
                                <p className="text-gray-600">Comprehensive view of UCLM CARES System statistics and activities</p>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing || loading}
                                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm border border-gray-200">
                                <RefreshCw className={`w-4 h-4 ${refreshing || loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Statistics Cards */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Users"
                                value={formatNumber(stats?.users?.total || 0)}
                                icon={Users}
                                color="bg-blue-500"
                                subtitle={`${formatNumber(stats?.users?.active || 0)} active (${stats?.users?.activationRate?.toFixed(1) || 0}%)`}
                            />
                            <StatCard
                                title="Total Events"
                                value={formatNumber(stats?.events?.total || 0)}
                                icon={Calendar}
                                color="bg-purple-500"
                                subtitle={`${formatNumber(stats?.events?.upcoming || 0)} upcoming, ${formatNumber(stats?.events?.ongoing || 0)} ongoing`}
                            />
                            <StatCard
                                title="Total Volunteers"
                                value={formatNumber(stats?.volunteers?.total || 0)}
                                icon={UserCheck}
                                color="bg-green-500"
                                subtitle={`${formatNumber(stats?.volunteers?.registrations || 0)} registrations`}
                            />
                            <StatCard
                                title="Total Beneficiaries"
                                value={formatNumber(stats?.beneficiaries?.total || 0)}
                                icon={Heart}
                                color="bg-red-500"
                                subtitle="Beneficiaries served"
                            />
                        </div>
                    </div>

                    {/* Secondary Statistics Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    System Metrics
                                </h2>
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                        <p className="text-sm text-gray-600">Total Attendance</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(stats?.attendance?.total || 0)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatNumber(stats?.attendance?.recent || 0)} recent (7d)
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Award className="w-5 h-5 text-purple-600" />
                                        <p className="text-sm text-gray-600">Event Completion</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">
                                        {stats?.events?.completionRate?.toFixed(1) || 0}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatNumber(stats?.events?.completed || 0)} completed events
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <FileText className="w-5 h-5 text-orange-600" />
                                        <p className="text-sm text-gray-600">Total Students</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(overview.stats.totalStudents || 0)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Registered students
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <FileCheck className="w-5 h-5 text-teal-600" />
                                        <p className="text-sm text-gray-600">Total Participants</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(stats?.volunteers?.registrations || 0)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Event registrations
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <BadgeCheck className="w-5 h-5 text-indigo-600" />
                                        <p className="text-sm text-gray-600">Recent Registrations</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(stats?.volunteers?.recentRegistrations || 0)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Last 7 days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Recent Activity (Last 7 Days)
                                </h2>
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                    <p className="text-sm text-gray-600 mb-1">Recent Events</p>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {formatNumber(stats?.events?.recent || 0)}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                    <p className="text-sm text-gray-600 mb-1">Recent Registrations</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {formatNumber(stats?.volunteers?.recentRegistrations || 0)}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                                    <p className="text-sm text-gray-600 mb-1">Ongoing Events</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {formatNumber(overview.stats.ongoingEvents || 0)}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                                    <p className="text-sm text-gray-600 mb-1">Recent Attendance</p>
                                    <p className="text-2xl font-bold text-orange-900">
                                        {formatNumber(stats?.attendance?.recent || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events Section */}
                    {overview.upcomingEvents && overview.upcomingEvents.length > 0 && (
                        <div className="mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Upcoming Events
                                    </h2>
                                    <button
                                        onClick={() => navigate('/management/event-list')}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                        View All <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Event Name
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date & Time
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Participants
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {overview.upcomingEvents.slice(0, 10).map((event) => (
                                                <tr
                                                    key={event.event_id}
                                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                    onClick={() => navigate(`/management/event-list`)}
                                                >
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {event.title}
                                                        </div>
                                                        {event.organizer && (
                                                            <div className="text-xs text-gray-500">
                                                                by {event.organizer}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {formatDate(event.event_started)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatTime(event.event_started)} - {formatTime(event.event_ended)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <MapPin className="w-4 h-4 mr-1" />
                                                            {event.location}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            <span className="font-medium text-purple-600">{event.participants || 0}</span>
                                                            <span className="text-gray-500"> / {event.max_participants}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            event.status === 'Upcoming' 
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : event.status === 'Ongoing'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {event.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Target className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-gray-900">User Engagement</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    The system currently has <strong>{formatNumber(stats?.users?.total || 0)}</strong> registered users, 
                                    with <strong>{formatNumber(stats?.users?.active || 0)}</strong> active accounts 
                                    ({stats?.users?.activationRate?.toFixed(1) || 0}% activation rate).
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-gray-900">Event Management</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    There are <strong>{formatNumber(stats?.events?.total || 0)}</strong> events in the system, 
                                    with <strong>{formatNumber(stats?.events?.upcoming || 0)}</strong> upcoming and 
                                    <strong> {formatNumber(stats?.events?.ongoing || 0)}</strong> currently ongoing.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">Volunteer Participation</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    <strong>{formatNumber(stats?.volunteers?.total || 0)}</strong> volunteers are registered, 
                                    with <strong>{formatNumber(stats?.volunteers?.registrations || 0)}</strong> event registrations 
                                    and <strong>{formatNumber(stats?.attendance?.total || 0)}</strong> attendance records.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Coordinator Dashboard View (Departmental Control Panel)
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                Departmental Control Panel
                            </h1>
                            <p className="text-gray-600">
                                {overview.department?.name || 'Department'} Overview
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing || loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm border border-gray-200">
                            <RefreshCw className={`w-4 h-4 ${refreshing || loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Notifications/Alerts Section */}
                {overview.notifications?.alerts?.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                            <div className="flex items-center">
                                <Bell className="w-5 h-5 text-yellow-600 mr-3" />
                                <div className="flex-1">
                                    {overview.notifications.alerts.map((alert, index) => (
                                        <p key={index} className="text-yellow-800 font-medium">
                                            {alert.message}
                                        </p>
                                    ))}
                                </div>
                                {overview.pendingApprovals?.count > 0 && (
                                    <button
                                        onClick={() => navigate('/management/manage-files?tab=monthly-todo')}
                                        className="ml-4 text-yellow-800 hover:text-yellow-900 font-medium flex items-center"
                                    >
                                        View <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Statistics Cards */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Upcoming Events"
                            value={formatNumber(overview.upcomingEvents?.length || 0)}
                            icon={Calendar}
                            color="bg-blue-500"
                            subtitle={`${formatNumber(overview.upcomingEvents?.filter(e => e.status === 'Upcoming').length || 0)} upcoming, ${formatNumber(overview.upcomingEvents?.filter(e => e.status === 'Ongoing').length || 0)} ongoing`}
                        />
                        <StatCard
                            title="Pending Approvals"
                            value={formatNumber(overview.pendingApprovals?.count || 0)}
                            icon={ClipboardCheck}
                            color="bg-orange-500"
                            subtitle="Requires your attention"
                        />
                        <StatCard
                            title="Volunteer Registrations"
                            value={formatNumber(overview.volunteerOverview?.totalRegistrations || 0)}
                            icon={UserCheck}
                            color="bg-green-500"
                            subtitle={`${formatNumber(overview.volunteerOverview?.recentRegistrations || 0)} in last 7 days`}
                        />
                        <StatCard
                            title="Total Attendance"
                            value={formatNumber(overview.volunteerOverview?.totalAttendance || 0)}
                            icon={Activity}
                            color="bg-purple-500"
                            subtitle={`${formatNumber(overview.volunteerOverview?.recentAttendance || 0)} in last 7 days`}
                        />
                    </div>
                </div>

                {/* Secondary Statistics Section */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Department Metrics
                            </h2>
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <p className="text-sm text-gray-600">Upcoming Events</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(overview.upcomingEvents?.filter(e => e.status === 'Upcoming').length || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Events in your department
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <ClipboardCheck className="w-5 h-5 text-orange-600" />
                                    <p className="text-sm text-gray-600">Pending Tasks</p>
                                </div>
                                <p className="text-2xl font-bold text-orange-600">
                                    {formatNumber(overview.pendingApprovals?.count || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Awaiting approval
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <UserCheck className="w-5 h-5 text-green-600" />
                                    <p className="text-sm text-gray-600">Recent Registrations</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(overview.volunteerOverview?.recentRegistrations || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Last 7 days
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Activity className="w-5 h-5 text-purple-600" />
                                    <p className="text-sm text-gray-600">Recent Attendance</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(overview.volunteerOverview?.recentAttendance || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Last 7 days
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <FileText className="w-5 h-5 text-teal-600" />
                                    <p className="text-sm text-gray-600">Recent Submissions</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(overview.recentSubmissions?.length || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Documents submitted
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Upcoming Events
                            </h2>
                            <button
                                onClick={() => navigate('/management/event-list')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                            >
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>

                        {overview.upcomingEvents?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Event Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Participants
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {overview.upcomingEvents.slice(0, 10).map((event) => (
                                            <tr
                                                key={event.event_id}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => navigate(`/management/event-list`)}
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {event.title}
                                                    </div>
                                                    {event.organizer && (
                                                        <div className="text-xs text-gray-500">
                                                            by {event.organizer}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(event.event_started)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {formatTime(event.event_started)} - {formatTime(event.event_ended)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {event.location}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <span className="font-medium text-purple-600">{event.participants || 0}</span>
                                                        <span className="text-gray-500"> / {event.max_participants}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        event.status === 'Upcoming' 
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {event.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>No upcoming events</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Submissions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-purple-600" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                Recent Submissions
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate('/management/manage-files')}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
                        >
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    {overview.recentSubmissions?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Document
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submitted
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {overview.recentSubmissions.map((submission) => (
                                        <tr
                                            key={submission.document_id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => navigate('/management/manage-files')}
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FileCheck className="w-5 h-5 text-gray-400 mr-3" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {submission.title || 'Untitled Document'}
                                                        </div>
                                                        {submission.description && (
                                                            <div className="text-sm text-gray-500 truncate max-w-md">
                                                                {submission.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDateTime(submission.created_at)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Submitted
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p>No recent submissions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagementOverview;

