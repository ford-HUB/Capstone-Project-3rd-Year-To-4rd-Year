import { useState, useEffect } from 'react';
import { useBeneficiaryEventStore } from '../store/beneficiary/useBeneficiaryEventStore.js';
import toast from 'react-hot-toast';
import { getDefaultFilterValues } from '../utils/attendanceUtils.js';

/**
 * Custom hook for managing attendance records data
 */
export const useAttendanceRecords = () => {
    const { getAttendanceRecords } = useBeneficiaryEventStore();
    
    // State management
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isFilterLoading, setIsFilterLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [allRecords, setAllRecords] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    
    // Filter state - default to current month/year
    const defaultFilters = getDefaultFilterValues();
    const [selectedMonth, setSelectedMonth] = useState(defaultFilters.month);
    const [selectedYear, setSelectedYear] = useState(defaultFilters.year);

    // Load attendance records with filters
    const loadAttendanceRecordsWithFilters = async (page = 1, isInitial = false, month = selectedMonth, year = selectedYear) => {
        try {
            // Set appropriate loading state
            if (isInitial) {
                if (!isFilterLoading) setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            const result = await getAttendanceRecords(page, 10, month || null, year || null);
            
            if (result.success) {
                // Update records
                if (isInitial) {
                    setAllRecords(result.data || []);
                } else {
                    setAllRecords(prev => [...prev, ...(result.data || [])]);
                }
                
                // Update pagination
                setTotalRecords(result.pagination?.totalRecords || 0);
                setHasNextPage(page < (result.pagination?.totalPages || 1));
                setCurrentPage(page);
            } else {
                toast.error('Failed to load attendance records');
            }
        } catch (error) {
            console.error('Error loading attendance records:', error);
            toast.error('Failed to load attendance records');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
            setIsFilterLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (newMonth = selectedMonth, newYear = selectedYear) => {
        setAllRecords([]);
        setCurrentPage(1);
        setHasNextPage(true);
        setIsFilterLoading(true);
        loadAttendanceRecordsWithFilters(1, true, newMonth, newYear);
    };

    // Load more records for infinite scroll
    const loadMoreRecords = () => {
        if (!isLoadingMore && hasNextPage) {
            loadAttendanceRecordsWithFilters(currentPage + 1, false, selectedMonth, selectedYear);
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedMonth('');
        setSelectedYear('');
        handleFilterChange('', '');
    };

    // Load initial data
    useEffect(() => {
        loadAttendanceRecordsWithFilters(1, true, selectedMonth, selectedYear);
    }, []);

    return {
        // State
        isLoading,
        isLoadingMore,
        isFilterLoading,
        hasNextPage,
        currentPage,
        allRecords,
        totalRecords,
        selectedMonth,
        selectedYear,
        
        // Actions
        setSelectedMonth,
        setSelectedYear,
        handleFilterChange,
        loadMoreRecords,
        clearFilters,
        loadAttendanceRecordsWithFilters
    };
};
