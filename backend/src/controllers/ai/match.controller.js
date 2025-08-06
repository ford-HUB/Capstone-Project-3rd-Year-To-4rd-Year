import { openai } from "../../config/openai.js"

export const matchInterestedEvents = async (interest, events) => {
    try {
        const eventList = events.map((event, i) => 
        `${i + 1}. Event ID: ${event.event_id} Title: ${event.title}
        Description: ${event.description}
        Categories: ${event.categories.join(', ')}`).join('\n\n');

        const responseOpenAi = `
        A volunteer is interested in the following topics: ${interest.map(int => int.trim()).join(', ')}.

        Here is a current events:
        ${eventList}

        "Match the events that are highly relevant to the volunteer's listed interests."
        . Relevance may come from matching categories, keywords in the title, or themes in the description.

        Please return ONLY the matched events ID in valid JSON format like this:
        {
        "matched_events": [1, 2]
        }

        No explanation, no markdown. Return ONLY valid JSON.
        `;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'Hi, I match UCLM events with student interests.' },
                { role: 'user', content: responseOpenAi }
            ]
        });

        const aiResponse = completion.choices[0].message.content

        let matchedIds = []
        try {
            const parsed = JSON.parse(aiResponse);
            if (parsed.matched_events && Array.isArray(parsed.matched_events)) {
                matchedIds = parsed.matched_events
            }
        } catch (e) {
            console.error('Failed to parse AI response:', aiResponse)
            return [];
        }

        return matchedIds;

    } catch (error) {
        console.log('match interested events controller failed: ', error.message)
        return []
    }
}