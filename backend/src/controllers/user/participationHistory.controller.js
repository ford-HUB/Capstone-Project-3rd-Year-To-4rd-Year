import models from "../../models/index.js";
import { calculateTotalHours } from "../../utils/calculateHourUtils.js";

// Helper function to format time spent
const formatTimeSpent = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    const timeParts = [];
    if (hours > 0) {
        timeParts.push(`${hours}hr${hours > 1 ? 's' : ''}`);
    }
    if (minutes > 0) {
        timeParts.push(`${minutes}min${minutes > 1 ? 's' : ''}`);
    }
    
    return timeParts.length > 0 ? timeParts.join(' ') : '0mins';
};

export const getParticipationHistory = async (req, res) => {
    try {
        const { account_id } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { EventRegistration, Event, Volunteer, Student, Attendance } = models;
        
        // Get the student and volunteer
        const student = await Student.findOne({ where: { account_id } });
        if (!student) {
            return res.json({ success: false, message: 'Student not found' });
        }

        const volunteer = await Volunteer.findOne({ where: { student_id: student.student_id } });
        if (!volunteer) {
            return res.json({ success: false, message: 'Volunteer not found' });
        }

        // Get completed events where the participant was registered
        const completedRegistrations = await EventRegistration.findAll({
            where: { 
                participant_id: volunteer.volunteer_id, 
                participant_type: 'volunteer' 
            },
            include: [
                { 
                    model: Event,
                    where: { status: 'Completed' },
                    include: [
                        { model: models.Category, through: { attributes: [] } },
                        { model: models.Department, through: { attributes: [] } },
                        { model: models.Organizer }
                    ]
                }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        // Get total count for pagination
        const totalCount = await EventRegistration.count({
            where: { 
                participant_id: volunteer.volunteer_id, 
                participant_type: 'volunteer',
                proof_uploaded: true 
            },
            include: [
                { 
                    model: Event,
                    where: { status: 'Completed' }
                }
            ]
        });

        // Process each registration to include attendance data and time calculation
        const participationHistory = await Promise.all(
            completedRegistrations.map(async (registration) => {
                const event = registration.Event;
                
                // Get attendance record for this event
                const attendance = await Attendance.findOne({
                    where: {
                        event_id: event.event_id,
                        participant_id: volunteer.volunteer_id,
                        participant_type: 'volunteer'
                    }
                });

                // Calculate time spent and determine attendance status
                let timeSpent = null;
                let timeSpentFormatted = 'No attendance record';
                let displayStatus;
                
                if (!attendance || !attendance.time_in) {
                    // No attendance record or no time_in
                    displayStatus = 'Failed to Attend';
                } else if (!attendance.time_out) {
                    // Incomplete attendance - has time_in but no time_out
                    timeSpentFormatted = 'Incomplete attendance';
                    displayStatus = 'Failed';
                } else {
                    // Complete attendance - both time_in and time_out exist
                    timeSpent = calculateTotalHours(attendance.time_in, attendance.time_out);
                    timeSpentFormatted = formatTimeSpent(timeSpent);
                    displayStatus = registration.proof_uploaded 
                        ? 'Completed Requirements' 
                        : 'Completed - Requirements Needed';
                }

                return {
                    registration_id: registration.event_registration_id,
                    event_id: event.event_id,
                    event_title: event.title,
                    event_description: event.description,
                    event_started: event.event_started,
                    event_ended: event.event_ended,
                    location: event.location,
                    registration_date: registration.registration_date,
                    status: displayStatus,
                    proof_uploaded: registration.proof_uploaded,
                    proof_uploaded_at: registration.proof_uploaded_at,
                    proof_images: registration.proof_images || [],
                    time_spent_hours: timeSpent,
                    time_spent_formatted: timeSpentFormatted,
                    attendance: attendance ? {
                        time_in: attendance.time_in,
                        time_out: attendance.time_out,
                        method: attendance.method,
                        status: attendance.status
                    } : null,
                    event_details: {
                        categories: event.Categories || [],
                        departments: event.Departments || [],
                        organizer: event.Organizer || null,
                        participants: event.participants,
                        max_participants: event.max_participants
                    }
                };
            })
        );

        // Calculate total time spent across all events
        const totalTimeSpent = participationHistory.reduce(
            (total, item) => total + (item.time_spent_hours || 0), 
            0
        );
        const totalTimeFormatted = formatTimeSpent(totalTimeSpent);

        res.json({
            success: true,
            data: participationHistory,
            summary: {
                total_events_completed: totalCount,
                total_time_spent_hours: totalTimeSpent,
                total_time_spent_formatted: totalTimeFormatted
            },
            pagination: {
                totalRecords: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                pageSize: limit
            }
        });

    } catch (error) {
        console.log('Get participation history failed:', error.message);
        res.json({ success: false, message: 'Internal Server Error' });
    }
};
