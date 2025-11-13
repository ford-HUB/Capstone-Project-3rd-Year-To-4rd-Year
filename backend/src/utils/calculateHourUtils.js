import dayjs from "dayjs"

export const calculateTotalHours = (time_in, time_out) => {

    console.log({ time_id: time_in, time_out: time_out })

    const time_started = dayjs(time_in)
    const time_ended = dayjs(time_out)

    if(!time_started.isValid() || !time_ended.isValid()) return 0

    const totalHours = time_ended.diff(time_started, 'minute') / 60
    return Number(totalHours.toFixed(2))
}