import models from "../../models/index.js";
import supabase from "../../config/supabase.js";
import { sendMail } from "../../services/mailService.js";
import { logDirectorActivity } from "../../services/activityLogService.js";
import { Op } from "sequelize";

const { DocumentRequestApproval, Document, Accounts, Director, Staff, Role, Coordinator, Department } = models;

// Get all document request approvals for director
export const getAllDocumentRequestApprovals = async (req, res) => {
    try {
        const { status, priority, request_type } = req.query;
        
        let whereClause = {};
        
        if (status) {
            whereClause.status = status;
        }
        if (priority) {
            whereClause.priority = priority;
        }
        if (request_type) {
            whereClause.request_type = request_type;
        }

        const documentRequests = await DocumentRequestApproval.findAll({
            where: whereClause,
            include: [
                {
                    model: Document,
                    include: [
                        {
                            model: Accounts,
                            include: [
                                {
                                    model: Role,
                                    required: false
                                },
                                { 
                                    model: Director, 
                                    required: false 
                                },
                                { 
                                    model: Staff, 
                                    required: false 
                                },
                                { 
                                    model: Coordinator, 
                                    required: false,
                                    include: [
                                        { 
                                            model: Department, 
                                            required: false 
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (documentRequests.length === 0) {
            return res.json({ 
                success: true, 
                message: 'No document request approvals found',
                data: []
            });
        }

        const formattedRequests = documentRequests.map(request => ({
            dra_id: request.dra_id,
            document_id: request.document_id,
            document: {
                document_id: request.Document.document_id,
                title: request.Document.title,
                category: request.Document.category,
                file_type: request.Document.file_type,
                public_url: supabase.storage.from('documents').getPublicUrl(request.Document.file_url).data.publicUrl,
                size: request.Document.size,
                file_url: request.Document.file_url,
                author: {
                    account_id: request.Document.Account.account_id,
                    fullname: request.Document.Account.fullname,
                    email: request.Document.Account.email,
                    role: request.Document.Account.Role?.name,
                    department: request.Document.Account.Coordinator?.Department?.name || 
                               request.Document.Account.Staff?.Department?.name
                }
            },
            requester: {
                account_id: request.Document.Account.account_id,
                fullname: `${request.Document.Account.Coordinator.firstname} ${request.Document.Account.Coordinator.lastname}`,
                email: request.Document.Account.email,
                role: request.Document.Account.Role?.name,
                department: request.Document.Account.Coordinator?.Department?.department_name || 'Unknown Department'
            },
            reviewer: null,
            request_type: request.request_type,
            request_reason: request.request_reason,
            status: request.status,
            review_notes: request.review_notes,
            rejection_reason: request.rejection_reason,
            priority: request.priority,
            due_date: request.due_date,
            created_at: request.createdAt,
            updated_at: request.updatedAt
        }));

        return res.json({
            success: true,
            message: 'Document request approvals retrieved successfully',
            data: formattedRequests
        });

    } catch (error) {
        console.error('Error fetching document request approvals:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get single document request approval
export const getDocumentRequestApprovalById = async (req, res) => {
    try {
        const { dra_id } = req.params;

        const documentRequest = await DocumentRequestApproval.findByPk(dra_id, {
            include: [
                {
                    model: Document,
                    include: [
                        {
                            model: Accounts,
                            include: [
                                { 
                                    model: Director, 
                                    required: false 
                                },
                                { 
                                    model: Staff, 
                                    required: false 
                                },
                                { 
                                    model: Coordinator, 
                                    required: false,
                                    include: [
                                        { 
                                            model: Department, 
                                            required: false 
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Accounts,
                    as: 'Requester',
                    include: [
                        { 
                            model: Director, 
                            required: false 
                        },
                        { 
                            model: Staff, 
                            required: false 
                        },
                        { 
                            model: Coordinator, 
                            required: false,
                            include: [
                                { 
                                    model: Department, 
                                    required: false 
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Accounts,
                    as: 'Reviewer',
                    required: false,
                    include: [
                        { 
                            model: Director, 
                            required: false 
                        },
                        { 
                            model: Staff, 
                            required: false 
                        },
                        { 
                            model: Coordinator, 
                            required: false,
                            include: [
                                { 
                                    model: Department, 
                                    required: false 
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!documentRequest) {
            return res.status(404).json({
                success: false,
                message: 'Document request approval not found'
            });
        }

        const formattedRequest = {
            dra_id: documentRequest.dra_id,
            document_id: documentRequest.document_id,
            document: {
                document_id: documentRequest.Document.document_id,
                title: documentRequest.Document.title,
                category: documentRequest.Document.category,
                file_type: documentRequest.Document.file_type,
                size: documentRequest.Document.size,
                file_url: documentRequest.Document.file_url,
                author: {
                    account_id: documentRequest.Document.Accounts.account_id,
                    fullname: documentRequest.Document.Accounts.fullname,
                    email: documentRequest.Document.Accounts.email,
                    role: documentRequest.Document.Accounts.Role?.name,
                    department: documentRequest.Document.Accounts.Coordinator?.Department?.name || 
                               documentRequest.Document.Accounts.Staff?.Department?.name
                }
            },
            requester: {
                account_id: documentRequest.Requester.account_id,
                fullname: documentRequest.Requester.fullname,
                email: documentRequest.Requester.email,
                role: documentRequest.Requester.Role?.name,
                department: documentRequest.Requester.Coordinator?.Department?.name || 
                           documentRequest.Requester.Staff?.Department?.name
            },
            reviewer: documentRequest.Reviewer ? {
                account_id: documentRequest.Reviewer.account_id,
                fullname: documentRequest.Reviewer.fullname,
                email: documentRequest.Reviewer.email,
                role: documentRequest.Reviewer.Role?.name
            } : null,
            request_type: documentRequest.request_type,
            request_reason: documentRequest.request_reason,
            status: documentRequest.status,
            review_notes: documentRequest.review_notes,
            rejection_reason: documentRequest.rejection_reason,
            priority: documentRequest.priority,
            due_date: documentRequest.due_date,
            created_at: documentRequest.createdAt,
            updated_at: documentRequest.updatedAt
        };

        return res.json({
            success: true,
            message: 'Document request approval retrieved successfully',
            data: formattedRequest
        });

    } catch (error) {
        console.error('Error fetching document request approval:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Create document request approval
export const createDocumentRequestApproval = async (req, res) => {
    try {
        const { document_id, request_type, request_reason, priority, due_date } = req.validatedBody;
        const requested_by = req.user.account_id;

        // Check if document exists
        const document = await Document.findByPk(document_id);
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Check if there's already a pending request for this document
        const existingRequest = await DocumentRequestApproval.findOne({
            where: {
                document_id: document_id,
                status: 'pending'
            }
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'There is already a pending request for this document'
            });
        }

        const newRequest = await DocumentRequestApproval.create({
            document_id,
            requested_by,
            request_type,
            request_reason,
            priority,
            due_date: due_date ? new Date(due_date) : null
        });

        // Log activity
        await logDirectorActivity(requested_by, 'create', 'document', `Created document request approval for document: ${document.title} (Type: ${request_type})`, req.ip || req.connection.remoteAddress, req.get('user-agent'));

        return res.status(201).json({
            success: true,
            message: 'Document request approval created successfully',
            data: {
                dra_id: newRequest.dra_id,
                document_id: newRequest.document_id,
                request_type: newRequest.request_type,
                status: newRequest.status,
                priority: newRequest.priority,
                created_at: newRequest.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating document request approval:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update document request approval status (approve/reject)
export const updateDocumentRequestApprovalStatus = async (req, res) => {
    try {
        const { dra_id } = req.params;
        const { status, review_notes, rejection_reason } = req.validatedBody;
        const reviewed_by = req.user.account_id;


        const documentRequests = await DocumentRequestApproval.findAll({
            where: {
                dra_id: dra_id
            },
            include: [
                {
                    model: Document,
                    include: [
                        {
                            model: Accounts,
                            include: [
                                { 
                                    model: Coordinator, 
                                    include: [
                                        { model: Department }
                                    ]
                                },
                            ]
                        }
                    ],
                }
            ]
        });

        const reviewerInfo = await Accounts.findByPk(reviewed_by, {
            include: [
                { model: Director },
                { model: Staff }
            ]
        })

        if (!documentRequests || documentRequests.length === 0) {
            return res.json({
                success: false,
                message: 'Document request approval not found'
            });
        }

        const documentRequest = documentRequests[0]; // Get the first (and should be only) result

        if (documentRequest.status !== 'pending') {
            return res.json({
                success: false,
                message: 'This request has already been processed'
            });
        }

        // Update the request
        await documentRequest.update({
            status,
            reviewed_by,
            review_notes,
            rejection_reason: status === 'rejected' ? rejection_reason : null
        });

        // Send email notification
        try {
            const requesterEmail = documentRequest.Document.Account.email;
            const requesterName = `${documentRequest.Document.Account.Coordinator.firstname} ${documentRequest.Document.Account.Coordinator.lastname}`;
            const documentTitle = documentRequest.Document.title;
            const reviewerName = `${reviewerInfo.Director ? reviewerInfo.Director.firstname : reviewerInfo.Staff.firstname} ${reviewerInfo.Director ? reviewerInfo.Director.lastname : reviewerInfo.Staff.lastname}`;
            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (status === 'approved') {
                await sendMail(
                    requesterEmail,
                    'Document Request Approved',
                    'Your document request has been approved',
                    'documentApprovalNotification.html',
                    {
                        email: process.env.AUTH_MAILER,
                        requester_name: requesterName,
                        document_title: documentTitle,
                        reviewer_name: reviewerName,
                        current_date: currentDate,
                        company_name: 'UCLM CARES'
                    }
                );
            } else if (status === 'rejected') {
                await sendMail(
                    requesterEmail,
                    'Document Request Rejected',
                    'Your document request has been rejected',
                    'documentRejectionNotification.html',
                    {
                        email: process.env.AUTH_MAILER,
                        requester_name: requesterName,
                        document_title: documentTitle,
                        reviewer_name: reviewerName,
                        rejection_reason: rejection_reason || 'No reason provided',
                        current_date: currentDate,
                        company_name: 'UCLM CARES'
                    }
                );
            }
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails
        }

        // Log activity - Document approved/rejected
        const documentTitle = documentRequest.Document.title
        const shortTitle = documentTitle.length > 40 ? documentTitle.substring(0, 37) + '...' : documentTitle
        const shortReason = rejection_reason && rejection_reason.length > 30 ? rejection_reason.substring(0, 27) + '...' : rejection_reason
        const eventDetails = `"${shortTitle}" | ${documentRequest.Document.category || 'N/A'}${status === 'rejected' && shortReason ? ` | Reason: ${shortReason}` : ''}`
        const logDescription = `${status === 'approved' ? 'Approved' : 'Rejected'} document: ${eventDetails}`
        
        await logDirectorActivity(
            reviewed_by,
            'update',
            'document',
            logDescription.substring(0, 255),
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        return res.json({
            success: true,
            message: `Document request ${status} successfully`,
            data: {
                dra_id: documentRequest.dra_id,
                status: documentRequest.status,
                reviewed_by: documentRequest.reviewed_by,
                review_notes: documentRequest.review_notes,
                rejection_reason: documentRequest.rejection_reason,
                updated_at: documentRequest.updatedAt
            }
        });

    } catch (error) {
        console.error('Error updating document request approval status:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete document request approval
export const deleteDocumentRequestApproval = async (req, res) => {
    try {
        const { dra_id } = req.params;

        const documentRequest = await DocumentRequestApproval.findByPk(dra_id);
        if (!documentRequest) {
            return res.status(404).json({
                success: false,
                message: 'Document request approval not found'
            });
        }

        // Get document info before deletion
        const document = await Document.findByPk(documentRequest.document_id)
        const documentTitle = document?.title || documentRequest.Document?.title || 'Unknown document'
        const documentCategory = document?.category || 'N/A'
        
        await documentRequest.destroy();

        // Log activity - Document request approval deleted
        const shortTitle = documentTitle.length > 40 ? documentTitle.substring(0, 37) + '...' : documentTitle
        const eventDetails = `"${shortTitle}" | ${documentCategory}`
        const logDescription = `Deleted document request: ${eventDetails}`
        
        await logDirectorActivity(
            req.user.account_id,
            'delete',
            'document',
            logDescription.substring(0, 255),
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        return res.json({
            success: true,
            message: 'Document request approval deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting document request approval:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get documents by date for monitoring
export const getDocumentsByDateForMonitoring = async (req, res) => {
    try {
        const { date } = req.query; // Format: YYYY-MM-DD

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required (format: YYYY-MM-DD)'
            });
        }

        // Parse date and create date range for the entire day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Get all documents submitted on this date by coordinators
        const documents = await Document.findAll({
            where: {
                author_type: { [Op.in]: ['coordinator', 'assistant_coordinator'] },
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
                is_public: true
            },
            include: [
                {
                    model: Accounts,
                    include: [
                        {
                            model: Coordinator,
                            required: true,
                            include: [
                                {
                                    model: Department,
                                    required: true
                                }
                            ]
                        },
                        {
                            model: Role,
                            required: false
                        }
                    ]
                },
                {
                    model: DocumentRequestApproval,
                    required: false,
                    order: [['createdAt', 'DESC']]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Format the response
        const formattedDocuments = documents.map(doc => {
            const latestApproval = doc.DocumentRequestApprovals && doc.DocumentRequestApprovals.length > 0
                ? doc.DocumentRequestApprovals[0]
                : null;

            return {
                document_id: doc.document_id,
                title: doc.title,
                category: doc.category,
                file_type: doc.file_type,
                public_url: supabase.storage.from('documents').getPublicUrl(doc.file_url).data.publicUrl,
                size: doc.size,
                createdAt: doc.createdAt,
                coordinator: {
                    account_id: doc.Account.account_id,
                    coordinator_id: doc.Account.Coordinator.coordinator_id,
                    firstname: doc.Account.Coordinator.firstname,
                    lastname: doc.Account.Coordinator.lastname,
                    fullname: `${doc.Account.Coordinator.firstname} ${doc.Account.Coordinator.lastname}`,
                    department: {
                        department_id: doc.Account.Coordinator.Department.department_id,
                        department_name: doc.Account.Coordinator.Department.department_name
                    }
                },
                approval_status: latestApproval ? latestApproval.status : 'no_request',
                approval_request_id: latestApproval ? latestApproval.dra_id : null,
                reviewed_at: latestApproval ? latestApproval.updatedAt : null
            };
        });

        return res.json({
            success: true,
            message: 'Documents retrieved successfully',
            data: formattedDocuments
        });

    } catch (error) {
        console.error('Error fetching documents by date:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all coordinators for monitoring
export const getAllCoordinatorsForMonitoring = async (req, res) => {
    try {
        const coordinators = await Accounts.findAll({
            where: {
                is_active: true
            },
            include: [
                {
                    model: Role,
                    where: {
                        name: { [Op.in]: ['coordinator', 'assistant_coordinator'] }
                    },
                    required: true
                },
                {
                    model: Coordinator,
                    required: true,
                    include: [
                        {
                            model: Department,
                            required: true
                        }
                    ]
                }
            ],
            order: [
                [{ model: Coordinator }, 'lastname', 'ASC'],
                [{ model: Coordinator }, 'firstname', 'ASC']
            ]
        });

        const formattedCoordinators = coordinators.map(account => ({
            account_id: account.account_id,
            coordinator_id: account.Coordinator.coordinator_id,
            firstname: account.Coordinator.firstname,
            lastname: account.Coordinator.lastname,
            fullname: `${account.Coordinator.firstname} ${account.Coordinator.lastname}`,
            email: account.email,
            phone_number: account.Coordinator.phone_number,
            department: {
                department_id: account.Coordinator.Department.department_id,
                department_name: account.Coordinator.Department.department_name
            },
            role: account.Role.name
        }));

        return res.json({
            success: true,
            message: 'Coordinators retrieved successfully',
            data: formattedCoordinators
        });

    } catch (error) {
        console.error('Error fetching coordinators:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get calendar data with document status for each day
export const getDocumentMonitoringCalendar = async (req, res) => {
    try {
        const { year, month } = req.query; // Format: YYYY, MM (1-12)

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: 'Year and month parameters are required'
            });
        }

        // Create date range for the entire month
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);

        // Get all documents submitted in this month by coordinators
        const documents = await Document.findAll({
            where: {
                author_type: { [Op.in]: ['coordinator', 'assistant_coordinator'] },
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
                is_public: true
            },
            include: [
                {
                    model: Accounts,
                    include: [
                        {
                            model: Coordinator,
                            required: true,
                            include: [
                                {
                                    model: Department,
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    model: DocumentRequestApproval,
                    required: false,
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        // Group documents by date
        const documentsByDate = {};
        documents.forEach(doc => {
            const docDate = new Date(doc.createdAt);
            const dateKey = `${docDate.getFullYear()}-${String(docDate.getMonth() + 1).padStart(2, '0')}-${String(docDate.getDate()).padStart(2, '0')}`;
            
            if (!documentsByDate[dateKey]) {
                documentsByDate[dateKey] = [];
            }

            const latestApproval = doc.DocumentRequestApprovals && doc.DocumentRequestApprovals.length > 0
                ? doc.DocumentRequestApprovals[0]
                : null;

            documentsByDate[dateKey].push({
                document_id: doc.document_id,
                title: doc.title,
                coordinator_id: doc.Account.Coordinator.coordinator_id,
                coordinator_name: `${doc.Account.Coordinator.firstname} ${doc.Account.Coordinator.lastname}`,
                approval_status: latestApproval ? latestApproval.status : 'no_request'
            });
        });

        // Determine day status: has pending, has approved, or no documents
        const calendarData = {};
        Object.keys(documentsByDate).forEach(dateKey => {
            const dayDocs = documentsByDate[dateKey];
            const hasPending = dayDocs.some(doc => doc.approval_status === 'pending');
            const hasApproved = dayDocs.some(doc => doc.approval_status === 'approved');
            
            calendarData[dateKey] = {
                status: hasPending ? 'pending' : (hasApproved ? 'approved' : 'no_request'),
                document_count: dayDocs.length,
                pending_count: dayDocs.filter(doc => doc.approval_status === 'pending').length,
                approved_count: dayDocs.filter(doc => doc.approval_status === 'approved').length,
                documents: dayDocs
            };
        });

        return res.json({
            success: true,
            message: 'Calendar data retrieved successfully',
            data: calendarData
        });

    } catch (error) {
        console.error('Error fetching calendar data:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
