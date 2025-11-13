import models from "../../../models/index.js";
import { Op } from "sequelize";

const { Event, FormLink, Accounts } = models;

export const getEvents = async (req, res) => {
    try {
        const { target_role, exclude_with_forms } = req.query;
        
        let whereClause = {
            status: {
                [Op.in]: ['Upcoming', 'Ongoing']
            }
        };

        // If exclude_with_forms is true, exclude events that already have BOTH volunteer and beneficiary forms
        if (exclude_with_forms === 'true') {
            // Get all form links grouped by event_id
            const allFormLinks = await FormLink.findAll({
                attributes: ['event_id', 'target_role'],
                order: [['event_id', 'ASC']]
            });

            // Group by event_id and count distinct target_roles
            const eventRoleCounts = {};
            allFormLinks.forEach(formLink => {
                if (!eventRoleCounts[formLink.event_id]) {
                    eventRoleCounts[formLink.event_id] = new Set();
                }
                eventRoleCounts[formLink.event_id].add(formLink.target_role);
            });

            // Find events that have both volunteer and beneficiary forms
            const eventIdsWithBothForms = Object.keys(eventRoleCounts).filter(eventId => {
                return eventRoleCounts[eventId].size === 2; // Has both volunteer and beneficiary
            }).map(eventId => parseInt(eventId));
            
            // Exclude events that have both forms
            if (eventIdsWithBothForms.length > 0) {
                whereClause.event_id = {
                    [Op.notIn]: eventIdsWithBothForms
                };
            }
        }

        const events = await Event.findAll({
            where: whereClause,
            attributes: ['event_id', 'title', 'event_started', 'event_ended', 'status'],
            order: [['event_started', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Events retrieved successfully",
            events
        });

    } catch (error) {
        console.error("Get events error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getEventFormLinkStatus = async (req, res) => {
    try {
        const { event_id } = req.params;

        // Check if event exists
        const event = await Event.findByPk(event_id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Get form links for this event
        const formLinks = await FormLink.findAll({
            where: {
                event_id: event_id
            },
            attributes: ['target_role', 'title', 'createdAt']
        });

        // Create status object
        const status = {
            volunteer: {
                hasForm: false,
                formTitle: null,
                createdAt: null
            },
            beneficiary: {
                hasForm: false,
                formTitle: null,
                createdAt: null
            }
        };

        // Update status based on existing form links
        formLinks.forEach(formLink => {
            status[formLink.target_role] = {
                hasForm: true,
                formTitle: formLink.title,
                createdAt: formLink.createdAt
            };
        });

        return res.status(200).json({
            success: true,
            message: "Form link status retrieved successfully",
            event: {
                event_id: event.event_id,
                title: event.title
            },
            status
        });

    } catch (error) {
        console.error("Get event form link status error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const submitEventGoogleFormLink = async (req, res) => {
    try {
        // Get validated data from middleware
        const { event_id, title, description, form_link, sheet_link, target_role } = req.validatedBody;
        const created_by = req.user.account_id;

        // Check if event exists
        const event = await Event.findByPk(event_id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Check if form link already exists for this event and target role
        const existingFormLink = await FormLink.findOne({
            where: {
                event_id,
                target_role
            }
        });

        if (existingFormLink) {
            return res.status(400).json({
                success: false,
                message: `A form link already exists for ${target_role}s in this event`
            });
        }

        // Create new form link
        const newFormLink = await FormLink.create({
            event_id,
            target_role,
            title,
            description,
            form_link,
            sheet_link,
            created_by
        });

        return res.status(201).json({
            success: true,
            message: "Form link created successfully",
            formLink: newFormLink
        });

    } catch (error) {
        console.error('Submit event google form link failed:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// Get all Google Form links with pagination and filtering
export const getGoogleFormLinks = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            target_role = '', 
            event_id = ''
        } = req.query;

        const offset = (page - 1) * limit;
        
        // Build where clause
        let whereClause = {};
        
        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }
        
        if (target_role) {
            whereClause.target_role = target_role;
        }
        
        if (event_id) {
            whereClause.event_id = event_id;
        }

        // Get form links with related data
        const { count, rows: formLinks } = await FormLink.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'event_started', 'event_ended', 'status']
                },
                {
                    model: Accounts,
                    attributes: ['account_id', 'email']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            success: true,
            message: "Google Form links retrieved successfully",
            data: {
                formLinks,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error("Get Google Form links error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get single Google Form link by ID
export const getGoogleFormLinkById = async (req, res) => {
    try {
        const { formlink_id } = req.params;

        const formLink = await FormLink.findByPk(formlink_id, {
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'event_started', 'event_ended', 'status']
                },
                {
                    model: Accounts,
                    attributes: ['account_id', 'email']
                }
            ]
        });

        if (!formLink) {
            return res.status(404).json({
                success: false,
                message: "Form link not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Form link retrieved successfully",
            formLink
        });

    } catch (error) {
        console.error("Get Google Form link by ID error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update Google Form link
export const updateGoogleFormLink = async (req, res) => {
    try {
        const { formlink_id } = req.params;
        const { title, description, form_link, sheet_link, target_role } = req.validatedBody;

        const formLink = await FormLink.findByPk(formlink_id);
        if (!formLink) {
            return res.status(404).json({
                success: false,
                message: "Form link not found"
            });
        }

        // Check if updating target_role would create a duplicate
        if (target_role && target_role !== formLink.target_role) {
            const existingFormLink = await FormLink.findOne({
                where: {
                    event_id: formLink.event_id,
                    target_role,
                    formlink_id: { [Op.ne]: formlink_id }
                }
            });

            if (existingFormLink) {
                return res.status(400).json({
                    success: false,
                    message: `A form link already exists for ${target_role}s in this event`
                });
            }
        }

        // Update form link
        await formLink.update({
            title: title || formLink.title,
            description: description || formLink.description,
            form_link: form_link || formLink.form_link,
            sheet_link: sheet_link !== undefined ? sheet_link : formLink.sheet_link,
            target_role: target_role || formLink.target_role
        });

        return res.status(200).json({
            success: true,
            message: "Form link updated successfully",
            formLink
        });

    } catch (error) {
        console.error("Update Google Form link error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Delete Google Form link
export const deleteGoogleFormLink = async (req, res) => {
    try {
        const { formlink_id } = req.params;

        const deletedCount = await FormLink.destroy({ where: { formlink_id: formlink_id } });

        if (!deletedCount) {
            return res.status(404).json({
                success: false,
                message: "Form link not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Form link deleted successfully"
        });

    } catch (error) {
        console.error("Delete Google Form link error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};