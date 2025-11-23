import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Star } from 'lucide-react';
import { 
    getDocumentsByDateForMonitoring, 
    getAllCoordinatorsForMonitoring,
    getDocumentMonitoringCalendar 
} from '../../services/director/documentRequestApprovalService.js';
import dayjs from 'dayjs';

const DocumentMonitoring = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [calendarData, setCalendarData] = useState({});
    const [coordinators, setCoordinators] = useState([]);
    const [documentsByDate, setDocumentsByDate] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Fetch calendar data
    useEffect(() => {
        const fetchCalendarData = async () => {
            setLoading(true);
            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const response = await getDocumentMonitoringCalendar(year, month);
                if (response.success) {
                    setCalendarData(response.data);
                }
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarData();
    }, [currentDate]);

    // Fetch coordinators
    useEffect(() => {
        const fetchCoordinators = async () => {
            try {
                const response = await getAllCoordinatorsForMonitoring();
                if (response.success) {
                    setCoordinators(response.data);
                }
            } catch (error) {
                console.error('Error fetching coordinators:', error);
            }
        };

        fetchCoordinators();
    }, []);

    // Fetch documents when date is selected
    useEffect(() => {
        if (selectedDate) {
            const fetchDocuments = async () => {
                setLoading(true);
                try {
                    const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
                    const response = await getDocumentsByDateForMonitoring(dateStr);
                    if (response.success) {
                        setDocumentsByDate(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching documents:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchDocuments();
        }
    }, [selectedDate]);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
        setDocumentsByDate([]);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
        setDocumentsByDate([]);
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);
    };

    const getDayStatus = (day) => {
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return calendarData[dateKey] || null;
    };

    const getDayColor = (day) => {
        const status = getDayStatus(day);
        if (!status) return 'bg-white border-gray-200';
        
        if (status.status === 'pending') {
            return 'bg-orange-50 border-orange-300';
        } else if (status.status === 'approved') {
            return 'bg-green-50 border-green-300';
        }
        return 'bg-white border-gray-200';
    };

    // Filter coordinators based on search
    const filteredCoordinators = useMemo(() => {
        if (!searchTerm) return coordinators;
        const term = searchTerm.toLowerCase();
        return coordinators.filter(coord => 
            coord.fullname.toLowerCase().includes(term) ||
            coord.department.department_name.toLowerCase().includes(term)
        );
    }, [coordinators, searchTerm]);

    // Get coordinators who submitted on selected date
    const submittedCoordinators = useMemo(() => {
        if (!selectedDate || documentsByDate.length === 0) return [];
        
        const coordinatorMap = new Map();
        documentsByDate.forEach(doc => {
            const key = doc.coordinator.coordinator_id;
            if (!coordinatorMap.has(key)) {
                coordinatorMap.set(key, {
                    ...doc.coordinator,
                    documents: [],
                    hasPending: false,
                    hasApproved: false
                });
            }
            const coordinator = coordinatorMap.get(key);
            coordinator.documents.push(doc);
            if (doc.approval_status === 'pending') coordinator.hasPending = true;
            if (doc.approval_status === 'approved') coordinator.hasApproved = true;
        });

        return Array.from(coordinatorMap.values());
    }, [documentsByDate, selectedDate]);

    // Get coordinators who haven't submitted on selected date
    const notSubmittedCoordinators = useMemo(() => {
        if (!selectedDate) return filteredCoordinators;
        
        const submittedIds = new Set(submittedCoordinators.map(c => c.coordinator_id));
        return filteredCoordinators.filter(coord => !submittedIds.has(coord.coordinator_id));
    }, [selectedDate, submittedCoordinators, filteredCoordinators]);

    // Group coordinators by first letter for alphabetical index
    const coordinatorsByLetter = useMemo(() => {
        const grouped = {};
        filteredCoordinators.forEach(coord => {
            const firstLetter = coord.lastname.charAt(0).toUpperCase();
            if (!grouped[firstLetter]) {
                grouped[firstLetter] = [];
            }
            grouped[firstLetter].push(coord);
        });
        return grouped;
    }, [filteredCoordinators]);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Calendar Section */}
                <div className="flex-1 m-4">
                    <div className="bg-white rounded-2xl shadow-md w-full h-full flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b">
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Document Monitoring</h1>
                                <p className="text-sm text-gray-600">Track coordinator document submissions</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-6 bg-white">
                            <button 
                                onClick={handlePreviousMonth} 
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h2 className="text-lg font-semibold">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <button 
                                onClick={handleNextMonth} 
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Legend */}
                        <div className="px-6 pb-4 flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-50 border border-orange-300 rounded"></div>
                                <span>Pending Documents</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-50 border border-green-300 rounded"></div>
                                <span>Approved Documents</span>
                            </div>
                        </div>

                        <div className="flex-1 px-6 pb-6 overflow-y-auto">
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {weekDays.map(day => (
                                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                                    <div key={`empty-${i}`} className="h-20"></div>
                                ))}

                                {Array.from({ length: daysInMonth }, (_, i) => {
                                    const day = i + 1;
                                    const status = getDayStatus(day);
                                    const isSelected = selectedDate && 
                                        selectedDate.getDate() === day &&
                                        selectedDate.getMonth() === currentDate.getMonth() &&
                                        selectedDate.getFullYear() === currentDate.getFullYear();

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => handleDateClick(day)}
                                            className={`h-20 p-1 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors relative ${getDayColor(day)} ${
                                                isSelected ? 'ring-2 ring-blue-400' : ''
                                            }`}
                                        >
                                            <div className="text-sm font-medium">{day}</div>
                                            {status && (
                                                <div className="mt-1 flex items-center gap-1">
                                                    {status.pending_count > 0 && (
                                                        <span className="text-[10px] bg-orange-500 text-white px-1 rounded">
                                                            {status.pending_count}
                                                        </span>
                                                    )}
                                                    {status.approved_count > 0 && (
                                                        <span className="text-[10px] bg-green-500 text-white px-1 rounded">
                                                            {status.approved_count}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Book Sidebar */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Filter coordinator names"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Alphabetical Index */}
                    <div className="px-4 py-2 border-b border-gray-200 flex flex-wrap gap-1 text-xs">
                        {alphabet.map(letter => (
                            <button
                                key={letter}
                                className={`px-1 py-0.5 hover:bg-gray-100 rounded ${
                                    coordinatorsByLetter[letter] ? 'text-gray-700' : 'text-gray-300'
                                }`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>

                    {/* Coordinators List */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedDate ? (
                            <>
                                {/* Submitted Coordinators Section */}
                                <div className="border-b border-gray-200">
                                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-700">
                                            Submitted ({submittedCoordinators.length})
                                        </h3>
                                    </div>
                                    <div className="max-h-[50%] overflow-y-auto">
                                        {submittedCoordinators.length > 0 ? (
                                            submittedCoordinators.map((coord) => (
                                                <div
                                                    key={coord.coordinator_id}
                                                    className="p-3 border-b border-gray-100 hover:bg-yellow-50 cursor-pointer transition-colors"
                                                    onClick={() => setSelectedCoordinator(coord)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Star className={`w-4 h-4 ${
                                                                selectedCoordinator?.coordinator_id === coord.coordinator_id 
                                                                    ? 'fill-yellow-400 text-yellow-400' 
                                                                    : 'text-gray-300'
                                                            }`} />
                                                            <span className="text-sm font-medium text-gray-800">
                                                                {coord.lastname}, {coord.firstname}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {coord.hasPending && (
                                                                <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full">
                                                                    {coord.documents.filter(d => d.approval_status === 'pending').length}
                                                                </span>
                                                            )}
                                                            {coord.hasApproved && (
                                                                <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                                                                    {coord.documents.filter(d => d.approval_status === 'approved').length}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {coord.department.department_name}
                                                    </div>
                                                    {selectedCoordinator?.coordinator_id === coord.coordinator_id && (
                                                        <div className="mt-2 space-y-1">
                                                            {coord.documents.map((doc) => (
                                                                <div key={doc.document_id} className="text-xs bg-white p-2 rounded border border-gray-200">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-medium">{doc.title}</span>
                                                                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                                                                            doc.approval_status === 'pending' 
                                                                                ? 'bg-orange-100 text-orange-700' 
                                                                                : doc.approval_status === 'approved'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : 'bg-gray-100 text-gray-700'
                                                                        }`}>
                                                                            {doc.approval_status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-sm text-gray-500">
                                                No submissions on this date
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Not Submitted Coordinators Section */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-700">
                                            Not Submitted ({notSubmittedCoordinators.length})
                                        </h3>
                                    </div>
                                    <div className="max-h-[50%] overflow-y-auto">
                                        {notSubmittedCoordinators.length > 0 ? (
                                            notSubmittedCoordinators.map((coord) => (
                                                <div
                                                    key={coord.coordinator_id}
                                                    className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Star className="w-4 h-4 text-gray-300" />
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {coord.lastname}, {coord.firstname}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {coord.department.department_name}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-sm text-gray-500">
                                                All coordinators have submitted
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">
                                Click a date on the calendar to view coordinators
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentMonitoring;

