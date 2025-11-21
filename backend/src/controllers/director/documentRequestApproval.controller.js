import models from "../../models/index.js";
import supabase from "../../config/supabase.js";
import { sendMail } from "../../services/mailService.js";
import { logDirectorActivity } from "../../services/activityLogService.js";

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

        // Log activity
        await logDirectorActivity(reviewed_by, 'update', 'document', `${status === 'approved' ? 'Approved' : 'Rejected'} document request for: ${documentRequest.Document.title}${status === 'rejected' && rejection_reason ? ` (Reason: ${rejection_reason})` : ''}`, req.ip || req.connection.remoteAddress, req.get('user-agent'));

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

        const documentTitle = documentRequest.Document?.title || 'Unknown document';
        await documentRequest.destroy();

        // Log activity
        await logDirectorActivity(req.user.account_id, 'delete', 'document', `Deleted document request approval for: ${documentTitle}`, req.ip || req.connection.remoteAddress, req.get('user-agent'));

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
