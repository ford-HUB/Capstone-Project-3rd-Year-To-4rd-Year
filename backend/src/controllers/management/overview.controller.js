import models from "../../models/index.js";
import { Op } from "sequelize";

/**
 * Get system overview for staff role
 * Returns system-wide statistics similar to director dashboard
 */
export const getStaffOverview = async (req, res) => {
    try {
        const { 
            Event, 
            EventRegistration,
            Attendance,
            Volunteer,
            Student,
            Beneficiary,
            Document,
            Accounts
        } = models;

        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Get total events
        const totalEvents = await Event.count();
        const upcomingEventsCount = await Event.count({
            where: {
                status: 'Upcoming',
                event_started: { [Op.gte]: now }
            }
        });
        const ongoingEvents = await Event.count({
            where: {
                status: 'Ongoing'
            }
        });
        const completedEvents = await Event.count({
            where: {
                status: 'Completed'
            }
        });

        // Get upcoming events list (for table display)
        const upcomingEventsList = await Event.findAll({
            where: {
                status: {
                    [Op.in]: ['Upcoming', 'Ongoing']
                },
                event_ended: {
                    [Op.gte]: now
                }
            },
            include: [
                {
                    model: models.Organizer,
                    required: false
                }
            ],
            order: [['event_started', 'ASC']],
            limit: 10
        });

        // 2. Get total participants/registrations
        const totalParticipants = await EventRegistration.count();
        const recentRegistrations = await EventRegistration.count({
            where: {
                registration_date: {
                    [Op.gte]: sevenDaysAgo
                }
            }
        });

        // 3. Get total volunteers
        const totalVolunteers = await Volunteer.count();
        const totalStudents = await Student.count();

        // 4. Get total beneficiaries
        const totalBeneficiaries = await Beneficiary.count();

        // 5. Get total attendance
        const totalAttendance = await Attendance.count();
        const recentAttendance = await Attendance.count({
            where: {
                time_in: {
                    [Op.gte]: sevenDaysAgo
                }
            }
        });

        // 6. Get recent events (last 10)
        const recentEvents = await Event.findAll({
            order: [['event_started', 'DESC']],
            limit: 10,
            include: [
                {
                    model: models.Organizer,
                    required: false
                }
            ]
        });

        // Format response
        const overview = {
            stats: {
                totalEvents,
                upcomingEvents: upcomingEventsCount,
                ongoingEvents,
                completedEvents,
                totalParticipants,
                recentRegistrations,
                totalVolunteers,
                totalStudents,
                totalBeneficiaries,
                totalAttendance,
                recentAttendance
            },
            upcomingEvents: upcomingEventsList.map(event => ({
                event_id: event.event_id,
                title: event.title,
                description: event.description,
                event_started: event.event_started,
                event_ended: event.event_ended,
                location: event.location,
                status: event.status,
                participants: event.participants || 0,
                max_participants: event.max_participants,
                organizer: event.Organizer?.name || 'Unknown',
                event_image: event.event_image
            })),
            recentEvents: recentEvents.map(event => ({
                event_id: event.event_id,
                title: event.title,
                description: event.description,
                event_started: event.event_started,
                event_ended: event.event_ended,
                location: event.location,
                status: event.status,
                participants: event.participants || 0,
                max_participants: event.max_participants,
                organizer: event.Organizer?.name || 'Unknown',
                event_image: event.event_image
            }))
        };

        return res.status(200).json({
            success: true,
            message: 'Staff overview retrieved successfully',
            data: overview
        });

    } catch (error) {
        console.error('getStaffOverview failed:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get department overview for coordinator and assistant coordinator
 * Returns upcoming events, pending approvals, volunteer stats, recent submissions, and notifications
 */
export const getDepartmentOverview = async (req, res) => {
    try {
        const { 
            Event, 
            Department, 
            Category, 
            Organizer,
            EventRegistration,
            Attendance,
            Volunteer,
            Document,
            DocumentRequestApproval,
            Accounts,
            Coordinator,
            Submission
        } = models;

        const userRole = req.user.Role.name;
        const accountId = req.user.account_id;

        // Get coordinator's department
        const coordinatorAccount = await Accounts.findOne({
            where: { account_id: accountId },
            include: [
                {
                    model: Coordinator,
                    required: true,
                    include: [
                        { model: Department }
                    ]
                }
            ]
        });

        if (!coordinatorAccount?.Coordinator?.Department) {
            return res.status(404).json({
                success: false,
                message: 'Coordinator department not found'
            });
        }

        const departmentId = coordinatorAccount.Coordinator.department_id;
        const departmentName = coordinatorAccount.Coordinator.Department.department_name;

        // Get all coordinators in the department (for filtering documents and approvals)
        const departmentCoordinators = await Accounts.findAll({
            include: [
                {
                    model: Coordinator,
                    required: true,
                    where: { department_id: departmentId }
                }
            ]
        });

        const coordinatorAccountIds = departmentCoordinators.length > 0
            ? departmentCoordinators.map(acc => acc.account_id)
            : [];

        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 1. Get upcoming events in their department
        // First, get all events that match status and date criteria
        // Then filter by department association
        const allUpcomingEvents = await Event.findAll({
            where: {
                status: {
                    [Op.in]: ['Upcoming', 'Ongoing']
                },
                event_ended: {
                    [Op.gte]: now  // Event hasn't ended yet
                }
            },
            include: [
                {
                    model: Department,
                    through: { attributes: [] },
                    required: false
                },
                {
                    model: Category,
                    through: { attributes: [] },
                    required: false
                },
                {
                    model: Organizer,
                    required: false
                }
            ],
            order: [['event_started', 'ASC']]
        });

        // Filter events by department
        // Events are only associated with departments if category is 'School'
        // So we show events that either:
        // 1. Have no department association (non-School events)
        // 2. Are associated with the coordinator's department
        const upcomingEvents = allUpcomingEvents.filter(event => {
            // If event has no department association, include it (non-School events)
            if (!event.Departments || event.Departments.length === 0) {
                return true;
            }
            // If event has departments, only include if it matches coordinator's department
            return event.Departments.some(dept => dept.department_id === departmentId);
        }).slice(0, 10);

        console.log('Total upcoming events found:', allUpcomingEvents.length);
        console.log('Events in department:', upcomingEvents.length);
        console.log('Department ID:', departmentId);
        console.log('Department Name:', departmentName);
        console.log('Sample event departments:', allUpcomingEvents[0]?.Departments?.map(d => d.department_id));

        const pendingDocumentRequests = coordinatorAccountIds.length > 0
            ? await DocumentRequestApproval.findAll({
                where: {
                    status: 'pending'
                },
                include: [
                    {
                        model: Document,
                        where: {
                            author_id: {
                                [Op.in]: coordinatorAccountIds
                            },
                            author_type: {
                                [Op.in]: ['coordinator', 'assistant_coordinator']
                            }
                        },
                        include: [
                            {
                                model: Accounts,
                                include: [
                                    {
                                        model: Coordinator,
                                        include: [
                                            { model: Department }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: 10
            })
            : [];

        // 3. Get volunteer/participant overview
        // Get event registrations for events in this department
        const departmentEvents = await Event.findAll({
            attributes: ['event_id'],
            include: [
                {
                    model: Department,
                    through: { attributes: [] },
                    where: { department_id: departmentId },
                    required: true
                }
            ]
        });

        const departmentEventIds = departmentEvents.length > 0 
            ? departmentEvents.map(e => e.event_id) 
            : [];

        // Total volunteers registered for department events
        const totalVolunteerRegistrations = departmentEventIds.length > 0 
            ? await EventRegistration.count({
                where: {
                    event_id: {
                        [Op.in]: departmentEventIds
                    },
                    participant_type: 'volunteer'
                }
            })
            : 0;

        // Recent volunteer registrations (last 7 days)
        const recentVolunteerRegistrations = departmentEventIds.length > 0
            ? await EventRegistration.count({
                where: {
                    event_id: {
                        [Op.in]: departmentEventIds
                    },
                    participant_type: 'volunteer',
                    registration_date: {
                        [Op.gte]: sevenDaysAgo
                    }
                }
            })
            : 0;

        // Total attendance for department events
        const totalAttendance = departmentEventIds.length > 0
            ? await Attendance.count({
                where: {
                    event_id: {
                        [Op.in]: departmentEventIds
                    }
                }
            })
            : 0;

        // Recent attendance (last 7 days)
        const recentAttendance = departmentEventIds.length > 0
            ? await Attendance.count({
                where: {
                    event_id: {
                        [Op.in]: departmentEventIds
                    },
                    time_in: {
                        [Op.gte]: sevenDaysAgo
                    }
                }
            })
            : 0;

        // 4. Get recent submissions/documents
        const recentSubmissions = coordinatorAccountIds.length > 0
            ? await Document.findAll({
                where: {
                    author_id: {
                        [Op.in]: coordinatorAccountIds
                    },
                    author_type: {
                        [Op.in]: ['coordinator', 'assistant_coordinator']
                    },
                    is_public: true
                },
                include: [
                    {
                        model: Accounts,
                        include: [
                            {
                                model: Coordinator,
                                include: [
                                    { model: Department }
                                ]
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: 10
            })
            : [];

        // 5. Get notifications count (unread)
        // This would typically come from a notifications table, but for now we'll return pending tasks count
        const pendingTasksCount = pendingDocumentRequests.length;

        // Format response
        const overview = {
            department: {
                id: departmentId,
                name: departmentName
            },
            upcomingEvents: upcomingEvents.map(event => ({
                event_id: event.event_id,
                title: event.title,
                description: event.description,
                event_started: event.event_started,
                event_ended: event.event_ended,
                location: event.location,
                status: event.status,
                participants: event.participants || 0,
                max_participants: event.max_participants,
                category: event.Categories?.[0]?.name || 'Uncategorized',
                organizer: event.Organizer?.name || 'Unknown',
                event_image: event.event_image
            })),
            pendingApprovals: {
                count: pendingTasksCount,
                items: pendingDocumentRequests.map(req => ({
                    approval_id: req.approval_id,
                    document_id: req.document_id,
                    status: req.status,
                    request_type: req.request_type,
                    priority: req.priority,
                    created_at: req.createdAt,
                    document_title: req.Document?.title || 'Untitled Document'
                }))
            },
            volunteerOverview: {
                totalRegistrations: totalVolunteerRegistrations,
                recentRegistrations: recentVolunteerRegistrations,
                totalAttendance: totalAttendance,
                recentAttendance: recentAttendance
            },
            recentSubmissions: recentSubmissions.map(doc => ({
                document_id: doc.document_id,
                title: doc.title,
                description: doc.description,
                file_path: doc.file_path,
                created_at: doc.createdAt,
                updated_at: doc.updatedAt
            })),
            notifications: {
                unreadCount: pendingTasksCount,
                alerts: pendingDocumentRequests.length > 0 ? [
                    {
                        type: 'pending_approval',
                        message: `You have ${pendingTasksCount} pending document approval${pendingTasksCount > 1 ? 's' : ''}`,
                        count: pendingTasksCount
                    }
                ] : []
            }
        };

        return res.status(200).json({
            success: true,
            message: 'Department overview retrieved successfully',
            data: overview
        });

    } catch (error) {
        console.error('getDepartmentOverview failed:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

