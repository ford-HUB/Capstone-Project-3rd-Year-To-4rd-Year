import React, { useState, useEffect, useCallback } from "react";
import { Check, Clock, Filter, Search, Users, Calendar, X } from "lucide-react";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { useScanQRAttendanceStore } from "../../../../store/common/useScanQRAttendanceStore.js";
import { getTotalHours } from "../../../../utils/partcipantUtils.js";
import { GetFirstLetter } from "../../../../utils/GetFirstLetter.js";
import { useAuthStore as useAuthManagementStore } from "../../../../store/management/useAuthStore.js";
import { useAuthStore as useAuthDirectorStore } from "../../../../store/director/useAuthStore.js";
import { getAllDepartments } from "../../../../services/common/departmentService.js";
import dayjs from "dayjs";

const AttendanceRecords = () => {
  const { getAllAttendanceRecords } = useScanQRAttendanceStore();
  
  // Auth stores
  const { authenticatedManagement } = useAuthManagementStore();
  const { authenticatedDirector } = useAuthDirectorStore();

  const [attendanceData, setAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [statistics, setStatistics] = useState({
    participantTypeCounts: [],
    statusCounts: { present_count: 0, in_progress_count: 0 },
    totalRecords: 0
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    participant_type: '',
    status: '',
    department: '',
    date_from: '',
    date_to: '',
    search_term: ''
  });

  const participantTypes = [
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'staff', label: 'Staff' },
    { value: 'coordinator', label: 'Coordinator' },
    { value: 'assistant_coordinator', label: 'Assistant Coordinator' },
    { value: 'director', label: 'Director' },
    { value: 'beneficiary', label: 'Beneficiary' }
  ];

  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'failed_to_attend', label: 'Failed to Attend' }
  ];

  // Determine user role
  const userRole = authenticatedManagement?.Role?.name || authenticatedDirector?.Role?.name;
  const isCoordinator = userRole === 'coordinator';
  const isAssistantCoordinator = userRole === 'assistant_coordinator';
  const isStaff = userRole === 'staff';
  const isDirector = userRole === 'director';
  
  // Show department filter only for staff and director
  const showDepartmentFilter = isStaff || isDirector;

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const response = await getAllDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const fetchData = useCallback(async (page = currentPage, filterParams = filters) => {
    setLoading(true);
    try {
      console.log('[AttendanceRecords] Fetching data:', { page, filterParams });
      const response = await getAllAttendanceRecords(page, limitPerPage, filterParams);

      console.log('[AttendanceRecords] Response:', response);

      if (response.success) {
        setAttendanceData(response.attendanceData || []);
        setTotalPages(response.pagination?.totalPages || 0);
        const stats = response.statistics || { participantTypeCounts: [], statusCounts: { present_count: 0, in_progress_count: 0, failed_to_attend_count: 0 }, totalRecords: 0 };
        setStatistics(stats);
      } else {
        console.warn('[AttendanceRecords] Response not successful:', response);
        setAttendanceData([]);
        setTotalPages(0);
        setStatistics({
          participantTypeCounts: [],
          statusCounts: { present_count: 0, in_progress_count: 0, failed_to_attend_count: 0 },
          totalRecords: 0
        });
      }
    } catch (error) {
      console.error('[AttendanceRecords] Error fetching attendance records:', error);
      setAttendanceData([]);
      setTotalPages(0);
      setStatistics({
        participantTypeCounts: [],
        statusCounts: { present_count: 0, in_progress_count: 0, failed_to_attend_count: 0 },
        totalRecords: 0
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, limitPerPage, getAllAttendanceRecords]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load departments on component mount
  useEffect(() => {
    if (showDepartmentFilter) {
      fetchDepartments();
    }
  }, [showDepartmentFilter]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
  };



  const handleSearchChange = (value) => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      const newFilters = { ...filters, search_term: value };
      setFilters(newFilters);
      setCurrentPage(1);
    }, 500); // 500ms delay

    setSearchTimeout(timeout);
  };

  const clearFilters = () => {
    const clearedFilters = {
      participant_type: '',
      status: '',
      department: '',
      date_from: '',
      date_to: '',
      search_term: ''
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');


  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-sm text-gray-600 mt-1">
            View and filter all attendance records
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className={`grid grid-cols-1 gap-4 mb-6 md:grid-cols-5`}>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.totalRecords}</p>
            </div>
          </div>
        </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Check className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Present</p>
                  <p className="text-2xl font-bold text-green-900">{statistics.statusCounts.present_count}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600">In Progress</p>
                  <p className="text-2xl font-bold text-orange-900">{statistics.statusCounts.in_progress_count}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <X className="w-8 h-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-600">Failed to Attend</p>
                  <p className="text-2xl font-bold text-red-900">{statistics.statusCounts.failed_to_attend_count || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {statistics.totalRecords > 0 
                      ? Math.round((statistics.statusCounts.present_count / statistics.totalRecords) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>

      </div>


      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or event..."
                  value={filters.search_term}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Participant Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Participant Type</label>
              <select
                value={filters.participant_type}
                onChange={(e) => handleFilterChange('participant_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {participantTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* Department Filter - Only show for staff and director */}
            {showDepartmentFilter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={departmentsLoading}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
                {departmentsLoading && (
                  <div className="text-xs text-gray-500 mt-1">Loading departments...</div>
                )}
              </div>
            )}

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {attendanceData.map((participant, index) => {
              return (
              <tr key={participant.id} className="hover:bg-gray-50">
                {/* ✅ Participant */}
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <Avatar
                      initials={GetFirstLetter(
                        participant.participantDetails?.participant_name
                      )}
                      bgColor="bg-blue-600"
                      size="lg"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {participant?.participantDetails?.participant_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {participant?.eventDetails?.event_name}
                      </div>
                    </div>
                  </div>
                </td>

                {/* ✅ Participant Type */}
                <td className="py-4 px-6">
                  <div className="flex justify-center">
                    <Badge variant={participant.participant_type || 'default'}>
                      {participant.participant_type === 'volunteer' ? 'Student/Volunteer' :
                       participant.participant_type === 'staff' ? 'Staff' :
                       participant.participant_type === 'coordinator' ? 'Coordinator' :
                       participant.participant_type === 'assistant_coordinator' ? 'Assistant Coor' :
                       participant.participant_type === 'director' ? 'Director' :
                       participant.participant_type === 'beneficiary' ? 'Beneficiary' :
                       participant.participant_type}
                    </Badge>
                  </div>
                </td>

                {/* ✅ Event Type */}
                <td className="py-4 px-6">
                  <div className="flex flex-col justify-center items-center">
                    <Badge variant={participant.eventDetails?.event_type?.toLowerCase() || 'default'}>
                      {participant.eventDetails?.event_type}
                    </Badge>
                    {participant.eventDetails?.event_type === 'School' && participant.eventDetails?.department_name && (
                      <div className="text-xs text-center text-gray-500 mt-1">
                        {participant.eventDetails.department_name}
                      </div>
                    )}
                  </div>
                </td>

                {/* ✅ Time In */}
                <td className="py-4 px-6 text-sm text-gray-900">
                  {participant.time_in
                    ? dayjs(participant.time_in).format("MMMM D, YYYY hh:mm A")
                    : "-"}
                </td>

                {/* ✅ Time Out */}
                <td className="py-4 px-6 text-sm text-gray-900">
                  {participant.time_out
                    ? dayjs(participant.time_out).format("MMMM D, YYYY hh:mm A")
                    : "-"}
                </td>

                {/* ✅ Total Hours */}
                <td className="py-4 px-6 text-sm text-gray-900">
                  {participant.status !== "Present" &&
                  participant.eventDetails?.event_status !== "Completed"
                    ? "In Progress"
                    : participant.eventDetails?.event_status === "Completed" &&
                      participant.status !== "Present"
                    ? "Failed to Timeout"
                    : getTotalHours(participant.time_in, participant.time_out)}
                </td>

                {/* ✅ Status */}
                <td className="py-4 px-6">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        participant.status === "Present"
                          ? "text-green-600"
                          : participant.status === "In Progress"
                          ? "text-orange-600"
                          : participant.status === "Failed to Attend"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {participant.status}
                    </span>

                    {participant.status === "Present" && (
                      <div className="flex items-center text-green-600">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    {participant.status === "In Progress" && (
                      <div className="flex items-center text-orange-500">
                        <Clock className="w-4 h-4" />
                      </div>
                    )}

                    {participant.status === "Failed to Attend" && (
                      <div className="flex items-center text-red-500">
                        <X className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Empty State */}
        {attendanceData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
            <p className="text-gray-600">
              {hasActiveFilters 
                ? "Try adjusting your filters to see more results." 
                : "No attendance records have been recorded yet."
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
      )}

      {/* Pagination */}
      {!loading && attendanceData.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * limitPerPage) + 1} to {Math.min(currentPage * limitPerPage, statistics.totalRecords)} of {statistics.totalRecords} records
          </div>
          <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
            <span className="text-sm text-gray-600 px-3">
          Page {currentPage} of {totalPages}
        </span>
        <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
        >
          Next
        </button>
      </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;
