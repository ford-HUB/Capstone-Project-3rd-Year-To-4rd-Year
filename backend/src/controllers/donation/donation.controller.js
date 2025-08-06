import models from "../../models/index.js"

export const enableOrDisableFunds = async (req, res) => {
    try {
        const { funds } = req.body
        console.log(funds)
        const eventId = req.params.id
        const { Event } = models

        const isEventExist = await Event.findOne({ where: { event_id: eventId } })
        if(!isEventExist) { return res.json({ message: 'event is not found' }) }

        const updateEvent = await Event.update(
            { funds_donation: funds },
            { where: { event_id: isEventExist.event_id } })

        if(!updateEvent) { return res.json({ message: 'event donation failed' }) }

        return res.json({ success: true, message: `funds event donation ${funds ? 'activated' : 'deactivated'}` })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('enable or disable event donation failed: ', error.message)
    }
}


export const enableOrDisableGoods = async (req, res) => {
    try {
        const { goods } = req.body
        const eventId = req.params.id
        const { Event } = models

        const isEventExist = await Event.findOne({ where: { event_id: eventId } })
        if(!isEventExist) { return res.json({ message: 'event is not found' }) }

        const updateEvent = await Event.update(
            { goods_donation: goods },
            { where: { event_id: isEventExist.event_id } })

            if(!updateEvent) { return res.json({ message: 'event donation failed' }) }
            return res.json({ success: true, message: `goods event donation ${goods ? 'activated': 'deactivated'}` })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('enable or disable goods event donation failed: ', error.message)
    }
}