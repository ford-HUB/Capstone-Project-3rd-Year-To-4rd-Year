import models from '../models/index.js';
import { Op } from 'sequelize';
import { updateVolunteerMatchedEvents, notifyEventMatchingProgress } from '../socket.js';
import { matchInterestedEvents } from '../controllers/ai/match.controller.js';
import { db } from '../config/db.js';

/**
 * Compute matches for ONE volunteer and OVERWRITE their MatchedEvent record.
 */
export const runMatchingAI = async (volunteer_id) => {
    const startTime = Date.now();
    
    try {
        // Notify progress start
        notifyEventMatchingProgress(volunteer_id, { status: 'started', message: 'Starting AI matching...' });

        const {
            Volunteer,
            CampusUsers,
            Event,
            Department,
            Course,
            YearLevel,
            Category,
            Organizer,
            StrandCourse
        } = models;

        // 1) Load volunteer + profile context
        const volunteer = await Volunteer.findOne({
            where: { volunteer_id },
            include: [
                { 
                    model: CampusUsers,
                    attributes: { exclude: ['gy_id'] }
                },
                { model: Department },
                { model: Course },
                { model: YearLevel },
                { model: StrandCourse }
            ],
        });

        if (!volunteer || !Array.isArray(volunteer.interested_events)) {
            notifyEventMatchingProgress(volunteer_id, { status: 'failed', message: 'No interests found' });
            return null;
        }

        notifyEventMatchingProgress(volunteer_id, { status: 'processing', message: 'Loading events...' });

        // 2) Load events with metadata (only active events)
        const events = await Event.findAll({
            where: {
                status: { [Op.ne]: 'Completed' }
            },
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Department, through: { attributes: [] } },
                { model: Organizer },
            ],
        })

        const formatEvents = events.map((evt) => ({
            event_id: evt.event_id,
            title: evt.title,
            description: evt.description,
            categories: (evt.Categories || []).map((c) => c.name),
            department: (evt.Categories.some(c => c.name === 'School') ? '' : evt.Departments.department_name) || '',
            event_status: evt.status,
        }));

        const volunteerInterests = {
            selectedInterests: volunteer.interested_events, // TEXT[]
            ByDepartment: volunteer.Department?.department_name || '',
        };

        notifyEventMatchingProgress(volunteer_id, { status: 'processing', message: 'AI matching in progress...' });

        // 3) Call your AI with timeout
        const ai = await Promise.race([
            matchInterestedEvents(volunteerInterests, formatEvents),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('AI matching timeout')), 30000)
            )
        ]);
        
        const matchedIds = ai?.matchedIds ?? [];
        const recommendationIds = ai?.recommendations ?? [];
        const hasResults = matchedIds.length > 0 || recommendationIds.length > 0;

        notifyEventMatchingProgress(volunteer_id, { status: 'processing', message: 'Saving results...' });

        // 4) Upsert stored arrays. For existing records, avoid overwriting
        // non-empty matches with an empty result from a transient AI run.
        const [record, created] = await models.MatchedEvent.findOrCreate({
            where: { volunteer_id },
            defaults: {
                matched_ids: matchedIds,
                recommendation_ids: recommendationIds,
                last_updated: new Date(),
                cache_expires_at: new Date(Date.now() + 3600000) // 1 hour cache
            },
        })

        if (!created) {
            const updatePayload = {
                last_updated: new Date(),
                cache_expires_at: new Date(Date.now() + 3600000) // 1 hour cache
            };

            if (hasResults) {
                updatePayload.matched_ids = matchedIds;
                updatePayload.recommendation_ids = recommendationIds;
            }

            await record.update(updatePayload);
        }

        const duration = Date.now() - startTime;
        console.log(`Matching completed for volunteer ${volunteer_id} in ${duration}ms`);

        // 5) Emit real-time update
        const matchedEvents = await Event.findAll({
            where: { event_id: { [Op.in]: matchedIds } },
            include: [
                { model: Department, through: { attributes: [] } },
                { model: Category, through: { attributes: [] } },
                { model: Organizer }
            ]
        });

        const recommendationEvents = await Event.findAll({
            where: { event_id: { [Op.in]: recommendationIds } },
            include: [
                { model: Department, through: { attributes: [] } },
                { model: Category, through: { attributes: [] } },
                { model: Organizer }
            ]
        });

        updateVolunteerMatchedEvents(volunteer_id, matchedEvents, recommendationEvents);
        notifyEventMatchingProgress(volunteer_id, { status: 'completed', message: `Found ${matchedIds.length} matches` });

        return true;
    } catch (error) {
        console.error(`Matching failed for volunteer ${volunteer_id}:`, error);
        notifyEventMatchingProgress(volunteer_id, { status: 'failed', message: error.message });
        return false;
    }
};


/**
 * On event create/update: refresh matches for ONLY volunteers
 * whose interests OR departments intersect the event.
 */

export const runMatchingAIForEvent = async (event_id) => {
    const startTime = Date.now();
    
    try {
        const { Event, Category, Department, Volunteer } = models;

        // 1) Get updated event with rels
        const event = await Event.findByPk(event_id, {
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Department, through: { attributes: [] } },
            ],
        });

        if (!event) {
            console.log('Event not found:', event_id);
            return 0;
        }

        const eventCategories = (event.Categories || []).map((c) => c.name);
        const eventDepartmentIds = (event.Departments || []).map(
            (d) => d.department_id
        );

        // 2) Find potentially affected volunteers
        const whereOr = [];

        if (eventCategories.length) {
            // First try exact overlap
            whereOr.push({ interested_events: { [Op.overlap]: eventCategories } });
            
            // Then try partial matches using PostgreSQL array functions
            for (const category of eventCategories) {
                whereOr.push({
                    [Op.and]: [
                        { interested_events: { [Op.ne]: null } },
                        {
                            [Op.or]: [
                                // Check if any interest contains the category as a substring
                                db.where(
                                    db.fn('array_to_string', 
                                        db.col('interested_events'), 
                                        '|'
                                    ),
                                    { [Op.iLike]: `%${category}%` }
                                ),
                                // Check if any interest starts with the category
                                db.where(
                                    db.fn('array_to_string', 
                                        db.col('interested_events'), 
                                        '|'
                                    ),
                                    { [Op.iLike]: `${category}%` }
                                )
                            ]
                        }
                    ]
                });
            }
        }
        if (eventDepartmentIds.length) {
            whereOr.push({ department_id: { [Op.in]: eventDepartmentIds } });
        }

        if (!whereOr.length) {
            console.log('No matching criteria found for event:', event_id);
            return 0;
        }

        const volunteers = await Volunteer.findAll({ 
            where: { [Op.or]: whereOr },
            limit: 50 // Limit to prevent overwhelming the system
        });

        console.log(`Processing ${volunteers.length} volunteers for event ${event_id}`);

        // 3) Process volunteers in smaller batches to avoid overwhelming OpenAI
        const batchSize = 3;
        let processedCount = 0;

        for (let i = 0; i < volunteers.length; i += batchSize) {
            const batch = volunteers.slice(i, i + batchSize);
            
            // Process batch with timeout and error handling
            const batchPromises = batch.map(async (volunteer) => {
                try {
                    const result = await Promise.race([
                        runMatchingAI(volunteer.volunteer_id),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Batch timeout')), 45000)
                        )
                    ]);
                    return result ? 1 : 0;
                } catch (error) {
                    console.error(`Matching failed for volunteer ${volunteer.volunteer_id}:`, error.message);
                    return 0;
                }
            });

            const batchResults = await Promise.all(batchPromises);
            processedCount += batchResults.reduce((sum, result) => sum + result, 0);

            // Rate limiting: wait between batches
            if (i + batchSize < volunteers.length) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        const duration = Date.now() - startTime;
        console.log(`Event matching completed for ${event_id}: ${processedCount}/${volunteers.length} volunteers processed in ${duration}ms`);

        return processedCount;
    } catch (error) {
        console.error(`Event matching failed for ${event_id}:`, error);
        return 0;
    }
};
