import { openai } from "../../config/openai.js"

/**
 * Match events for beneficiaries based on location using AI embeddings
 * @param {string} beneficiaryAddress - Beneficiary's current address
 * @param {Array} events - Array of events with location data
 * @param {Array} registeredEventIds - Array of event IDs the beneficiary has already registered for
 * @returns {Object} - { matchedIds: [], recommendations: [] }
 */
export const matchBeneficiaryLocationEvents = async (beneficiaryAddress, events, registeredEventIds = []) => {
    try {
        const eventList = events.map((event, i) => {
            return `${i + 1}. Event ID: ${event.event_id} 
            Title: ${event.title}
            Description: ${event.description}
            Location: ${event.location}
            Categories: ${event.categories.join(', ')}
            ${event.department !== '' ? `Department: ${event.department}\n` : ''}
            Status: ${event.event_status}
            `;
        }).join('\n\n');

        const registeredEventsInfo = registeredEventIds.length > 0 
            ? `\nIMPORTANT: The beneficiary has already registered for these event IDs: [${registeredEventIds.join(', ')}]. DO NOT include these events in any of the matching arrays.`
            : '';

        const responseOpenAi = `
        A beneficiary lives at: "${beneficiaryAddress}".
        Here are the available events:
        ${eventList}${registeredEventsInfo}

        Task: Match events based on LOCATION PROXIMITY for the beneficiary.
        
        CRITICAL RULES: 
        1. Each event can ONLY appear in ONE array. No duplicates allowed.
        2. DO NOT include any events that the beneficiary has already registered for (event IDs: [${registeredEventIds.join(', ')}]).
        
        1. Find "near_you_events":
        - Events in the SAME CITY as the beneficiary's address
        - Events in the SAME PROVINCE/REGION as the beneficiary's address
        - Events with locations that are geographically close to the beneficiary
        - Priority: Same city > Same province > Nearby areas
        - EXCLUDE any events the beneficiary has already registered for
        
        2. Find "almost_near_you_events":
        - Events in ADJACENT cities/provinces
        - Events within reasonable travel distance
        - Events in the same metropolitan area or region
        - MUST NOT include any events already in near_you_events
        - EXCLUDE any events the beneficiary has already registered for
        
        3. Find "recommendations":
        - Events that are NOT already in "near_you_events" or "almost_near_you_events"
        - Events that might be of interest for broader participation
        - Events from different cities/provinces that could be worth traveling to
        - Events that are popular or have special significance
        - Only include events with status "upcoming" or "ongoing" (exclude completed events)
        - MUST NOT include any events already in near_you_events or almost_near_you_events
        - EXCLUDE any events the beneficiary has already registered for
        
        4. Consider Philippine geography:
        - Metro Manila cities (Manila, Quezon City, Makati, etc.)
        - Provincial capitals and major cities
        - Regional proximity (NCR, Luzon, Visayas, Mindanao)
        
        5. Always return ALL THREE arrays, even if empty:
        - Each event should appear in ONLY ONE array
        - No event should be duplicated across arrays
        - If an event is in near_you_events, it CANNOT be in almost_near_you_events or recommendations
        - If an event is in almost_near_you_events, it CANNOT be in near_you_events or recommendations
        - If an event is in recommendations, it CANNOT be in near_you_events or almost_near_you_events
        {
            "near_you_events": [1, 2],
            "almost_near_you_events": [3, 4],
            "recommendations": [5, 6]
        }
        
        6. Output strictly valid JSON only. No explanations.
        `;

        const completion = await openai.chat.completions.create({
            model: 'gpt-5-mini',
            messages: [
                { role: 'system', content: 'Hi, I match UCLMCARES events with beneficiary locations using Philippine geography knowledge.' },
                { role: 'user', content: responseOpenAi }
            ]
        });

        const aiResponse = completion.choices[0].message.content;


        let nearYouIds = [];
        let almostNearYouIds = [];
        let recommendations = [];

        try {
            const parsed = JSON.parse(aiResponse);

            if (parsed.near_you_events && Array.isArray(parsed.near_you_events)) {
                nearYouIds = parsed.near_you_events;
            }
            if (parsed.almost_near_you_events && Array.isArray(parsed.almost_near_you_events)) {
                almostNearYouIds = parsed.almost_near_you_events;
            }
            if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
                recommendations = parsed.recommendations;
            }

            // Additional validation to remove duplicates
            const allIds = [...nearYouIds, ...almostNearYouIds, ...recommendations];
            const uniqueIds = [...new Set(allIds)];
            
            if (allIds.length !== uniqueIds.length) {
                console.warn('AI returned duplicate event IDs, filtering them out:', {
                    original: allIds,
                    unique: uniqueIds,
                    duplicates: allIds.filter((id, index) => allIds.indexOf(id) !== index)
                });
                
                // Remove duplicates by keeping only the first occurrence
                const seen = new Set();
                nearYouIds = nearYouIds.filter(id => {
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
                
                almostNearYouIds = almostNearYouIds.filter(id => {
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
                
                recommendations = recommendations.filter(id => {
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
            }
        } catch (e) {
            console.error('Failed to parse beneficiary AI response:', aiResponse);
            return {
                nearYouIds: [],
                almostNearYouIds: [],
                recommendations: []
            };
        }


        return {
            nearYouIds,
            almostNearYouIds,
            recommendations
        };
    } catch (err) {
        console.error('Error in matchBeneficiaryLocationEvents:', err);
        return {
            nearYouIds: [],
            almostNearYouIds: [],
            recommendations: []
        };
    }
};

export const matchInterestedEvents = async (interest, events) => {
    try {
        const eventList = events.map((event, i) => {
            return `${i + 1}. Event ID: ${event.event_id} Title: ${event.title}
            Description: ${event.description}
            Categories: ${event.categories.join(', ')}
            ${event.department !== '' ? `Department: ${event.department}\n` : ''}
            Status: ${event.event_status}
            `;
        }).join('\n\n');

        const interestsArray = Array.isArray(interest) ? interest : [interest];

        // Properly format topicsText as plain text
        const topicsText = interestsArray
            .map(int => {
                const interests = Array.isArray(int.selectedInterests)
                    ? int.selectedInterests.join(', ')
                    : int.selectedInterests;

                return int.ByDepartment
                    ? `${interests} (Department: ${int.ByDepartment})`
                    : interests;
            })

            const responseOpenAi = `
            A volunteer has the following interests: ${topicsText}.
            Here are the available events:
            ${eventList}

            Each event has:
            - "department"
            - "title" or "description"
            - "status": either "upcoming" (not started yet) or "ongoing" (currently happening)

            Task:
            1. Find "matched_events":
            - Events relevant to the volunteer's interests.
            - Priority order:
                a) Department match
                b) Topic/category/keywords
                c) Status: prefer "upcoming" then "ongoing"
            2. Find "recommendations":
            - Events that are NOT directly related to the volunteer's interests.
            - Must be different departments/topics for variety.
            - Must have status "upcoming" or "ongoing".
            3. Always return BOTH arrays, even if one is empty.
            - Example:
            {
                "matched_events": [1, 2],
                "recommendations": [3, 4]
            }
            4. Do not explain. Do not add text. Output strictly valid JSON only.
            `;




        const completion = await openai.chat.completions.create({
            model: 'gpt-5-mini',
            messages: [
                { role: 'system', content: 'Hi, I match UCLMCARES events with student interests.' },
                { role: 'user', content: responseOpenAi }
            ]
        });

        const aiResponse = completion.choices[0].message.content;

        let matchedIds = [];
        let recommendations = [];

        try {
            const parsed = JSON.parse(aiResponse);

            if (parsed.matched_events && Array.isArray(parsed.matched_events)) {
                matchedIds = parsed.matched_events;
            }if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
                recommendations = parsed.recommendations;
            }
        } catch (e) {
            console.error('Failed to parse AI response:', aiResponse);
            return {
                matchedIds: [],
                recommendations: []
            };
        }

        return {
            matchedIds,
            recommendations
        };
    } catch (err) {
        console.error('Error in matchInterestedEvents:', err);
        return {
            matchedIds: [],
            recommendations: []
        };
    }
};
