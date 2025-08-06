import express from "express"

// @ User Schema
import { eventSchema } from "../../validators/event.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Static
import { allowedRoleManageEvent } from "../../static/allowedStaffRole.js"


// @ Controllers
import { enableOrDisableFunds, enableOrDisableGoods } from "../../controllers/donation/donation.controller.js"

const donationRouter = express.Router()

donationRouter.put('/enable-funds-event-donation/:id', guard(...allowedRoleManageEvent), enableOrDisableFunds)
donationRouter.put('/enable-goods-event-donation/:id', guard(...allowedRoleManageEvent), enableOrDisableGoods)


donationRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default donationRouter