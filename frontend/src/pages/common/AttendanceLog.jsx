import React, { useState } from 'react';
import {
    Calendar,
    FileText,
    Users,
} from 'lucide-react';
import NavigationTabs from '../../components/common/attendance-log/Navigation/NavigationTabs';
import ParticipantsTable from '../../components/common/attendance-log/table/ParticipantTable';
import { useScanQRAttendanceStore } from '../../store/common/useScanQRAttendanceStore.js';
import EventTimeTracker from '../../components/common/attendance-log/ui/EventTimeTracker.jsx';
import EventPeriod from '../../components/common/attendance-log/ui/EventPeriod.jsx';
import LastUpdated from '../../components/common/attendance-log/ui/LastUpdated.jsx';
import AttendanceLogEmptyState from '../../components/common/attendance-log/state/AttendanceLogEmptyState.jsx';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import AttendanceRecords from '../../components/common/attendance-log/ui/AttendanceRecords.jsx';

const AttendanceLog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'attendance-tracker';

    React.useEffect(() => {
        setSearchParams({ tab: 'attendance-tracker' });
    }, []);

    const { getListAttendanceParticipantLog, attendanceListData, loading } =
        useScanQRAttendanceStore();

    React.useEffect(() => {
        const fetchData = async () => {
            await getListAttendanceParticipantLog();
        };
        fetchData();
    }, [attendanceListData?.length]);

    // Toggle participant selection
    const toggleParticipantSelection = (participantId) => {
        setSelectedParticipants((prev) =>
            prev.includes(participantId)
                ? prev.filter((id) => id !== participantId)
                : [...prev, participantId]
        );
    };

    // Select all participants
    const selectAllParticipants = (filteredList) => {
        if (selectedParticipants.length === filteredList.length) {
            setSelectedParticipants([]);
        } else {
            setSelectedParticipants(filteredList.map((p) => p.id));
        }
    };

    // Navigation tabs data
    const navTabs = [
        { key: 'attendance-tracker', icon: Users, label: 'Attendance Tracker' },
        {
            key: 'all-attendance-records',
            icon: FileText,
            label: 'All Attendance Records',
        },
    ];

    const handleTabChange = (tabKey) => {
        setSearchParams({ tab: tabKey });
    };

    if (loading) {
        return <div>please wait a moment...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <NavigationTabs
                tabs={navTabs}
                activeTab={currentTab}
                onTabChange={handleTabChange}
            />
            {currentTab === 'attendance-tracker' && (
                <div>
                    {attendanceListData?.length > 0 ? (
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white rounded-lg shadow-sm mb-6">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        Event Attendance Log
                                    </h1>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <h2 className="text-xl font-semibold">
                                                Today's Events
                                            </h2>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <span>Date:</span>
                                                <span className="font-medium">
                                                    {dayjs().format(
                                                        'MMMM D, YYYY'
                                                    )}
                                                </span>
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <EventPeriod
                                        eventDetails={attendanceListData}
                                    />

                                    {attendanceListData.map(
                                        (attendanceData) => (
                                            <EventTimeTracker
                                                key={attendanceData.id}
                                                timeIn={
                                                    attendanceData.eventDetails
                                                        .event_started
                                                }
                                            />
                                        )
                                    )}

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm text-gray-500">
                                            Live tracking active
                                        </div>
                                        <LastUpdated
                                            eventDetails={attendanceListData}
                                        />
                                    </div>
                                </div>
                            </div>

                            <ParticipantsTable
                                participants={attendanceListData}
                                searchTerm={searchTerm}
                                selectedParticipants={selectedParticipants}
                                onSearchChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                onToggleSelection={toggleParticipantSelection}
                                onSelectAll={selectAllParticipants}
                            />
                        </div>
                    ) : (
                        <AttendanceLogEmptyState />
                    )}
                </div>
            )}

            {currentTab === 'all-attendance-records' && <AttendanceRecords />}
        </div>
    );
};

export default AttendanceLog;
