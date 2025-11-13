import express from "express"
import models from "../../models/index.js"

// @ Validators
import { goodsDonationSchema } from "../../validators/goodsDonation.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Static
import { allowedRoleManageEvent } from "../../static/allowedStaffRole.js"


// @ Controllers
import { enableOrDisableFunds, enableOrDisableGoods, getEventsOpenForDonations, getEventDonationStats, getDonationById, submitGoodsDonation, getMyDonations, getMyDonationHistory, getEventGoodsTypes } from "../../controllers/donation/donation.controller.js"

const donationRouter = express.Router()

donationRouter.put('/enable-funds-event-donation/:id', guard('director', 'staff'), enableOrDisableFunds)
donationRouter.put('/enable-goods-event-donation/:id', guard('director', 'staff'), enableOrDisableGoods)
donationRouter.get('/event-goods-types/:event_id', getEventGoodsTypes)
donationRouter.get('/events-open-for-donations', getEventsOpenForDonations)
donationRouter.get('/event-stats/:eventId', getEventDonationStats)
donationRouter.post('/submit-goods/:event_id', guard('donor'), validateRequest(goodsDonationSchema), submitGoodsDonation)
donationRouter.get('/my', guard('donor'), getMyDonations)
donationRouter.get('/my/history', guard('donor'), getMyDonationHistory)

donationRouter.get('/:donationId', getDonationById)

donationRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default donationRouter