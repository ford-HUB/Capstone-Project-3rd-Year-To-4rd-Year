import React from 'react';
import { Users, Loader2 } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useBeneficiaryEventStore } from '../../../store/beneficiary/useBeneficiaryEventStore.js';
import AttendanceRecordCard from '../../common/attendance/AttendanceRecordCard.jsx';
import AttendanceEmptyState from '../../common/attendance/AttendanceEmptyState.jsx';

const BeneficiaryParticipationHistory = () => {
    const { getBeneficiaryParticipationHistory } = useBeneficiaryEventStore();

    const [isLoading, setIsLoading] = React.useState(true);
    const [hasNextPage, setHasNextPage] = React.useState(false);
    const [allRecords, setAllRecords] = React.useState([]);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);

    const mapToAttendanceCard = (item) => {
        const category = item?.event_details?.categories?.[0]?.name || 'General';
        return {
            attendance_id: item.registration_id,
            time_in: item.attendance?.time_in || null,
            time_out: item.attendance?.time_out || null,
            status: 'completed',
            attendance_date: item.attendance?.time_in || item.event_started,
            event: {
                title: item.event_title,
                location: item.location,
                category: category
            }
        };
    };

    const fetchPage = async (page = 1) => {
        setIsLoading(true);
        const res = await getBeneficiaryParticipationHistory(page, 10);
        if (res?.success) {
            const mapped = (res.data || []).map(mapToAttendanceCard);
            setAllRecords(prev => page === 1 ? mapped : [...prev, ...mapped]);
            setTotalRecords(res.pagination?.totalRecords || 0);
            setHasNextPage(page < (res.pagination?.totalPages || 1));
            setCurrentPage(page);
        } else {
            setAllRecords([]);
            setTotalRecords(0);
            setHasNextPage(false);
        }
        setIsLoading(false);
    };

    const loadMoreRecords = () => {
        if (hasNextPage) {
            fetchPage(currentPage + 1);
        }
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    <span className="ml-3 text-gray-600">Loading attendance records...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Attended Records</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{totalRecords} total records</span>
                </div>
            </div>

            {/* Records List */}
            {allRecords.length === 0 ? (
                <AttendanceEmptyState
                    selectedMonth={''}
                    selectedYear={''}
                    onClearFilters={() => fetchPage(1)}
                />
            ) : (
                <div className="relative">
                    <div id="attendance-records-scroll-container" className="max-h-[600px] overflow-y-auto">
                    <InfiniteScroll
                        dataLength={allRecords.length}
                        next={loadMoreRecords}
                        hasMore={hasNextPage}
                        loader={
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                                <span className="ml-2 text-sm text-gray-600">Loading more records...</span>
                            </div>
                        }
                        endMessage={
                            <div className="text-center text-gray-500 py-4">
                                <p>You've reached the end of your attendance records</p>
                            </div>
                        }
                        scrollableTarget="attendance-records-scroll-container"
                        className="space-y-4"
                    >
                        {allRecords.map((record) => (
                            <AttendanceRecordCard 
                                key={record.attendance_id} 
                                record={record} 
                            />
                        ))}
                    </InfiniteScroll>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeneficiaryParticipationHistory;
