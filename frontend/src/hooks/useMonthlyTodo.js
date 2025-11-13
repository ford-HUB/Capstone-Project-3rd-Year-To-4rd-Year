import { useEffect } from 'react';
import useMonthlyTodoStore from '../store/common/useMonthlyTodoStore.js';

/**
 * Custom hook for MonthlyTodo functionality
 * Provides easy access to monthlyTodo data and actions
 */
export const useMonthlyTodo = (userRole, autoFetch = true) => {
    const {
        monthlyTodoDocuments,
        monthlyTodoRequirements,
        loading,
        error,
        fetchMonthlyTodoDocumentsForRole,
        clearMonthlyTodoDocuments,
        getFilteredMonthlyTodoDocuments,
        refreshMonthlyTodoDocuments
    } = useMonthlyTodoStore();

    // Auto-fetch when userRole changes
    useEffect(() => {
        if (autoFetch && userRole) {
            fetchMonthlyTodoDocumentsForRole(userRole);
        }
    }, [userRole, autoFetch, fetchMonthlyTodoDocumentsForRole]);

    // Manual fetch function
    const fetchMonthlyTodo = async (filters = {}) => {
        if (userRole) {
            return await fetchMonthlyTodoDocumentsForRole(userRole, filters);
        }
        return false;
    };

    // Get filtered documents
    const getFilteredDocuments = (filters = {}) => {
        return getFilteredMonthlyTodoDocuments(filters);
    };

    // Refresh data
    const refresh = async (filters = {}) => {
        return await refreshMonthlyTodoDocuments(filters);
    };

    // Clear data
    const clear = () => {
        clearMonthlyTodoDocuments();
    };

    return {
        // Data
        documents: monthlyTodoDocuments,
        requirements: monthlyTodoRequirements,
        loading,
        error,
        
        // Actions
        fetchMonthlyTodo,
        getFilteredDocuments,
        refresh,
        clear,
        
        // Computed values
        hasDocuments: monthlyTodoDocuments && monthlyTodoDocuments.length > 0,
        hasRequirements: monthlyTodoRequirements && monthlyTodoRequirements.length > 0,
        documentCount: monthlyTodoDocuments ? monthlyTodoDocuments.length : 0,
        requirementsCount: monthlyTodoRequirements ? monthlyTodoRequirements.length : 0
    };
};

export default useMonthlyTodo;
