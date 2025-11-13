import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
dayjs.extend(duration)

export const getTotalEventHours = (event_started, event_ended) => {
    const start = dayjs(event_started)
    const end = dayjs(event_ended)

    if (!start.isValid() || !end.isValid()) return null

    const diff = end.diff(start)
    const d = dayjs.duration(diff)

    let parts = []
    if (d.days() > 0) parts.push(`${d.days()} day${d.days() > 1 ? "s" : ""}`)
    if (d.hours() > 0) parts.push(`${d.hours()} hour${d.hours() > 1 ? "s" : ""}`)
    if (d.minutes() > 0) parts.push(`${d.minutes()} min${d.minutes() > 1 ? "s" : ""}`)

    return parts.length > 0 ? parts.join(" ") : "0 min"
}


export const capitalizeFirstLetter = (string) => {
    if (!string || typeof string !== 'string') return string;
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
