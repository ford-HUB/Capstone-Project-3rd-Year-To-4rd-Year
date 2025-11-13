import models from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Performance monitoring utilities for the event matching system
 */

export const logPerformanceMetrics = (operation, duration, metadata = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[PERFORMANCE] ${operation}: ${duration}ms`, {
        timestamp,
        ...metadata
    });
    
    // Log slow operations
    if (duration > 5000) {
        console.warn(`[SLOW_OPERATION] ${operation} took ${duration}ms`, metadata);
    }
};

export const measureAsyncOperation = async (operation, operationName, metadata = {}) => {
    const startTime = Date.now();
    try {
        const result = await operation();
        const duration = Date.now() - startTime;
        logPerformanceMetrics(operationName, duration, { ...metadata, success: true });
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        logPerformanceMetrics(operationName, duration, { ...metadata, success: false, error: error.message });
        throw error;
    }
};

export const getSystemStats = async () => {
    try {
        const { Event, Volunteer, MatchedEvent, EventRegistration } = models;
        
        const stats = await Promise.all([
            Event.count(),
            Volunteer.count(),
            MatchedEvent.count(),
            EventRegistration.count(),
            Event.count({ where: { status: 'Upcoming' } }),
            Event.count({ where: { status: 'Ongoing' } }),
            Event.count({ where: { status: 'Completed' } })
        ]);

        return {
            totalEvents: stats[0],
            totalVolunteers: stats[1],
            totalMatchedRecords: stats[2],
            totalRegistrations: stats[3],
            upcomingEvents: stats[4],
            ongoingEvents: stats[5],
            completedEvents: stats[6],
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Failed to get system stats:', error);
        return null;
    }
};

export const getMatchingPerformanceStats = async () => {
    try {
        const { MatchedEvent } = models;
        
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const stats = await Promise.all([
            // Recent matches (last hour)
            MatchedEvent.count({
                where: {
                    last_updated: { [Op.gte]: oneHourAgo }
                }
            }),
            // Matches today
            MatchedEvent.count({
                where: {
                    last_updated: { [Op.gte]: oneDayAgo }
                }
            }),
            // Average match count per volunteer
            MatchedEvent.findAll({
                attributes: [
                    [models.sequelize.fn('AVG', models.sequelize.fn('array_length', models.sequelize.col('matched_ids'), 1)), 'avg_matched_events'],
                    [models.sequelize.fn('AVG', models.sequelize.fn('array_length', models.sequelize.col('recommendation_ids'), 1)), 'avg_recommendations']
                ],
                raw: true
            })
        ]);

        return {
            recentMatches: stats[0],
            dailyMatches: stats[1],
            averageMatchedEvents: parseFloat(stats[2][0]?.avg_matched_events || 0),
            averageRecommendations: parseFloat(stats[2][0]?.avg_recommendations || 0),
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Failed to get matching performance stats:', error);
        return null;
    }
};

export const logSystemHealth = async () => {
    try {
        const systemStats = await getSystemStats();
        const matchingStats = await getMatchingPerformanceStats();
        
        console.log('=== SYSTEM HEALTH REPORT ===');
        console.log('System Stats:', systemStats);
        console.log('Matching Performance:', matchingStats);
        console.log('============================');
        
        return { systemStats, matchingStats };
    } catch (error) {
        console.error('Failed to log system health:', error);
        return null;
    }
};
