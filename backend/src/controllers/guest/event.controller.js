import models from "../../models/index.js";
import { Op } from "sequelize";

const { Event } = models;

/**
 * Get all upcoming events for guests
 * Public endpoint - no authentication required
 */
export const getUpcomingEvents = async (req, res) => {
    try {
        const now = new Date();
        const events = await Event.findAll({
            attributes: [
                'event_id', 
                'title', 
                'status', 
                'event_started', 
                'event_ended', 
                'location',
                'description'
            ],
            where: {
                status: {
                    [Op.in]: ['Upcoming', 'Ongoing']
                },
                // Include events that haven't ended yet (upcoming or ongoing)
                event_ended: {
                    [Op.gte]: now
                }
            },
            order: [['event_started', 'ASC']]
        });

        return res.status(200).json({
            success: true,
            message: "Upcoming events retrieved successfully",
            events
        });

    } catch (error) {
        console.error("Get upcoming events error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

