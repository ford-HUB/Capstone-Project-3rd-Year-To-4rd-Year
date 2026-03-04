import { genAI } from "../../../config/gemini.js";

export const matchBeneficiaryLocationEvents = async (beneficiaryAddress, events, registeredEventIds = []) => {
    try {
        const eventList = events.map((event, i) => {
            return `${i + 1}. Event ID: ${event.event_id} 
            Title: ${event.title}
            Description: ${event.description}
            Location: ${event.location}
            Categories: ${event.categories.join(', ')}
            ${event.department !== '' ? `Department: ${event.department}\n` : ''}
            Status: ${event.event_status}`;
        }).join('\n\n');

        const registeredEventsInfo = registeredEventIds.length > 0 
            ? `\nIMPORTANT: The beneficiary has already registered for these event IDs: [${registeredEventIds.join(', ')}]. DO NOT include these events in any of the matching arrays.`
            : '';

        const fullPrompt = `
        A beneficiary lives at: "${beneficiaryAddress}".
        Here are the available events:
        ${eventList}${registeredEventsInfo}

        Task: Match events based on LOCATION PROXIMITY for the beneficiary.
        
        CRITICAL RULES: 
        1. Each event can ONLY appear in ONE array. No duplicates allowed.
        2. DO NOT include any events that the beneficiary has already registered for (event IDs: [${registeredEventIds.join(', ')}]).
        
        1. Find "near_you_events":
        - Events in the SAME CITY or SAME PROVINCE/REGION as the beneficiary's address.
        - Priority: Same city > Same province > Nearby areas.
        
        2. Find "almost_near_you_events":
        - Events in ADJACENT cities/provinces or same metropolitan area.
        - MUST NOT include any events already in near_you_events.
        
        3. Find "recommendations":
        - Events NOT in the first two arrays.
        - Only include "upcoming" or "ongoing" events.
        
        4. Consider Philippine geography knowledge (NCR, Luzon, Visayas, Mindanao).
        
        Return strictly valid JSON:
        {
            "near_you_events": [ID, ID],
            "almost_near_you_events": [ID, ID],
            "recommendations": [ID, ID]
        }`;

        const result = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: fullPrompt
        });
        const rawResonse = result.text();
        const cleanResponseJson = rawResonse.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanResponseJson);

        return {
            nearYouIds: parsed.near_you_events || [],
            almostNearYouIds: parsed.almost_near_you_events || [],
            recommendations: parsed.recommendations || []
        };
    } catch (err) {
        console.error('Error in matchBeneficiaryLocationEvents:', err);
        return { nearYouIds: [], almostNearYouIds: [], recommendations: [] };
    }
};


export const matchInterestedEvents = async (interest, events) => {
    try {
        const eventList = events.map((event, i) => {
            return `${i + 1}. Event ID: ${event.event_id} Title: ${event.title}
            Description: ${event.description}
            Categories: ${event.categories.join(', ')}
            ${event.department !== '' ? `Department: ${event.department}\n` : ''}
            Status: ${event.event_status}`;
        }).join('\n\n');

        const interestsArray = Array.isArray(interest) ? interest : [interest];
        const topicsText = interestsArray.map(int => {
            const interests = Array.isArray(int.selectedInterests) ? int.selectedInterests.join(', ') : int.selectedInterests;
            return int.ByDepartment ? `${interests} (Department: ${int.ByDepartment})` : interests;
        }).join(', ');

        const fullPrompt = `
        A volunteer has the following interests: ${topicsText}.
        Available events:
        ${eventList}

        Task:
        1. Find "matched_events": Based on Department match, Topic/category, and Status (prefer upcoming).
        2. Find "recommendations": Different departments/topics for variety.
        3. Output strictly valid JSON only:
        {
            "matched_events": [ID, ID],
            "recommendations": [ID, ID]
        }`;

        const result = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: fullPrompt
        });
        const rawResonse = result.text();
        const cleanResponseJson = rawResonse.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanResponseJson);

        return {
            matchedIds: parsed.matched_events || [],
            recommendations: parsed.recommendations || []
        };
    } catch (err) {
        console.error('Error in matchInterestedEvents:', err);
        return { matchedIds: [], recommendations: [] };
    }
};