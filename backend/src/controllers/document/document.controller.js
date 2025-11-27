import models from "../../models/index.js";
import { testPolicies, updateFileInSupabase } from "../../utils/fileUpdateSupabase.js";
import supabase from "../../config/supabase.js";
import { Op } from "sequelize";
import { logManagementActivity, logDirectorActivity } from "../../services/activityLogService.js";

const { Document, DocumentRequestApproval } = models;

export const uploadDocument = async (req, res) => {
    try {
        const { title, category, tags } = req.validatedBody
        const files = req.files.file


        let uploadedDocuments = []

        const fileContain = Array.isArray(files) ? files : [files]
        
        for (const f of fileContain) {
            const filePath = `document/${Date.now()}-${f.name}`;

            // Validate file data exists
            if (!f.data || !Buffer.isBuffer(f.data)) {
                return res.json({ 
                    success: false,
                    message: `Invalid file data for ${f.name}. Please try uploading again.` 
                });
            }

            const fileData = await updateFileInSupabase(filePath, f.data, f.mimetype)
            if (!fileData) { 
                return res.json({ 
                    success: false,
                    message: `File upload to storage failed for ${f.name}. Please check your connection and try again.` 
                });
            }

            const newDocument = await Document.create({
                author_id: req.user.account_id,
                author_type: req.user.Role.name,
                title,
                category,
                tags,
                file_url: filePath, 
                file_type: f.mimetype,
                size: f.size,
                version: 1,
                is_public: true
            })

            if (!newDocument) { return res.json({ message: "Document upload failed" }) }

            // If uploaded by coordinator, automatically create approval request
            if (req.user.Role.name === 'coordinator' || req.user.Role.name === 'assistant_coordinator') {
                try {
                    await DocumentRequestApproval.create({
                        document_id: newDocument.document_id,
                        requested_by: req.user.account_id,
                        request_type: 'approval',
                        request_reason: `Document submission: ${title}`,
                        status: 'pending',
                        priority: 'medium'
                    });
                } catch (approvalError) {
                    console.error('Failed to create approval request:', approvalError);
                    // Don't fail the entire upload if approval request creation fails
                }

                // Log activity - Document uploaded by coordinator
                const accountId = req.user.account_id
                const roleType = req.user.Role.name
                const shortTitle = title.length > 40 ? title.substring(0, 37) + '...' : title
                const fileName = f.name.length > 30 ? f.name.substring(0, 27) + '...' : f.name
                const fileSizeKB = Math.round(f.size / 1024)
                const eventDetails = `"${shortTitle}" | ${category || 'N/A'} | File: ${fileName} | Size: ${fileSizeKB}KB`
                const logDescription = `Uploaded document: ${eventDetails}`

                await logManagementActivity(
                    accountId,
                    roleType.toLowerCase(),
                    'upload',
                    'document',
                    logDescription.substring(0, 255),
                    req.ip || req.connection.remoteAddress,
                    req.get('user-agent')
                )
            }

            // Log activity - Document uploaded by director
            if (req.user.Role.name === 'director') {
                const accountId = req.user.account_id
                const shortTitle = title.length > 40 ? title.substring(0, 37) + '...' : title
                const fileName = f.name.length > 30 ? f.name.substring(0, 27) + '...' : f.name
                const fileSizeKB = Math.round(f.size / 1024)
                const eventDetails = `"${shortTitle}" | ${category || 'N/A'} | File: ${fileName} | Size: ${fileSizeKB}KB`
                const logDescription = `Uploaded document: ${eventDetails}`

                await logDirectorActivity(
                    accountId,
                    'upload',
                    'document',
                    logDescription.substring(0, 255),
                    req.ip || req.connection.remoteAddress,
                    req.get('user-agent')
                )
            }

            uploadedDocuments.push(newDocument)
        }

        return res.json({ success: true, message: `${uploadedDocuments.length} document(s) uploaded successfully` })
    } 
    catch (error) {
        console.error("upload document failed:", error.message);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error during document upload",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}


export const getAllDocuments = async (req, res) => {
    try {
        const { Document, Accounts, Director, Staff, Coordinator, Department, DocumentRequestApproval } = models
        const accountId = req.user.account_id;
        const { tab } = req.query; // Get tab parameter for filtering

        const roleType = req.user.Role.name;

        let documentDataContainer = []

        switch(roleType) {
            case 'director':
                // For directors, show all approved documents by default, or filter by tab
                let directorWhereClause = { status: 'approved' };
                if (tab === 'submitted-documents') {
                    directorWhereClause = { 
                        [Op.or]: [
                            { status: 'pending' },
                            { status: 'rejected' }
                        ]
                    };
                } else if (tab === 'all-records-documents') {
                    // Show all documents regardless of status
                    directorWhereClause = {};
                }
                
                
                // Try to get documents from DocumentRequestApproval first
                documentDataContainer = await DocumentRequestApproval.findAll(
                    {
                        where: directorWhereClause,
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
                                    },
                                    {
                                        model: DocumentRequestApproval,
                                        required: false,
                                        order: [['createdAt', 'DESC']]
                                    }
                                ]
                            }
                        ]
                    },
                )
                
                // If no documents found and we're looking for all records, try direct Document query
                if (documentDataContainer.length === 0 && tab === 'all-records-documents') {
                    documentDataContainer = await Document.findAll({
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
                            },
                            {
                                model: DocumentRequestApproval,
                                required: false,
                                order: [['createdAt', 'DESC']]
                            }
                        ],
                        order: [['createdAt', 'DESC']]
                    });
                }
                break
            case 'staff':
                // For staff, show all approved documents by default, or filter by tab
                let staffWhereClause = { status: 'approved' };
                if (tab === 'submitted-documents') {
                    staffWhereClause = { 
                        [Op.or]: [
                            { status: 'pending' },
                            { status: 'rejected' }
                        ]
                    };
                } else if (tab === 'all-records-documents') {
                    // Show all documents regardless of status
                    staffWhereClause = {};
                }
                
                
                // Try to get documents from DocumentRequestApproval first
                documentDataContainer = await DocumentRequestApproval.findAll(
                    {
                        where: staffWhereClause,
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
                                    },
                                    {
                                        model: DocumentRequestApproval,
                                        required: false,
                                        order: [['createdAt', 'DESC']]
                                    }
                                ]
                            }
                        ]
                    },
                )
                
                // If no documents found and we're looking for all records, try direct Document query
                if (documentDataContainer.length === 0 && tab === 'all-records-documents') {
                    documentDataContainer = await Document.findAll({
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
                            },
                            {
                                model: DocumentRequestApproval,
                                required: false,
                                order: [['createdAt', 'DESC']]
                            }
                        ],
                        order: [['createdAt', 'DESC']]
                    });
                }
                break
            
            case 'coordinator':
                documentDataContainer = await Document.findAll(
                    {
                        where: { author_id: accountId, author_type: roleType },
                        include: [
                            {
                                model: Accounts,
                                include: [
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
                                model: DocumentRequestApproval,
                                required: false,
                                order: [['createdAt', 'DESC']]
                            }
                        ]
                    },
                )
                break
            case 'assistant_coordinator':
                // For assistant_coordinator, show documents from all coordinators in the same department
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
                    console.log('Assistant coordinator account found, fetching documents for department:', coordinatorAccount.Coordinator.Department.department_id);
                    
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
                            author_type: { [Op.in]: ['coordinator', 'assistant_coordinator'] }, // Include both coordinator and assistant_coordinator documents
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
                } else {
                    console.log('Assistant coordinator account or department not found, using fallback');
                    // Fallback: only show own documents
                    documentDataContainer = await Document.findAll({
                        where: { author_id: accountId, author_type: roleType },
                        include: [
                            {
                                model: Accounts,
                                include: [
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
                                model: DocumentRequestApproval,
                                required: false,
                                order: [['createdAt', 'DESC']]
                            }
                        ]
                    });
                }
                 break
            
                default :
                    console.log('role type is out of our scope')
        }


        if(documentDataContainer.length === 0) { return res.json({ message: 'documents currently empty' }) }

        const formattedList = documentDataContainer.map(list => {
            // For director and staff roles, we need to access the nested Document data
            // But only if we got data from DocumentRequestApproval, otherwise it's already a Document
            let documentData;
            if ((roleType === 'director' || roleType === 'staff') && list.Document) {
                documentData = list.Document;
            } else {
                documentData = list;
            }
            
            
            // Get the latest approval request for this document
            const latestApproval = documentData.DocumentRequestApprovals && documentData.DocumentRequestApprovals.length > 0 
                ? documentData.DocumentRequestApprovals[0] 
                : null;

            const documenData = {
                document_id: documentData.document_id,
                title: documentData.title,
                category: documentData.category,
                public_url: supabase.storage.from('documents').getPublicUrl(documentData.file_url).data.publicUrl,
                file_type: documentData.file_type,
                tags: documentData.tags,
                size: documentData.size,
                is_public: documentData.is_public,
                approval_status: latestApproval ? latestApproval.status : 'no_request',
                approval_request_id: latestApproval ? latestApproval.dra_id : null,
                reviewed_by: latestApproval ? latestApproval.reviewed_by : null,
                review_notes: latestApproval ? latestApproval.review_notes : null,
                rejection_reason: latestApproval ? latestApproval.rejection_reason : null,
                reviewed_at: latestApproval ? latestApproval.updatedAt : null,
                author: null,
                createdAt: documentData.createdAt,
                updatedAt: documentData.updatedAt

            }

            if(documentData.Account.Director) {
                documenData.author = {
                    author_id: documentData.Account.Director.director_id,
                    author_firstname: documentData.Account.Director.firstname,
                    author_lastname: documentData.Account.Director.lastname,
                    author_type: documentData.author_type,
                    author_avatar: documentData.Account.Director.profile_image
                }
            } else if (documentData.Account.Staff) {
                documenData.author = {
                    author_id: documentData.Account.Staff.staff_id,
                    author_firstname: documentData.Account.Staff.firstname || 'no info yet',
                    author_lastname: documentData.Account.Staff.lastname || '',
                    author_type: documentData.author_type,
                }
            } else if (documentData.Account.Coordinator) {
                documenData.author = {
                    author_id: documentData.Account.Coordinator.coordinator_id,
                    author_firstname: documentData.Account.Coordinator.firstname,
                    author_lastname: documentData.Account.Coordinator.lastname,
                    author_type: documentData.author_type,
                    author_avatar: documentData.Account.Coordinator.profile_image,
                    department: documentData.Account.Coordinator.Department ? {
                        department_id: documentData.Account.Coordinator.Department.department_id,
                        department_name: documentData.Account.Coordinator.Department.department_name
                    } : null
                }
            } else {
                documenData.author = {
                    author_id: null,
                    author_name: null,
                    author_type: 'author type not found',
                }
            }

            return documenData
        })

        return res.json({ success: true, list: formattedList })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('get all documents failed: ', error.message)
    }
}

export const deleteDocuments = async (req, res) => {
    try {
        const { ids } = req.params
        const { Document } = models
        const roleType = req.user.Role.name

        // Get document info before deletion for logging (only for directors)
        let documentsToLog = []
        if (roleType === 'director') {
            const documentIds = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
            documentsToLog = await Document.findAll({
                where: { document_id: documentIds },
                attributes: ['document_id', 'title', 'category']
            })
        }

        const destroyDocs = await Document.destroy({ where: { document_id: ids } })

        if(!destroyDocs) { return res.json({ message: 'Document failed to delete' }) }

        // Log activity - Document deleted (only for directors)
        if (roleType === 'director' && documentsToLog.length > 0) {
            for (const doc of documentsToLog) {
                const shortTitle = doc.title.length > 40 ? doc.title.substring(0, 37) + '...' : doc.title
                const eventDetails = `"${shortTitle}" | ${doc.category || 'N/A'}`
                const logDescription = `Deleted document: ${eventDetails}`
                
                await logDirectorActivity(
                    req.user.account_id,
                    'delete',
                    'document',
                    logDescription.substring(0, 255),
                    req.ip || req.connection.remoteAddress,
                    req.get('user-agent')
                )
            }
        }

        return res.json({ success: true, message: 'Document succcessfully deleted' })

    } catch (error) {
        console.log('delete document failed: ', error.message)
    }
}

/**
 * Get documents specifically for MonthlyTodo functionality
 * Includes role-based filtering and approval status handling
 */
export const getMonthlyTodoDocuments = async (req, res) => {
    try {
        const { department_id, submission_type, status, submitted_by } = req.query;
        const { Document, Accounts, Director, Staff, Coordinator, Department, DocumentRequestApproval } = models
        const accountId = req.user.account_id;
        const roleType = req.user.Role.name;

        let documentWhereClause = { is_public: true };

        // Apply filters
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

        let documentDataContainer = [];

        // MonthlyTodo is specifically for Coordinators only
        if (roleType !== 'coordinator' && roleType !== 'assistant_coordinator') {
            return res.json({
                success: false,
                message: 'MonthlyTodo functionality is only available for coordinators'
            });
        }
        
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
            
            // Fetch all documents for this coordinator
            documentDataContainer = await Document.findAll({
                where: { 
                    author_id: accountId, 
                    author_type: roleType, 
                    ...documentWhereClause 
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

            // Apply monthlyTodo-specific filtering: hide rejected documents
            documentDataContainer = documentDataContainer.filter(doc => {
                const latestApproval = doc.DocumentRequestApprovals && doc.DocumentRequestApprovals.length > 0 
                    ? doc.DocumentRequestApprovals[0] 
                    : null;
                
                const approvalStatus = latestApproval ? latestApproval.status : 'no_request';
                
                // MonthlyTodo logic: show pending, no_request, approved; hide rejected
                return approvalStatus !== 'rejected';
            });
        } else {
            // Fallback logic
            documentDataContainer = await Document.findAll({
                where: { 
                    author_id: accountId, 
                    author_type: roleType, 
                    ...documentWhereClause 
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

            // Apply monthlyTodo filtering
            documentDataContainer = documentDataContainer.filter(doc => {
                const latestApproval = doc.DocumentRequestApprovals && doc.DocumentRequestApprovals.length > 0 
                    ? doc.DocumentRequestApprovals[0] 
                    : null;
                
                const approvalStatus = latestApproval ? latestApproval.status : 'no_request';
                return approvalStatus !== 'rejected';
            });
        }

        // Convert documents to monthlyTodo format (coordinator-specific)
        const monthlyTodoDocuments = documentDataContainer.map(doc => {
            // For coordinators, we use the document directly
            const documentData = doc;
            
            // Map document category to submission type
            const typeMap = {
                'Annual Report': 'Annual',
                'Monthly Report': 'Monthly',
                'Financial Statement': 'Quarterly',
                'Special': 'Special',
                'Compliance Document': 'Compliance'
            };

            // Get the latest approval request for this document
            const latestApproval = documentData.DocumentRequestApprovals && documentData.DocumentRequestApprovals.length > 0 
                ? documentData.DocumentRequestApprovals[0] 
                : null;

            // Map approval status to submission status for monthlyTodo
            const approvalStatus = latestApproval ? latestApproval.status : 'no_request';
            let submissionStatus = 'submitted'; // Default status
            
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

            // Determine author information and department
            let authorInfo = null;
            let departmentName = 'Unknown Department';
            let departmentId = null;
            let submittedByDisplay = 'Unknown';

            if (!documentData.Account) {
                return null;
            }

            if (documentData.Account.Director) {
                authorInfo = {
                    firstname: documentData.Account.Director.firstname,
                    lastname: documentData.Account.Director.lastname,
                    author_type: 'director'
                };
                departmentName = 'N/A';
                departmentId = null;
                
                if (documentData.author_id === accountId) {
                    submittedByDisplay = 'You';
                } else {
                    submittedByDisplay = `${documentData.Account.Director.firstname} ${documentData.Account.Director.lastname}`;
                }
            } else if (documentData.Account.Staff) {
                authorInfo = {
                    firstname: documentData.Account.Staff.firstname || 'No info yet',
                    lastname: documentData.Account.Staff.lastname || '',
                    author_type: 'staff'
                };
                departmentName = 'N/A';
                departmentId = null;
                
                if (documentData.author_id === accountId) {
                    submittedByDisplay = 'You';
                } else {
                    submittedByDisplay = `${documentData.Account.Staff.firstname || 'Staff'} ${documentData.Account.Staff.lastname || ''}`.trim();
                }
            } else if (documentData.Account.Coordinator) {
                authorInfo = {
                    firstname: documentData.Account.Coordinator.firstname,
                    lastname: documentData.Account.Coordinator.lastname,
                    author_type: 'coordinator'
                };
                
                if (documentData.Account.Coordinator.Department) {
                    departmentName = documentData.Account.Coordinator.Department.department_name || 'Unknown Department';
                    departmentId = documentData.Account.Coordinator.Department.department_id || null;
                } else {
                    departmentName = 'Unknown Department';
                    departmentId = null;
                }
                
                if (documentData.author_id === accountId) {
                    submittedByDisplay = 'You';
                } else {
                    submittedByDisplay = `${documentData.Account.Coordinator.firstname} ${documentData.Account.Coordinator.lastname}`;
                }
            }

            return {
                submission_id: `doc_${documentData.document_id}`,
                title: documentData.title,
                description: documentData.tags || '',
                submission_type: typeMap[documentData.category] || 'Special',
                file_url: documentData.file_url,
                public_url: supabase.storage.from('documents').getPublicUrl(documentData.file_url).data.publicUrl,
                file_type: documentData.file_type,
                file_size: documentData.size,
                submitted_by: documentData.author_id,
                submitted_by_display: submittedByDisplay,
                department_id: departmentId,
                status: submissionStatus,
                is_active: true,
                is_document: true,
                // Approval status information
                approval_status: approvalStatus,
                approval_request_id: latestApproval ? latestApproval.dra_id : null,
                reviewed_by: latestApproval ? latestApproval.reviewed_by : null,
                review_notes: latestApproval ? latestApproval.review_notes : null,
                rejection_reason: latestApproval ? latestApproval.rejection_reason : null,
                reviewed_at: latestApproval ? latestApproval.updatedAt : null,
                createdAt: documentData.createdAt,
                updatedAt: documentData.updatedAt,
                Department: {
                    department_name: departmentName
                },
                Account: {
                    account_id: documentData.Account.account_id,
                    email: documentData.Account.email,
                    role: documentData.Account.role
                },
                author_info: authorInfo
            };
        }).filter(submission => submission !== null);

        // Also fetch requirements for the coordinator
        const { Requirement, RequirementVisibility } = models;
        const requirements = await Requirement.findAll({
            where: {
                is_active: true
            },
            include: [
                {
                    model: Director,
                    attributes: ['firstname', 'lastname']
                },
                {
                    model: RequirementVisibility,
                    where: {
                        role: roleType
                    },
                    attributes: []
                }
            ],
            order: [['due_date', 'ASC']]
        });
        
        // Convert requirements to the format expected by the frontend
        const monthlyTodoRequirements = requirements.map(req => ({
            requirement_id: req.requirement_id,
            title: req.title,
            description: req.description,
            due_date: req.due_date,
            category: req.category,
            is_required: req.is_required,
            created_by: req.created_by,
            is_active: req.is_active,
            createdAt: req.createdAt,
            updatedAt: req.updatedAt,
            Director: req.Director
        }));
        

        res.json({
            success: true,
            message: 'MonthlyTodo data fetched successfully',
            data: monthlyTodoDocuments,
            requirements: monthlyTodoRequirements,
            total: monthlyTodoDocuments.length,
            requirementsCount: monthlyTodoRequirements.length,
            role: roleType,
            filters: {
                department_id,
                submission_type,
                status,
                submitted_by
            }
        });

    } catch (error) {
        console.error('Error in getMonthlyTodoDocuments:', error);
        res.json({
            success: false,
            message: 'Internal server error in monthlyTodo function',
            error: error.message
        });
    }
};

