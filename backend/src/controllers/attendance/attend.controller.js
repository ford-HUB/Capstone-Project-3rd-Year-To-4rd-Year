import QRCode from 'qrcode'
import { Op } from 'sequelize';
import { generateQrToken } from '../../utils/generateQrToken.js';
import models from "../../models/index.js";

export const ScanQRAttendance = async (req, res) => {
    try {
        const { type, eventId, token } = req.query
        const accountId = req.user.account_id

        const { Attendance, EventQRCode, Student, Volunteer, Director, Staff, Coordinator, Beneficiary, EventRegistration, Event } = models
        if(!['in', 'out'].includes(type)) { return res.json({ success: false, message: 'invalid attendance type' }) }

        const isQrValid = await EventQRCode.findOne({ where: { token: token } })

        if(!isQrValid) { return res.json({ success: false, message: 'qr code cannot be found' }) }

        let participant_id
        let participant

        switch(req.user.Role.name) {
            case 'student':
                const student = await Student.findOne({ where: { account_id: accountId } })
                if(!student) { return res.json({ success: false, message: 'Student record not found' }) }
                participant = await Volunteer.findOne({ where: { student_id: student.student_id } })
                if(!participant) { return res.json({ success: false, message: 'Volunteer record not found. Please complete your volunteer profile first.' }) }
                participant_id = participant.volunteer_id
                break
            case 'beneficiary':
                participant = await Beneficiary.findOne({ where: { account_id: accountId } })
                if(!participant) { return res.json({ success: false, message: 'Beneficiary record not found' }) }
                participant_id = participant.beneficiary_id
                break
            case 'director':
                participant = await Director.findOne({ where: { account_id: accountId } })
                if(!participant) { return res.json({ success: false, message: 'Director record not found' }) }
                participant_id = participant.director_id
                break
            case 'staff':
                participant = await Staff.findOne({ where: { account_id: accountId } })
                if(!participant) { return res.json({ success: false, message: 'Staff record not found' }) }
                participant_id = participant.staff_id
                break
            case 'coordinator':
            case 'assistant_coordinator':
                participant = await Coordinator.findOne({ where: { account_id: accountId } })
                if(!participant) { return res.json({ success: false, message: 'Coordinator record not found' }) }
                participant_id = participant.coordinator_id
                break
            default:
                return res.json({ success: false, message: 'Invalid user role for attendance scanning' })
        }

        if(!participant_id) {
            return res.json({ success: false, message: 'Participant ID not found. Please contact support.' })
        }

        const now = new Date()
        const isRegistered = await EventRegistration.findOne({ where: { event_id: eventId, participant_id: participant_id, status: 'registered' },
            include: [
                { model: Event }
            ]
        })

        if(!isRegistered) { return res.json({ success: false, message: 'You are not registered from this event' }) }

        const eventStatus = isRegistered.Event.status

        if(eventStatus === 'Upcoming') { return res.json({ success: false, message: 'Event is not started yet, please wait until its started.' }) }

        const roleType = req.user.Role.name === 'student' ?
        'volunteer' : req.user.Role.name

        let attendace = await Attendance.findOne({ where: { participant_id: participant_id, participant_type: roleType, event_id: eventId },
            include: [
                { model: Event }
            ]
        })

        if(!attendace) {
            attendace = await Attendance.create({   
                participant_id: participant_id,
                event_id: eventId,
                participant_type: roleType,
                time_in: type === 'in' ? now : null,
                time_out: type === 'out' ? now : null,
                method: 'qrcode',
                status: 'time-in'
            })
        }else {
            if(type === 'in' && attendace.time_in) {
                return res.json({ success: false, message: 'Your time-in already recorded' })
            }

            if(type === 'out' && attendace.time_out) {
                return res.json({ success: false, message: 'Your time-out already recorded' })
            }

            if(type === 'out' && attendace.Event.status !== 'Completed') {
                return res.json({ success: false, message: 'Time-out not allowed before event ends.' })
            }

            await Attendance.update({
                time_in: type === 'in' ? now : attendace.time_in,
                time_out: type === 'out' ? now : attendace.time_out,
                status: 'time-out'
            },
            { where: { attendance_id: attendace.attendance_id } })
        }

        attendace = await Attendance.findOne({
            where: { attendance_id: attendace.attendance_id },
            include: [{ model: Event }]
        })

        const AttentType = type === 'in' ? 'Time-In' : 'Time-Out'

        console.log('event data: ', attendace.Event)

        return res.json({ success: true, message: `Success Record ${AttentType}`, eventDetails: attendace.Event })

    } catch (error) {
        console.error('Scan QR Code Attendance failed: ', error.message)
        console.error('Error stack: ', error.stack)
        // Return more specific error message if available, otherwise generic message
        const errorMessage = error.message || 'Internal Server Error'
        return res.json({ success: false, message: errorMessage })
    }
}

export const generateBothQR = async (req, res) => {
    try {
      const { eventId } = req.query;
      const { Event, EventQRCode } = models;
  
      const event = await Event.findByPk(eventId);
      if (!event) return res.json({ message: "event not found" });
  
      const types = ["in", "out"];
      const result = {};
  
      for (const type of types) {
        // Check if QR already exists for this event and type
        let existingQr = await EventQRCode.findOne({
          where: { event_id: eventId, type }
        });
  
        if (existingQr) {
          // Use the existing one (no duplication)
          result[type] = existingQr.qrcode_url;
          continue;
        }
  
        // Otherwise, generate a new one
        const generatedToken = await generateQrToken();
  
        const scanURL = `/api/attendance/scanQr/attendance?type=${type}&eventId=${eventId}&token=${generatedToken}`;
        const qrGeneratedURL = await QRCode.toDataURL(scanURL);
  
        const newQr = await EventQRCode.create({
          event_id: eventId,
          type,
          qrcode_url: qrGeneratedURL,
          token: generatedToken,
          expires_at: event.event_ended, // valid until event ends
        });
  
        result[type] = newQr.qrcode_url;
      }
  
      return res.json({ success: true, timeInQr: result.in, timeOutQr: result.out,
      });
    } catch (error) {
      console.log("generate both QR failed:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const attendanceLog = async (req, res) => {
    try {
        const { 
            Attendance, 
            Event, 
            Volunteer, 
            Student, 
            Staff, 
            Director, 
            Category, 
            Beneficiary, 
            Coordinator, 
            Department, 
            Accounts 
        } = models

        const { 
            participant_type, 
            event_id, 
            status, 
            date_from, 
            date_to,
            event_status,
            search_term,
            department
        } = req.query

        const userRole = req.user.Role.name
        const now = new Date()
        let departmentFilter = null

        // Get department filter based on user role
        if (userRole === 'coordinator' || userRole === 'assistant_coordinator') {
            const coordinatorAccount = await Accounts.findOne({
                where: { account_id: req.user.account_id },
                include: [{
                    model: Coordinator,
                    include: [{ model: Department }]
                }]
            })

            if (!coordinatorAccount?.Coordinator?.Department) {
                return res.json({ 
                    success: false, 
                    message: 'Coordinator department not found' 
                })
            }

            departmentFilter = coordinatorAccount.Coordinator.department_id
        } else if ((userRole === 'staff' || userRole === 'director') && department) {
            departmentFilter = parseInt(department)
        }

        // Build attendance where conditions
        const whereConditions = {}
        if (participant_type) whereConditions.participant_type = participant_type
        if (event_id) whereConditions.event_id = event_id
        
        if (status) {
            if (status === 'present') {
                whereConditions.time_out = { [Op.ne]: null }
            } else if (status === 'in_progress') {
                const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000))
                whereConditions.time_out = null
                whereConditions.time_in = { [Op.gt]: oneHourAgo }
            } else if (status === 'failed_to_attend') {
                const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000))
                whereConditions.time_out = null
                whereConditions[Op.or] = [
                    { time_in: { [Op.lte]: oneHourAgo } },
                    { time_in: { [Op.ne]: null } }
                ]
            }
        }

        if (date_from || date_to) {
            whereConditions.createdAt = {}
            if (date_from) whereConditions.createdAt[Op.gte] = new Date(date_from)
            if (date_to) whereConditions.createdAt[Op.lte] = new Date(date_to)
        }

        // Build event where conditions
        const eventWhereConditions = {}
        if (event_status) {
            eventWhereConditions.status = event_status
        } else {
            // Show current and past events by default
            eventWhereConditions[Op.or] = [
                { event_started: { [Op.lte]: now }, event_ended: { [Op.gte]: now } },
                { event_ended: { [Op.lt]: now } }
            ]
        }
        if (search_term) {
            eventWhereConditions.title = { [Op.iLike]: `%${search_term}%` }
        }

        // Fetch attendance data
        const attendanceRecords = await Attendance.findAll({
            where: whereConditions,
            include: [
                { 
                    model: Volunteer,
                    required: false,
                    include: [{ model: Student }]
                },
                { model: Staff, required: false },
                { model: Director, required: false },
                { model: Beneficiary, required: false },
                { model: Coordinator, required: false },
                { 
                    model: Event,
                    required: true,
                    attributes: ['title', 'status', 'event_started', 'event_ended'],
                    where: Object.keys(eventWhereConditions).length > 0 ? eventWhereConditions : undefined,
                    include: [
                        { model: Category, through: [] },
                        { 
                            model: Department,
                            required: departmentFilter ? true : false,
                            where: departmentFilter ? { department_id: departmentFilter } : undefined,
                            through: { attributes: [] }
                        }
                    ]
                }
            ],
            order: [['createdAt', 'ASC']]
        })

        // Format attendance data
        const formattedData = attendanceRecords.map((record) => {
            const formatted = {
                id: record.attendance_id,
                time_in: record.time_in || null,
                time_out: record.time_out || null,
                status: record.time_out ? 'Present' : 'In Progress',
                participant_type: record.participant_type,
                participantDetails: null,
                eventDetails: null
            }

            // Map participant details based on type
            if (record.participant_type === 'volunteer' && record.Volunteer?.Student) {
                formatted.participantDetails = {
                    participant_name: `${record.Volunteer.Student.firstname} ${record.Volunteer.Student.lastname}`,
                    participant_type: 'Student',
                    participant_id: record.Volunteer.Student.student_id
                }
            } else if (record.participant_type === 'staff' && record.Staff) {
                formatted.participantDetails = {
                    participant_name: `${record.Staff.firstname} ${record.Staff.lastname}`,
                    participant_type: 'Staff',
                    participant_id: record.Staff.staff_id
                }
            } else if (record.participant_type === 'coordinator' && record.Coordinator) {
                formatted.participantDetails = {
                    participant_name: `${record.Coordinator.firstname} ${record.Coordinator.lastname}`,
                    participant_type: 'Coordinator',
                    participant_id: record.Coordinator.coordinator_id
                }
            } else if (record.participant_type === 'assistant_coordinator' && record.Coordinator) {
                formatted.participantDetails = {
                    participant_name: `${record.Coordinator.firstname} ${record.Coordinator.lastname}`,
                    participant_type: 'Assistant Coordinator',
                    participant_id: record.Coordinator.coordinator_id
                }
            } else if (record.participant_type === 'director' && record.Director) {
                formatted.participantDetails = {
                    participant_name: `${record.Director.firstname} ${record.Director.lastname}`,
                    participant_type: 'Director',
                    participant_id: record.Director.director_id
                }
            } else if (record.participant_type === 'beneficiary' && record.Beneficiary) {
                formatted.participantDetails = {
                    participant_name: `${record.Beneficiary.firstname} ${record.Beneficiary.lastname}`,
                    participant_type: 'Beneficiary',
                    participant_id: record.Beneficiary.beneficiary_id,
                    organization_name: record.Beneficiary.organization_name
                }
            }

            // Map event details
            if (record.Event) {
                const eventType = record.Event.Categories?.[0]?.name || 'N/A'
                const departmentName = record.Event.Departments?.[0]?.department_name
                
                formatted.eventDetails = {
                    event_name: record.Event.title,
                    event_type: eventType,
                    event_started: record.Event.event_started,
                    event_ended: record.Event.event_ended,
                    event_status: record.Event.status,
                    department_name: eventType === 'School' ? departmentName : null
                }
            }

            return formatted
        })

        // Filter valid records
        const validData = formattedData.filter(item => 
            item.participantDetails !== null && item.eventDetails !== null
        )

        if (validData.length === 0) {
            return res.json({ 
                success: true, 
                message: 'There is no records of attendance log right now',
                attendanceData: []
            })
        }

        return res.json({ success: true, attendanceData: validData })

    } catch (error) {
        console.error('attendance log controller failed:', error.message)
        return res.json({ success: false, message: 'Internal Server Error' })
    }
}


export const attendanceRecords = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit

        // Get query parameters for filtering
        const { 
            participant_type, 
            event_id, 
            status, 
            date_from, 
            date_to,
            event_status,
            search_term,
            department
        } = req.query


        const { Attendance, Event, Volunteer, Student, Staff, Director, Category, Beneficiary, Coordinator, Department, Accounts } = models

        // Role-based access control
        const userRole = req.user.Role.name
        let departmentFilter = null

        // Apply role-based filtering
        if (userRole === 'coordinator' || userRole === 'assistant_coordinator') {
            // Get coordinator's department
            const coordinatorAccount = await Accounts.findOne({
                where: { account_id: req.user.account_id },
                include: [
                    {
                        model: Coordinator,
                        include: [
                            { model: Department }
                        ]
                    }
                ]
            })

            if (!coordinatorAccount?.Coordinator?.Department) {
                return res.json({ 
                    success: false, 
                    message: 'Coordinator department not found' 
                })
            }

            departmentFilter = coordinatorAccount.Coordinator.department_id
        }
        // Staff and Director have full access, but can filter by department if specified
        else if ((userRole === 'staff' || userRole === 'director') && department) {
            departmentFilter = parseInt(department)
        }

        // Build where conditions for filtering
        const whereConditions = {}
        if (participant_type) {
            whereConditions.participant_type = participant_type
        }
        if (event_id) {
            whereConditions.event_id = event_id
        }
        if (status) {
            if (status === 'present') {
                whereConditions.time_out = { [Op.ne]: null }
            } else if (status === 'in_progress') {
                whereConditions.time_out = null
                const now = new Date();
                const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
                whereConditions.time_in = { [Op.gt]: oneHourAgo }
            } else if (status === 'failed_to_attend') {
                whereConditions.time_out = null
                const now = new Date();
                const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
                whereConditions[Op.or] = [
                    { time_in: { [Op.lte]: oneHourAgo } },
                    { time_in: { [Op.ne]: null } }
                ]
            }
        }
        if (date_from || date_to) {
            whereConditions.createdAt = {}
            if (date_from) {
                whereConditions.createdAt[Op.gte] = new Date(date_from)
            }
            if (date_to) {
                whereConditions.createdAt[Op.lte] = new Date(date_to)
            }
        }

        // If no filters are applied, show all records
        const hasFilters = Object.keys(whereConditions).length > 0 || event_status || search_term;

        // Build event where conditions
        const eventWhereConditions = {}
        if (event_status) {
            eventWhereConditions.status = event_status
        }
        if (search_term) {
            eventWhereConditions.title = { [Op.iLike]: `%${search_term}%` }
        }
        
        // Department filtering for coordinators will be handled in the Event include

        // If search_term is provided, we need to make the includes more flexible
        const shouldUseSearch = search_term && search_term.trim() !== '';

        // Build the main query
        const queryOptions = {
            where: whereConditions,
            include: [
                { 
                    model: Volunteer,
                    required: false,
                    include: [
                        { model: Student, required: false }
                    ]
                },
                { model: Staff, required: false },
                { model: Director, required: false },
                { model: Beneficiary, required: false },
                { model: Coordinator, required: false },
                { 
                    model: Event,
                    required: departmentFilter ? true : false,
                    attributes: ['title', 'status', 'event_started', 'event_ended'],
                    where: Object.keys(eventWhereConditions).length > 0 ? eventWhereConditions : undefined,
                    include: [
                        { model: Category },
                        { 
                            model: Department,
                            required: departmentFilter ? true : false,
                            where: departmentFilter ? { department_id: departmentFilter } : undefined,
                            through: { attributes: [] }
                        }
                    ],
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        };

        // For status filtering, we need to add event conditions to the main where clause
        if (status === 'in_progress' || status === 'failed_to_attend') {
            const now = new Date();
            if (status === 'in_progress') {
                // Add event conditions for in_progress
                queryOptions.include[5].where = {
                    ...queryOptions.include[5].where,
                    [Op.or]: [
                        { event_ended: null },
                        { event_ended: { [Op.gt]: now } }
                    ]
                };
            } else if (status === 'failed_to_attend') {
                // Add event conditions for failed_to_attend
                queryOptions.include[5].where = {
                    ...queryOptions.include[5].where,
                    [Op.or]: [
                        { event_ended: { [Op.lte]: now } },
                        { event_ended: null }
                    ]
                };
            }
        }

        const { rows, count } = await Attendance.findAndCountAll(queryOptions)

        let formattedData = rows.map((attendance) => {
            // Determine status based on attendance and event completion
            let status = 'In Progress';
            if (attendance.time_out) {
                status = 'Present';
            } else if (attendance.time_in) {
                const timeIn = new Date(attendance.time_in);
                const now = new Date();
                const hoursInEvent = (now - timeIn) / (1000 * 60 * 60); // Convert to hours
                
                // Check if event has ended
                if (attendance.Event && attendance.Event.event_ended) {
                    const eventEndTime = new Date(attendance.Event.event_ended);
                    if (now > eventEndTime) {
                        status = 'Failed to Attend';
                    }
                }
                // Check if participant has been in event for more than 1 hour without checkout
                else if (hoursInEvent > 1) {
                    status = 'Failed to Attend';
                }
            }

            const attendanceData = {
                id: attendance.attendance_id,
                time_in: attendance.time_in || null,
                time_out: attendance.time_out || null,
                status: status,
                participant_type: attendance.participant_type,
                participantDetails: null,
                eventDetails: null
            }

            // Handle volunteer/student participants
            if(attendance.participant_type === 'volunteer' && attendance.Volunteer?.Student) {
                attendanceData.participantDetails = {
                    participant_name: `${attendance.Volunteer.Student.firstname} ${attendance.Volunteer.Student.lastname}`,
                    participant_type: 'Student',
                    participant_id: attendance.Volunteer.Student.student_id
                }
            }
            // Handle staff participants
            else if(attendance.participant_type === 'staff' && attendance.Staff) {
                attendanceData.participantDetails = {
                    participant_name: `${attendance.Staff.firstname} ${attendance.Staff.lastname}`,
                    participant_type: 'Staff',
                    participant_id: attendance.Staff.staff_id
                }
            }
            // Handle coordinator participants
            else if(attendance.participant_type === 'coordinator' && attendance.Coordinator) {
                attendanceData.participantDetails = {
                    participant_name: `${attendance.Coordinator.firstname} ${attendance.Coordinator.lastname}`,
                    participant_type: 'Coordinator',
                    participant_id: attendance.Coordinator.coordinator_id
                }
            }

            // Handle coordinator participants
            else if(attendance.participant_type === 'assistant_coordinator' && attendance.Coordinator) {
                attendanceData.participantDetails = {
                    participant_name: `${attendance.Coordinator.firstname} ${attendance.Coordinator.lastname}`,
                    participant_type: 'Assistant Coordinator',
                    participant_id: attendance.Coordinator.coordinator_id
                }
            }

            // Handle director participants
            else if(attendance.participant_type === 'director' && attendance.Director) {
                attendanceData.participantDetails = {
                    participant_name: `${attendance.Director.firstname} ${attendance.Director.lastname}`,
                    participant_type: 'Director',
                    participant_id: attendance.Director.director_id
                }
            }
            // Handle beneficiary participants
            else if(attendance.participant_type === 'beneficiary' && attendance.Beneficiary) {
                attendanceData.participantDetails = {
                    participant_name: `${attendance.Beneficiary.firstname} ${attendance.Beneficiary.lastname}`,
                    participant_type: 'Beneficiary',
                    participant_id: attendance.Beneficiary.beneficiary_id,
                    organization_name: attendance.Beneficiary.organization_name
                }
            }

            // Add event details if event exists
            if(attendance.Event) {
                const eventType = attendance.Event.Categories?.[0]?.name || 'N/A'
                const departmentName = attendance.Event.Departments?.[0]?.department_name
                
                attendanceData.eventDetails = {
                    event_name: attendance.Event.title,
                    event_type: eventType,
                    event_started: attendance.Event.event_started,
                    event_ended: attendance.Event.event_ended,
                    event_status: attendance.Event.status,
                    department_name: eventType === 'School' ? departmentName : null
                }
            }

            return attendanceData
        })

        // Apply client-side search filtering if search_term is provided
        if (shouldUseSearch) {
            formattedData = formattedData.filter(attendance => {
                const participantName = attendance.participantDetails?.participant_name?.toLowerCase() || '';
                const eventName = attendance.eventDetails?.event_name?.toLowerCase() || '';
                const searchLower = search_term.toLowerCase();
                
                return participantName.includes(searchLower) || eventName.includes(searchLower);
            });
        }

        if(rows.length === 0) { 
            return res.json({ 
                success: true, 
                message: 'There is no records of attendance log right now',
                attendanceData: [],
                pagination: {
                    total: 0,
                    page: page,
                    totalPages: 0
                }
            }) 
        }

        // Get participant type counts for statistics
        let participantTypeCounts = [];
        let statusCounts = [{ present_count: 0, in_progress_count: 0, failed_to_attend_count: 0 }];

        try {
            // For statistics, we want to show counts based on the current filters
            // but also provide overall counts if no filters are applied
            const statsWhereConditions = { ...whereConditions };
            
            // Add department filtering for coordinators in statistics
            const statsIncludeOptions = [];
            if (departmentFilter) {
                statsIncludeOptions.push({
                    model: Event,
                    required: true,
                    include: [
                        {
                            model: Department,
                            required: true,
                            where: { department_id: departmentFilter },
                            through: { attributes: [] }
                        }
                    ]
                });
            }
            
            // Use the same query structure as the main query for consistency
            const participantTypeQuery = {
                where: statsWhereConditions,
                include: [
                    { 
                        model: Event,
                        required: departmentFilter ? true : false,
                        include: departmentFilter ? [
                            {
                                model: Department,
                                required: true,
                                where: { department_id: departmentFilter },
                                through: { attributes: [] }
                            }
                        ] : []
                    }
                ],
                attributes: [
                    'participant_type',
                    [models.sequelize.fn('COUNT', models.sequelize.col('Attendance.attendance_id')), 'count']
                ],
                group: ['participant_type'],
                raw: true
            };
            
            try {
                participantTypeCounts = await Attendance.findAll(participantTypeQuery);
            } catch (error) {
                participantTypeCounts = [];
            }
            


            // Get status counts using separate queries
            const presentCountQuery = {
                where: {
                    ...statsWhereConditions,
                    time_out: { [Op.ne]: null }
                },
                include: [
                    { 
                        model: Event,
                        required: departmentFilter ? true : false,
                        include: departmentFilter ? [
                            {
                                model: Department,
                                required: true,
                                where: { department_id: departmentFilter },
                                through: { attributes: [] }
                            }
                        ] : []
                    }
                ]
            };
            
            let presentCount = 0;
            try {
                presentCount = await Attendance.count(presentCountQuery);
            } catch (error) {
                presentCount = 0;
            }

            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));

            const inProgressCountQuery = {
                where: {
                    ...statsWhereConditions,
                    time_out: null,
                    time_in: { [Op.gt]: oneHourAgo }
                },
                include: [
                    {
                        model: Event,
                        required: departmentFilter ? true : false,
                        where: {
                            [Op.or]: [
                                { event_ended: null },
                                { event_ended: { [Op.gt]: now } }
                            ]
                        },
                        include: departmentFilter ? [
                            {
                                model: Department,
                                required: true,
                                where: { department_id: departmentFilter },
                                through: { attributes: [] }
                            }
                        ] : []
                    }
                ]
            };
            
            let inProgressCount = 0;
            try {
                inProgressCount = await Attendance.count(inProgressCountQuery);
            } catch (error) {
                inProgressCount = 0;
            }

            const failedToAttendCountQuery = {
                where: {
                    ...statsWhereConditions,
                    time_out: null,
                    [Op.or]: [
                        { time_in: { [Op.lte]: oneHourAgo } },
                        {
                            time_in: { [Op.ne]: null },
                            '$Event.event_ended$': { [Op.lte]: now }
                        }
                    ]
                },
                include: [
                    {
                        model: Event,
                        required: departmentFilter ? true : false,
                        attributes: [],
                        include: departmentFilter ? [
                            {
                                model: Department,
                                required: true,
                                where: { department_id: departmentFilter },
                                through: { attributes: [] }
                            }
                        ] : []
                    }
                ]
            };
            
            let failedToAttendCount = 0;
            try {
                failedToAttendCount = await Attendance.count(failedToAttendCountQuery);
            } catch (error) {
                failedToAttendCount = 0;
            }

            statusCounts = [{
                present_count: presentCount,
                in_progress_count: inProgressCount,
                failed_to_attend_count: failedToAttendCount
            }];


            // If no participant type counts found, try to get overall counts
            if (participantTypeCounts.length === 0 && Object.keys(statsWhereConditions).length > 0) {
                participantTypeCounts = await Attendance.findAll({
                    where: statsWhereConditions,
                    include: [
                        { 
                            model: Event,
                            required: departmentFilter ? true : false,
                            include: departmentFilter ? [
                                {
                                    model: Department,
                                    required: true,
                                    where: { department_id: departmentFilter },
                                    through: { attributes: [] }
                                }
                            ] : []
                        }
                    ],
                    attributes: [
                        'participant_type',
                        [models.sequelize.fn('COUNT', models.sequelize.col('Attendance.attendance_id')), 'count']
                    ],
                    group: ['participant_type'],
                    raw: true
                });
            }

        } catch (statsError) {
            // Use default values if statistics query fails
        }

        const response = { 
            success: true,
            attendanceData: formattedData,
            pagination: {
                total: count,
                page: page,
                totalPages: Math.ceil(count / limit)
            },
            statistics: {
                participantTypeCounts: participantTypeCounts,
                statusCounts: statusCounts[0] || { present_count: 0, in_progress_count: 0, failed_to_attend_count: 0 },
                totalRecords: count
            }
        };

        
        return res.json(response)
    } catch (error) {
        console.log('attendance records failed: ', error)
        return res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const attendanceStatistics = async (req, res) => {
    try {
        const { Attendance, Event, Volunteer, Student, Staff, Director, Category, Beneficiary, Coordinator, Department, Accounts } = models
        
        // Get query parameters for filtering
        const { event_id, date_from, date_to, department } = req.query

        // Role-based access control
        const userRole = req.user.Role.name
        let departmentFilter = null

        // Apply role-based filtering
        if (userRole === 'coordinator' || userRole === 'assistant_coordinator') {
            // Get coordinator's department
            const coordinatorAccount = await Accounts.findOne({
                where: { account_id: req.user.account_id },
                include: [
                    {
                        model: Coordinator,
                        include: [
                            { model: Department }
                        ]
                    }
                ]
            })

            if (!coordinatorAccount?.Coordinator?.Department) {
                return res.json({ 
                    success: false, 
                    message: 'Coordinator department not found' 
                })
            }

            departmentFilter = coordinatorAccount.Coordinator.department_id
        }
        // Staff and Director have full access, but can filter by department if specified
        else if ((userRole === 'staff' || userRole === 'director') && department) {
            departmentFilter = parseInt(department)
        }

        // Build where conditions for filtering
        const whereConditions = {}
        if (event_id) {
            whereConditions.event_id = event_id
        }
        if (date_from || date_to) {
            whereConditions.createdAt = {}
            if (date_from) {
                whereConditions.createdAt[Op.gte] = new Date(date_from)
            }
            if (date_to) {
                whereConditions.createdAt[Op.lte] = new Date(date_to)
            }
        }

        // Apply department filtering to statistics for coordinators
        const statsIncludeOptions = []
        if (departmentFilter) {
            statsIncludeOptions.push({
                model: Event,
                required: true,
                include: [
                    {
                        model: Department,
                        required: true,
                        where: { department_id: departmentFilter },
                        through: { attributes: [] }
                    }
                ]
            })
        }

        // Get total attendance count
        const totalAttendance = await Attendance.count({
            where: whereConditions,
            include: statsIncludeOptions
        })

        // Get attendance count by participant type
        const attendanceByType = await Attendance.findAll({
            where: whereConditions,
            include: statsIncludeOptions,
            attributes: [
                'participant_type',
                [models.sequelize.fn('COUNT', models.sequelize.col('attendance_id')), 'count']
            ],
            group: ['participant_type'],
            raw: true
        })

        // Get attendance count by event
        const attendanceByEvent = await Attendance.findAll({
            where: whereConditions,
            include: [
                {
                    model: Event,
                    attributes: ['title', 'event_id'],
                    required: true,
                    include: departmentFilter ? [
                        {
                            model: Department,
                            required: true,
                            where: { department_id: departmentFilter },
                            through: { attributes: [] }
                        }
                    ] : []
                }
            ],
            attributes: [
                'event_id',
                [models.sequelize.fn('COUNT', models.sequelize.col('Attendance.attendance_id')), 'count']
            ],
            group: ['event_id', 'Event.title'],
            raw: true
        })

        // Get present vs in-progress count
        const statusCounts = await Attendance.findAll({
            where: whereConditions,
            include: statsIncludeOptions,
            attributes: [
                [models.sequelize.fn('COUNT', 
                    models.sequelize.literal('CASE WHEN time_out IS NOT NULL THEN 1 END')
                ), 'present_count'],
                [models.sequelize.fn('COUNT', 
                    models.sequelize.literal('CASE WHEN time_out IS NULL THEN 1 END')
                ), 'in_progress_count']
            ],
            raw: true
        })

        return res.json({
            success: true,
            statistics: {
                total_attendance: totalAttendance,
                by_participant_type: attendanceByType,
                by_event: attendanceByEvent,
                status_counts: statusCounts[0] || { present_count: 0, in_progress_count: 0 }
            }
        })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('attendance statistics failed: ', error)
    }
}

export const beneficiaryCompletedAttendance = async (req, res) => {
    try {
        const { Attendance, Event, Beneficiary, EventRegistration, Category, Department } = models

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit

        // resolve beneficiary id from authenticated account
        const accountId = req.user.account_id
        const beneficiary = await Beneficiary.findOne({ where: { account_id: accountId } })

        if (!beneficiary) {
            return res.json({ success: false, message: 'Beneficiary not found' })
        }

        // find registrations for completed events
        const registrations = await EventRegistration.findAll({
            where: { participant_id: beneficiary.beneficiary_id, status: 'registered' },
            attributes: ['event_id'],
            include: [
                { model: Event, required: true, where: { status: 'Completed' }, attributes: ['event_id'] }
            ]
        })

        const eventIds = registrations.map(r => r.event_id)

        if (eventIds.length === 0) {
            return res.json({
                success: true,
                message: 'No completed registered events found for this beneficiary',
                records: [],
                pagination: {
                    total: 0,
                    page: page,
                    totalPages: 0
                }
            })
        }

        // get attendance where beneficiary actually attended (has time_out) on those completed, registered events
        const { rows, count } = await Attendance.findAndCountAll({
            where: {
                participant_type: 'beneficiary',
                participant_id: beneficiary.beneficiary_id,
                event_id: { [Op.in]: eventIds },
                time_out: { [Op.ne]: null }
            },
            include: [
                {
                    model: Event,
                    required: true,
                    attributes: ['title', 'status', 'event_started', 'event_ended'],
                    include: [
                        { model: Category, through: [] },
                        { model: Department, required: false, through: { attributes: [] } }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        })

        const records = rows.map(a => {
            const eventType = a.Event?.Categories?.[0]?.name || 'N/A'
            const departmentName = a.Event?.Departments?.[0]?.department_name

            return {
                id: a.attendance_id,
                time_in: a.time_in || null,
                time_out: a.time_out || null,
                status: 'Present',
                eventDetails: a.Event ? {
                    event_name: a.Event.title,
                    event_type: eventType,
                    event_started: a.Event.event_started,
                    event_ended: a.Event.event_ended,
                    event_status: a.Event.status,
                    department_name: eventType === 'School' ? departmentName : null
                } : null
            }
        })

        return res.json({
            success: true,
            records,
            pagination: {
                total: count,
                page: page,
                totalPages: Math.ceil(count / limit)
            }
        })
    } catch (error) {
        console.log('beneficiaryCompletedAttendance failed: ', error.message)
        return res.json({ success: false, message: 'Internal Server Error' })
    }
}
