import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration)

export const getTotalHours = (time_in, time_out) => {
    const started = dayjs(time_in)
    const end = dayjs(time_out)

    // diference in milliseconds
    const diff = end.diff(started)

    const totalTime = dayjs.duration(diff)

    return `${totalTime.hours()} h ${totalTime.minutes()}m`
}