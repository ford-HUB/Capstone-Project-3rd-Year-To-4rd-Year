import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration)

export const FormatHours = (totalHoursDecimal ) => {
    if(totalHoursDecimal === 0) return 0

    const timeDuration = dayjs.duration(totalHoursDecimal, 'hours')
    const formattedTimeAndMinutes = `${timeDuration.hours()}h ${timeDuration.minutes()}m`

    return formattedTimeAndMinutes
}