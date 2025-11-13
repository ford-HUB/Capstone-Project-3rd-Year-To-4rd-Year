import models from '../../models/index.js';
import supabase from '../../config/supabase.js';
import { Op } from 'sequelize';

const { Department, Accounts, Staff, Coordinator, Director, Document, DocumentRequestApproval } = models;

export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll({
            order: [['department_name', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: departments,
            message: 'Departments retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch departments',
            error: error.message
        });
    }
};

export const getAllDocumentsAsSubmissions = async (req, res) => {
    try {
        const { department_id, submission_type, status, submitted_by } = req.query;
        const accountId = req.user.account_id;
        const roleType = req.user.Role.name;

        let documentWhereClause = { is_public: true };

        if (submission_type) {
            const categoryMap = {
                'Annual': 'Annual Report',
                'Monthly': 'Monthly Report', 
                'Quarterly': 'Financial Statement',
                'Special': 'Special',
                'Compliance': 'Compliance Document'
            };
            if (categoryMap[submission_type]) {
                documentWhereClause.category = categoryMap[submission_type];
            }
        }

        if (submitted_by) {
            documentWhereClause.author_id = submitted_by;
        }

        let documentDataContainer = []

        switch(roleType) {
            case 'director':
                documentDataContainer = await Document.findAll({
                    where: { author_type: 'coordinator', is_public: true },
                    include: [
                        {
                            model: Accounts,
                            include: [
                                { 
                                    model: Coordinator, required: false,
                                    include: [
                                        { model: Department }
                                    ]
                                },
                            ]
                        },
                        {
                            model: DocumentRequestApproval,
                            required: false,
                            order: [['createdAt', 'DESC']]
                        }
                    ],
                    order: [['createdAt', 'DESC']]
                })
                break
            
            case 'staff':
                documentDataContainer = await Document.findAll({
                    where: { author_type: 'coordinator', is_public: true },
                    include: [
                        {
                            model: Accounts,
                            include: [
                                { 
                                    model: Coordinator, required: false,
                                    include: [
                                        { model: Department }
                                    ]
                                },
                            ]
                        },
                        {
                            model: DocumentRequestApproval,
                            required: false,
                            order: [['createdAt', 'DESC']]
                        }
                    ],
                    order: [['createdAt', 'DESC']]
                })
                break
            
            case 'coordinator':
            case 'assistant_coordinator':
                const coordinatorAccount = await Accounts.findOne({
                    where: { account_id: accountId },
                    include: [
                        { 
                            model: Coordinator, 
                            required: true,
                            include: [
                                { model: Department },
                            ]
                        }
                    ]
                });

                if (coordinatorAccount && coordinatorAccount.Coordinator && coordinatorAccount.Coordinator.Department) {
                    console.log('Coordinator account found, fetching documents for account_id:', accountId);
                    
                    // For assistant_coordinator, show approved documents from all coordinators in the same department
                    // For regular coordinator, show only their own documents
                    if (roleType === 'assistant_coordinator') {
                        // Get all coordinators in the same department
                        const departmentId = coordinatorAccount.Coordinator.Department.department_id;
                        const departmentCoordinators = await Accounts.findAll({
                            where: { account_id: { [Op.ne]: accountId } }, // Exclude current user
                            include: [
                                {
                                    model: Coordinator,
                                    required: true,
                                    where: { department_id: departmentId }
                                }
                            ]
                        });
                        
                        const coordinatorIds = departmentCoordinators.map(acc => acc.account_id);
                        
                        // Fetch documents from all coordinators in the department + current user's documents
                        documentDataContainer = await Document.findAll({
                            where: { 
                                author_id: { [Op.in]: [...coordinatorIds, accountId] },
                                author_type: 'coordinator', // Include both coordinator and assistant_coordinator documents
                                is_public: true 
                            },
                            include: [
                                {
                                    model: Accounts,
                                    include: [
                                        { 
                                            model: Coordinator, required: false,
                                            include: [
                                                { model: Department }
                                            ]
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
                        
                        console.log('Assistant coordinator: Found documents from department coordinators:', documentDataContainer.length);
                    } else {
                        // Regular coordinator - show only their own documents
                        documentDataContainer = await Document.findAll({
                            where: { 
                                author_id: accountId, 
                                author_type: roleType, 
                                is_public: true 
                            },
                            include: [
                                {
                                    model: Accounts,
                                    include: [
                                        { 
                                            model: Coordinator, required: false,
                                            include: [
                                                { model: Department }
                                            ]
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
                        
                        console.log('Regular coordinator: Found own documents:', documentDataContainer.length);
                    }

                    // Filter documents based on approval status
                    console.log('Documents before filtering:', documentDataContainer.length);
                    documentDataContainer = documentDataContainer.filter(doc => {
                        const latestApproval = doc.DocumentRequestApprovals && doc.DocumentRequestApprovals.length > 0 
                            ? doc.DocumentRequestApprovals[0] 
                            : null;
                        
                        const approvalStatus = latestApproval ? latestApproval.status : 'no_request';
                        
                        console.log(`Document ${doc.title}: approval_status=${approvalStatus}`);
                        
                        // For assistant_coordinator: show approved documents and pending/no_request documents
                        // For regular coordinator: show pending, no_request, or approved status (hide rejected)
                        if (roleType === 'assistant_coordinator') {
                            // Show approved documents and pending/no_request documents
                            return approvalStatus === 'approved' || approvalStatus === 'pending' || approvalStatus === 'no_request';
                        } else {
                            // Regular coordinator: show all except rejected
                            return approvalStatus !== 'rejected';
                        }
                    });
                    console.log('Documents after filtering:', documentDataContainer.length);
                } else {
                    // Fallback to original logic if department not found - show all documents
                    console.log('Coordinator account or department not found, using fallback logic');
                    documentDataContainer = await Document.findAll({
                        where: { author_id: accountId, author_type: roleType, is_public: true },
                        include: [
                            {
                                model: Accounts,
                                include: [
                                    { 
                                        model: Coordinator, required: false,
                                        include: [
                                            { model: Department }
                                        ]
                                    },
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

                    // Filter out rejected documents
                    console.log('Fallback: Documents before filtering:', documentDataContainer.length);
                    documentDataContainer = documentDataContainer.filter(doc => {
                        const latestApproval = doc.DocumentRequestApprovals && doc.DocumentRequestApprovals.length > 0 
                            ? doc.DocumentRequestApprovals[0] 
                            : null;
                        
                        const approvalStatus = latestApproval ? latestApproval.status : 'no_request';
                        console.log(`Fallback Document ${doc.title}: approval_status=${approvalStatus}`);
                        return approvalStatus !== 'rejected';
                    });
                    console.log('Fallback: Documents after filtering:', documentDataContainer.length);
                }
                break
            
        }


        // Debug logging
        console.log('=== SUBMISSION CONTROLLER DEBUG ===');
        console.log('Role type:', roleType);
        console.log('Document count before filtering:', documentDataContainer.length);
        
        // Convert documents to submission-like format
        const convertedSubmissions = documentDataContainer.map(doc => {
            // Map document category to submission type
            const typeMap = {
                'Annual Report': 'Annual',
                'Monthly Report': 'Monthly',
                'Financial Statement': 'Quarterly',
                'Special': 'Special',
                'Compliance Document': 'Compliance'
            };

            // Get the latest approval request for this document
            const latestApproval = doc.DocumentRequestApprovals && doc.DocumentRequestApprovals.length > 0 
                ? doc.DocumentRequestApprovals[0] 
                : null;


            // Determine author information and department
            let authorInfo = null;
            let departmentName = 'Unknown Department';
            let departmentId = null;
            let submittedByDisplay = 'Unknown';

            // Ensure Account exists
            if (!doc.Account) {
                return null;
            }

            if (doc.Account.Director) {
                authorInfo = {
                    firstname: doc.Account.Director.firstname,
                    lastname: doc.Account.Director.lastname,
                    author_type: 'director'
                }
                departmentName = 'N/A';
                departmentId = null;
                
                // Check if this is the current user
                if (doc.author_id === accountId) {
                    submittedByDisplay = 'You';
                } else {
                    submittedByDisplay = `${doc.Account.Director.firstname} ${doc.Account.Director.lastname}`;
                }
            } else if (doc.Account.Staff) {
                authorInfo = {
                    firstname: doc.Account.Staff.firstname || 'No info yet',
                    lastname: doc.Account.Staff.lastname || '',
                    author_type: 'staff'
                };
                departmentName = 'N/A'
                departmentId = null
                
                // Check if this is the current user
                if (doc.author_id === accountId) {
                    submittedByDisplay = 'You';
                } else {
                    submittedByDisplay = `${doc.Account.Staff.firstname || 'Staff'} ${doc.Account.Staff.lastname || ''}`.trim();
                }
            } else if (doc.Account.Coordinator) {
                authorInfo = {
                    firstname: doc.Account.Coordinator.firstname,
                    lastname: doc.Account.Coordinator.lastname,
                    author_type: 'coordinator'
                };
                
                // Safely access department information
                if (doc.Account.Coordinator.Department) {
                    departmentName = doc.Account.Coordinator.Department.department_name || 'Unknown Department';
                    departmentId = doc.Account.Coordinator.Department.department_id || null;
                } else {
                    departmentName = 'Unknown Department';
                    departmentId = null;
                }
                
                // Check if this is the current user
                if (doc.author_id === accountId) {
                    submittedByDisplay = 'You';
                } else {
                    submittedByDisplay = `${doc.Account.Coordinator.firstname} ${doc.Account.Coordinator.lastname}`;
                }
            }

            // Map approval status to submission status
            const approvalStatus = latestApproval ? latestApproval.status : 'no_request';
            let submissionStatus = 'submitted'; // Default status
            
            // Map approval status to submission status for display
            switch(approvalStatus) {
                case 'pending':
                    submissionStatus = 'under_review';
                    break;
                case 'approved':
                    submissionStatus = 'approved';
                    break;
                case 'rejected':
                    submissionStatus = 'rejected';
                    break;
                case 'no_request':
                default:
                    submissionStatus = 'submitted';
                    break;
            }

            return {
                submission_id: `doc_${doc.document_id}`, // Prefix to distinguish from real submissions
                title: doc.title,
                description: doc.tags || '',
                submission_type: typeMap[doc.category] || 'Special',
                file_url: doc.file_url,
                public_url: supabase.storage.from('documents').getPublicUrl(doc.file_url).data.publicUrl,
                file_type: doc.file_type,
                file_size: doc.size,
                submitted_by: doc.author_id,
                submitted_by_display: submittedByDisplay, // Display name for "Submitted by" column
                department_id: departmentId,
                status: submissionStatus, // Map approval status to submission status
                is_active: true,
                is_document: true, // Flag to identify documents
                // Approval status information
                approval_status: approvalStatus,
                approval_request_id: latestApproval ? latestApproval.dra_id : null,
                reviewed_by: latestApproval ? latestApproval.reviewed_by : null,
                review_notes: latestApproval ? latestApproval.review_notes : null,
                rejection_reason: latestApproval ? latestApproval.rejection_reason : null,
                reviewed_at: latestApproval ? latestApproval.updatedAt : null,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
                Department: {
                    department_name: departmentName
                },
                Account: {
                    account_id: doc.author_id,
                    Director: doc.Account.Director ? {
                        firstname: doc.Account.Director.firstname,
                        lastname: doc.Account.Director.lastname
                    } : null,
                    Staff: doc.Account.Staff ? {
                        firstname: doc.Account.Staff.firstname,
                        lastname: doc.Account.Staff.lastname
                    } : null,
                    Coordinator: doc.Account.Coordinator ? {
                        firstname: doc.Account.Coordinator.firstname,
                        lastname: doc.Account.Coordinator.lastname
                    } : null
                },
                author_info: authorInfo
            };
        }).filter(submission => submission !== null); // Remove null entries

        console.log('Final submissions count:', convertedSubmissions.length);
        console.log('Sample submission:', convertedSubmissions[0]);
        console.log('=== END DEBUG ===');
        
        res.json({
            success: true,
            message: 'Documents converted to submissions successfully',
            data: convertedSubmissions
        });

    } catch (error) {
        console.error('Error converting documents to submissions:', error);
        res.json({
            success: false,
            message: 'Internal server error'
        });
    }
};
