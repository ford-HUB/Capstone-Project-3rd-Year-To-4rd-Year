import models from '../models/index.js';
import { Op } from 'sequelize';
import { updateBeneficiaryMatchedEvents, notifyEventMatchingProgress } from '../socket.js';
import { matchBeneficiaryLocationEvents } from '../controllers/ai/match.controller.js';
import { db } from '../config/db.js';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

/**
 * Extract city from address string
 * @param {string} address - Full address string
 * @returns {string} City name
 */
const extractCityFromAddress = (address) => {
    if (!address) return '';
    // Simple city extraction - can be improved with more sophisticated parsing
    const parts = address.split(',').map(part => part.trim());
    // For Philippine addresses, city is usually the first part
    // Format: "City Name, Province, Philippines"
    return parts[0];
};

/**
 * Compute location-based matches for ONE beneficiary
 */
export const runBeneficiaryMatchingAI = async (beneficiary_id) => {
    const startTime = Date.now();
    
    try {
        // Notify progress start (optional - only if socket is available)
        try {
            notifyEventMatchingProgress(beneficiary_id, { status: 'started', message: 'Starting location-based matching...' });
        } catch (error) {
            // Socket not available, continue without notifications
        }

        const {
            Beneficiary,
            Event,
            Category,
            Department,
            Organizer,
        } = models;

        // 1) Load beneficiary with address
        const beneficiary = await Beneficiary.findOne({
            where: { beneficiary_id },
        });


        if (!beneficiary) {
            try {
                notifyEventMatchingProgress(beneficiary_id, { status: 'failed', message: 'Beneficiary not found' });
            } catch (error) {
                // Socket not available, continue without notifications
            }
            return null;
        }

        try {
            notifyEventMatchingProgress(beneficiary_id, { status: 'processing', message: 'Loading events...' });
        } catch (error) {
            // Socket not available, continue without notifications
        }

        // 2) Load all active events that are applicable for beneficiaries (only Upcoming and Ongoing, exclude Completed)
        // Also exclude events where the beneficiary has already registered (pending or approved)
        
        // First, get all event IDs that the beneficiary has already registered for
        const registeredEventIds = await models.EventRegistration.findAll({
            where: {
                participant_id: beneficiary.beneficiary_id,
                participant_type: 'beneficiary',
                status: { [Op.in]: ['pending', 'registered'] }
            },
            attributes: ['event_id'],
            raw: true
        });

        const excludedEventIds = registeredEventIds.map(reg => reg.event_id);
        
        const events = await Event.findAll({
            where: {
                status: { [Op.in]: ['Upcoming', 'Ongoing'] },
                beneficiary_applicable: true,
                ...(excludedEventIds.length > 0 && {
                    event_id: { [Op.notIn]: excludedEventIds }
                })
            },
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Department, through: { attributes: [] } },
                { model: Organizer },
            ],
        });

        if (events.length === 0) {
            try {
                notifyEventMatchingProgress(beneficiary_id, { status: 'completed', message: 'No events with location data found' });
            } catch (error) {
                // Socket not available, continue without notifications
            }
            return true;
        }

        // 3) Format events for AI processing
        const formatEvents = events.map(evt => ({
            event_id: evt.event_id,
            title: evt.title,
            description: evt.description,
            location: evt.location,
            categories: (evt.Categories || []).map((c) => c.name),
            department: (evt.Categories.some(c => c.name === 'School') ? '' : evt.Departments.department_name) || '',
            event_status: evt.status,
        }));


        try {
            notifyEventMatchingProgress(beneficiary_id, { status: 'processing', message: 'AI location matching in progress...' });
        } catch (error) {
            // Socket not available, continue without notifications
        }

        // 4) Use AI for intelligent location-based matching
        // Pass registered events to AI so it can exclude them from recommendations
        const ai = await Promise.race([
            matchBeneficiaryLocationEvents(beneficiary.current_address, formatEvents, excludedEventIds),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('AI matching timeout')), 30000)
            )
        ]);
        
        const nearYouIds = ai?.nearYouIds ?? [];
        const almostNearYouIds = ai?.almostNearYouIds ?? [];
        const recommendationIds = ai?.recommendations ?? [];

        // 5) Get actual event objects from AI results (already filtered by AI)
        const nearYouEvents = events.filter(e => nearYouIds.includes(e.event_id));
        const almostNearYouEvents = events.filter(e => almostNearYouIds.includes(e.event_id));
        const recommendationEvents = events.filter(e => recommendationIds.includes(e.event_id));

        // Additional filtering to ensure no duplicates between near you and recommendations
        const filteredRecommendationEvents = recommendationEvents.filter(
            event => !nearYouIds.includes(event.event_id) && !almostNearYouIds.includes(event.event_id)
        );

        // 6) Create matched event record for beneficiary
        const matchedIds = [...nearYouIds, ...almostNearYouIds];
        const finalRecommendationIds = filteredRecommendationEvents.map(e => e.event_id);

        try {
            notifyEventMatchingProgress(beneficiary_id, { status: 'processing', message: 'Saving results...' });
        } catch (error) {
            // Socket not available, continue without notifications
        }

        // 6) Upsert and OVERWRITE stored arrays
        // First, try to find existing record
        let record = await models.MatchedEvent.findOne({
            where: { beneficiary_id }
        });

        if (record) {
            // Update existing record
            await record.update({
                matched_ids: matchedIds,
                recommendation_ids: finalRecommendationIds,
                near_you_ids: nearYouIds,
                almost_near_you_ids: almostNearYouIds,
                last_updated: new Date(),
                cache_expires_at: new Date(Date.now() + 3600000) // 1 hour cache
            });
        } else {
            // Create new record with explicit null volunteer_id
            record = await models.MatchedEvent.create({
                volunteer_id: null, // Explicitly set to null for beneficiary
                beneficiary_id: beneficiary_id,
                matched_ids: matchedIds,
                recommendation_ids: finalRecommendationIds,
                near_you_ids: nearYouIds,
                almost_near_you_ids: almostNearYouIds,
                last_updated: new Date(),
                cache_expires_at: new Date(Date.now() + 3600000) // 1 hour cache
            });
        }

        const duration = Date.now() - startTime;

        // 7) Emit real-time update
        try {
            updateBeneficiaryMatchedEvents(beneficiary_id, nearYouEvents, almostNearYouEvents, filteredRecommendationEvents);
            notifyEventMatchingProgress(beneficiary_id, { 
                status: 'completed', 
                message: `Found ${nearYouEvents.length} near you, ${filteredRecommendationEvents.length} recommendations` 
            });
        } catch (error) {
            // Socket not available, continue without notifications
        }

        return {
            nearYou: nearYouEvents,
            almostNearYou: almostNearYouEvents,
            recommendations: filteredRecommendationEvents
        };
    } catch (error) {
        console.error(`Beneficiary matching failed for beneficiary ${beneficiary_id}:`, error);
        try {
            notifyEventMatchingProgress(beneficiary_id, { status: 'failed', message: error.message });
        } catch (socketError) {
            // Socket not available, continue without notifications
        }
        return false;
    }
};

/**
 * Trigger beneficiary matching for ALL beneficiaries when a new event is created
 * This function should be called after event creation to refresh all beneficiary matches
 */
export const runBeneficiaryMatchingForAllBeneficiaries = async (event_id) => {
    try {
        const { Beneficiary } = models;
        
        // Get all beneficiaries
        const beneficiaries = await Beneficiary.findAll({
            attributes: ['beneficiary_id'],
            raw: true
        });
        
        let processedCount = 0;
        let successCount = 0;
        
        // Process beneficiaries in batches to avoid overwhelming the system
        const batchSize = 5;
        for (let i = 0; i < beneficiaries.length; i += batchSize) {
            const batch = beneficiaries.slice(i, i + batchSize);
            
            // Process batch in parallel
            const batchPromises = batch.map(async (beneficiary) => {
                try {
                    const result = await runBeneficiaryMatchingAI(beneficiary.beneficiary_id);
                    if (result) {
                        return { success: true, beneficiary_id: beneficiary.beneficiary_id };
                    } else {
                        return { success: false, beneficiary_id: beneficiary.beneficiary_id, error: 'No result returned' };
                    }
                } catch (error) {
                    return { success: false, beneficiary_id: beneficiary.beneficiary_id, error: error.message };
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            
            // Count results
            batchResults.forEach(result => {
                processedCount++;
                if (result.success) {
                    successCount++;
                }
            });
            
            // Add small delay between batches to prevent overwhelming the system
            if (i + batchSize < beneficiaries.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        // Log only if there were failures
        if (successCount < processedCount) {
            console.warn(`[Beneficiary Matching] Bulk matching completed with some failures: ${successCount}/${processedCount} beneficiaries processed successfully`);
        }
        
        return {
            total: processedCount,
            successful: successCount,
            failed: processedCount - successCount
        };
        
    } catch (error) {
        console.error('[Beneficiary Matching] Bulk matching failed:', error.message);
        return {
            total: 0,
            successful: 0,
            failed: 0,
            error: error.message
        };
    }
};

/**
 * Get location-based events for beneficiary
 */
export const getBeneficiaryLocationEvents = async (beneficiary_id) => {
    try {
        const { Beneficiary, Event, Category, Department, Organizer, MatchedEvent } = models;

        const beneficiary = await Beneficiary.findOne({
            where: { beneficiary_id },
        });

        if (!beneficiary) {
            return { success: false, message: 'Beneficiary not found' };
        }

        // Check if we have cached matches
        const record = await MatchedEvent.findOne({ 
            where: { beneficiary_id },
            order: [['last_updated', 'DESC']]
        });


        if (record && record.cache_expires_at > new Date()) {
            // Return cached results
            const nearYouIds = record.near_you_ids || [];
            const almostNearYouIds = record.almost_near_you_ids || [];
            const recommendationIds = record.recommendation_ids || [];

            const allEventIds = [...nearYouIds, ...almostNearYouIds, ...recommendationIds];
            
            // Get all event IDs that the beneficiary has already registered for
            const registeredEventIds = await models.EventRegistration.findAll({
                where: {
                    participant_id: beneficiary.beneficiary_id,
                    participant_type: 'beneficiary',
                    status: { [Op.in]: ['pending', 'registered'] }
                },
                attributes: ['event_id'],
                raw: true
            });

            const excludedEventIds = registeredEventIds.map(reg => reg.event_id);
            
            
            const allEvents = allEventIds.length ? await Event.findAll({
                where: { 
                    event_id: { [Op.in]: allEventIds },
                    beneficiary_applicable: true,
                    status: { [Op.ne]: 'Completed' }, // Exclude completed events
                    ...(excludedEventIds.length > 0 && {
                        event_id: { [Op.notIn]: excludedEventIds }
                    })
                },
                include: [
                    { model: Department, through: { attributes: [] } },
                    { model: Category, through: { attributes: [] } },
                    { model: Organizer }
                ]
            }) : [];
            
            // Filter the cached IDs to exclude registered events
            const filteredNearYouIds = nearYouIds.filter(id => !excludedEventIds.includes(id));
            const filteredAlmostNearYouIds = almostNearYouIds.filter(id => !excludedEventIds.includes(id));
            const filteredRecommendationIds = recommendationIds.filter(id => !excludedEventIds.includes(id));
            
            const nearYouEvents = allEvents.filter(e => filteredNearYouIds.includes(e.event_id));
            const almostNearYouEvents = allEvents.filter(e => filteredAlmostNearYouIds.includes(e.event_id));
            const recommendationEvents = allEvents.filter(e => filteredRecommendationIds.includes(e.event_id));

            return {
                success: true,
                nearYou: nearYouEvents,
                almostNearYou: almostNearYouEvents,
                recommendations: recommendationEvents
            };
        }

        // Run fresh matching
        const result = await runBeneficiaryMatchingAI(beneficiary_id);
        
        if (result && typeof result === 'object') {
            return {
                success: true,
                nearYou: result.nearYou,
                almostNearYou: result.almostNearYou,
                recommendations: result.recommendations.slice(0, 5)
            };
        }

        return { success: false, message: 'Failed to get location-based events' };
    } catch (error) {
        console.error('Error in getBeneficiaryLocationEvents:', error);
        return { success: false, message: 'Internal server error' };
    }
};
