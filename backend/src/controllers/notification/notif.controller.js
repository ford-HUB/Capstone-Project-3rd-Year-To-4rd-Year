import models from "../../models/index.js";
import { Op } from 'sequelize';

export const getNotificationList = async (req, res) => {
    try {
        const { Notification, Volunteer, Student, Director, Coordinator, Staff } = models
        const { user } = req
        const roleType = user.Role?.name

        // Pagination parameters
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit

        // Build where clause based on user role and ID
        let whereClause = {
            [Op.or]: [
                { recipient_id: user.account_id },
                { recipient_role: roleType },
                { recipient_id: null, recipient_role: null } // System-wide notifications
            ]
        }

        // console.log('Where clause:', JSON.stringify(whereClause, null, 2));

        // Role-based filtering
        switch(roleType) {
            case 'director':
                // Directors see all notifications (no additional filtering)
                break
            
            case 'staff':
            case 'coordinator':
            case 'assistant_coordinator':
                // Staff and coordinators should NOT see event_approval notifications
                whereClause = {
                    [Op.and]: [
                        whereClause,
                        {
                            [Op.or]: [
                                { type: { [Op.ne]: 'event_approval' } },
                                { type: null }
                            ]
                        }
                    ]
                }
                break
            
            case 'volunteer':
                // Volunteers see all notifications except approval requests
                whereClause = {
                    [Op.and]: [
                        whereClause,
                        {
                            [Op.or]: [
                                { type: { [Op.ne]: 'event_approval' } },
                                { type: null }
                            ]
                        }
                    ]
                }
                break
            
            default:
                console.log('Unknown role type:', roleType)
                break
        }

        const notifications = await Notification.findAll({
            where: whereClause,
            include: [
                { 
                    model: Volunteer, 
                    required: false,
                    include: [{ 
                        model: Student, 
                        required: false,
                        attributes: ['student_id', 'student_number', 'firstname', 'lastname']
                    }] 
                },
                { 
                    model: Director, 
                    required: false,
                    attributes: ['director_id', 'firstname', 'lastname']
                },
                { 
                    model: Staff, 
                    required: false,
                    attributes: ['staff_id', 'firstname', 'lastname']
                },
                { 
                    model: Coordinator, 
                    required: false,
                    attributes: ['coordinator_id', 'firstname', 'lastname']
                }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        })

        const totalCount = await Notification.count({
            where: whereClause
        })

        // console.log('Found notifications:', notifications.length);
        // console.log('Total count:', totalCount);

        if(!notifications || notifications.length === 0) { 
            return res.json({ 
                success: true, 
                list: [],
                pagination: {
                    totalRecords: totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    currentPage: page,
                    pageSize: limit,
                    hasNextPage: page < Math.ceil(totalCount / limit)
                }
            }) 
        }

        return res.json({ 
            success: true, 
            list: notifications,
            pagination: {
                totalRecords: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                pageSize: limit,
                hasNextPage: page < Math.ceil(totalCount / limit)
            }
        })

    } catch (error) {
        console.log('get notification list failed: ', error.message)
        return res.json({ success: false, message: 'Internal server error'})
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { Notification } = models;
        const { notificationId } = req.params;
        const notification = await Notification.findByPk(notificationId);
        if (!notification) { return res.json({ message: 'Notification not found'}) }

        const updatedNotification = await Notification.update(
            { is_read: true },
            { where: { notification_id: notificationId } }
        )

        if (!updatedNotification) { return res.json({ success: false, message: 'Failed to mark notification as read' }) }

        res.json({ success: true, message: 'Notification marked as read' })

    } catch (error) {
        res.json({ success: false, message: 'Internal server error' })
        console.log('Error marking notification as read:', error.message)
    }
};