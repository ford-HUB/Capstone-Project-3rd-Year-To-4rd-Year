import express from "express";

// @ Controllers
import { getUpcomingEvents } from "../../controllers/guest/event.controller.js";

const guestEventRouter = express.Router();

// Public routes (no authentication required)
guestEventRouter.get("/upcoming-events", getUpcomingEvents);

export default guestEventRouter;

