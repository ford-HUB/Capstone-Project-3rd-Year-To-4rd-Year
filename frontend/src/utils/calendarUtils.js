/**
 * Utility functions for calendar calculations
 */

export const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

/**
 * Get categories for events in the current month
 * @param {Array} events - Array of events
 * @param {number} currentYear - Current year
 * @param {number} currentMonth - Current month (0-11)
 * @returns {Array} Array of unique category names
 */
export const getCategoriesForCurrentMonth = (events, currentYear, currentMonth) => {
    const categorySet = new Set();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    events.forEach((event) => {
        if (!event.event_started || !event.event_ended) return;

        const eventStart = new Date(event.event_started);
        const eventEnd = new Date(event.event_ended);

        // Check if event overlaps with current month
        if (eventStart <= monthEnd && eventEnd >= monthStart) {
            if (event.Categories && event.Categories.length > 0) {
                event.Categories.forEach((cat) => categorySet.add(cat.name));
            }
        }
    });

    return Array.from(categorySet).sort();
};

/**
 * Get events for the current month (for calendar display)
 * @param {Array} events - Array of events
 * @param {number} currentYear - Current year
 * @param {number} currentMonth - Current month (0-11)
 * @returns {Object} Object with day numbers as keys and arrays of events as values
 */
export const getEventsForMonth = (events, currentYear, currentMonth) => {
    const monthEvents = {};
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    events.forEach((event) => {
        if (!event.event_started || !event.event_ended) return;

        const eventStart = new Date(event.event_started);
        const eventEnd = new Date(event.event_ended);

        // Check if event overlaps with current month
        if (eventStart <= monthEnd && eventEnd >= monthStart) {
            // Calculate the range of days to mark in the current month
            const startDay = eventStart > monthStart ? eventStart.getDate() : 1;
            const endDay = eventEnd < monthEnd ? eventEnd.getDate() : monthEnd.getDate();

            // Mark all days from start to end in current month
            for (let day = startDay; day <= endDay; day++) {
                if (!monthEvents[day]) {
                    monthEvents[day] = [];
                }
                monthEvents[day].push(event);
            }
        }
    });

    return monthEvents;
};

/**
 * Calculate calendar days for display
 * @param {number} currentYear - Current year
 * @param {number} currentMonth - Current month (0-11)
 * @param {Object} monthEvents - Events mapped by day number
 * @returns {Array} Array of day objects with day, isToday, and hasEvent properties
 */
export const getCalendarDays = (currentYear, currentMonth, monthEvents) => {
    const days = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({ day: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday =
            day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
        const hasEvent = monthEvents[day] && monthEvents[day].length > 0;
        days.push({
            day,
            isToday,
            hasEvent,
        });
    }

    return days;
};

