import models from "../../models/index.js";
import { Op } from "sequelize";
import { generateFormResponseSchema } from "../../validators/form.validator.js";

const { Form, FormResponse, FlexibleResponse, Category, Event, Accounts } = models;

export const createForm = async (req, res) => {
    try {
        const { title, description, category_id, event_id, form_schema } = req.body;
        const created_by = req.user.account_id;

        // Validate required fields
        if (!title || !form_schema) {
            return res.status(400).json({
                success: false,
                message: "Title and form schema are required"
            });
        }

        // Create the form
        const form = await Form.create({
            title,
            description,
            category_id: category_id || null,
            event_id: event_id || null,
            created_by,
            form_schema,
            is_active: true,
            is_public: true
        });

        return res.status(201).json({
            success: true,
            message: "Form created successfully",
            form
        });

    } catch (error) {
        console.error("Create form error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getForms = async (req, res) => {
    try {
        const { category_id, event_id, is_active, is_public } = req.query;
        
        const whereClause = {};
        
        if (category_id) whereClause.category_id = category_id;
        if (event_id) whereClause.event_id = event_id;
        if (is_active !== undefined) whereClause.is_active = is_active === 'true';
        if (is_public !== undefined) whereClause.is_public = is_public === 'true';

        const forms = await Form.findAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    attributes: ['category_id', 'name']
                },
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'status']
                },
                {
                    model: Accounts,
                    attributes: ['account_id', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Forms retrieved successfully",
            forms
        });

    } catch (error) {
        console.error("Get forms error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getFormById = async (req, res) => {
    try {
        const { form_id } = req.params;

        const form = await Form.findByPk(form_id, {
            include: [
                {
                    model: Category,
                    attributes: ['category_id', 'name']
                },
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'status']
                },
                {
                    model: Accounts,
                    attributes: ['account_id', 'email']
                }
            ]
        });

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Form retrieved successfully",
            form
        });

    } catch (error) {
        console.error("Get form by ID error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateForm = async (req, res) => {
    try {
        const { form_id } = req.params;
        const { title, description, category_id, event_id, form_schema, is_active, is_public } = req.body;

        const form = await Form.findByPk(form_id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found"
            });
        }

        // Update form fields
        if (title) form.title = title;
        if (description !== undefined) form.description = description;
        if (category_id !== undefined) form.category_id = category_id;
        if (event_id !== undefined) form.event_id = event_id;
        if (form_schema) form.form_schema = form_schema;
        if (is_active !== undefined) form.is_active = is_active;
        if (is_public !== undefined) form.is_public = is_public;

        await form.save();

        return res.status(200).json({
            success: true,
            message: "Form updated successfully",
            form
        });

    } catch (error) {
        console.error("Update form error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteForm = async (req, res) => {
    try {
        const { form_id } = req.params;

        const form = await Form.findByPk(form_id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found"
            });
        }

        await form.destroy();

        return res.status(200).json({
            success: true,
            message: "Form deleted successfully"
        });

    } catch (error) {
        console.error("Delete form error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const submitFormResponse = async (req, res) => {
    try {
        const { form_id } = req.params;
        const { response_data, participant_type = 'beneficiary' } = req.body;
        const participant_id = req.user.account_id;

        return console.log('submitFormResponse called with:', { form_id, response_data, participant_id, participant_type });

        // Validate form exists
        const form = await Form.findByPk(form_id);
        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found"
            });
        }

        if (!form.is_active) {
            return res.status(400).json({
                success: false,
                message: "Form is not active"
            });
        }

        // Generate dynamic validation schema based on form schema
        const dynamicSchema = generateFormResponseSchema(form.form_schema);
        
        // Validate response data against dynamic schema
        const { error, value } = dynamicSchema.validate(response_data);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            });
        }

        // Check if user already submitted a response for this form and event
        const existingResponse = await FlexibleResponse.findOne({
            where: {
                form_id,
                event_id: form.event_id,
                participant_id,
                participant_type
            }
        });

        if (existingResponse) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted a response to this form"
            });
        }

        // Create flexible response with validated data
        const flexibleResponse = await FlexibleResponse.create({
            form_id,
            event_id: form.event_id,
            participant_id,
            participant_type,
            response_data: value, // Use validated data
            submitted_at: new Date()
        });

        console.log('FlexibleResponse created:', flexibleResponse);

        return res.status(201).json({
            success: true,
            message: "Form response submitted successfully",
            response: flexibleResponse
        });

    } catch (error) {
        console.error("Submit form response error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getFormResponses = async (req, res) => {
    try {
        const { form_id } = req.params;

        const form = await Form.findByPk(form_id);
        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found"
            });
        }

        const responses = await FormResponse.findAll({
            where: { form_id },
            include: [
                {
                    model: Accounts,
                    attributes: ['account_id', 'email']
                }
            ],
            order: [['submitted_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Form responses retrieved successfully",
            responses
        });

    } catch (error) {
        console.error("Get form responses error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['category_id', 'name'],
            order: [['name', 'ASC']]
        });

        return res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            categories
        });

    } catch (error) {
        console.error("Get categories error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get forms for dynamic reflection based on category and event
export const getFormsForReflection = async (req, res) => {
    try {
        const { category_id, event_id } = req.query;
        
        console.log('getFormsForReflection called with:', { category_id, event_id });
        
        const whereClause = {
            is_active: true,
            is_public: true
        };
        
        // If both category_id and event_id are provided, prioritize event-specific forms
        if (event_id) {
            whereClause.event_id = event_id;
        } else if (category_id) {
            whereClause.category_id = category_id;
        }

        // Add hint-based matching for beneficiary forms
        // This allows forms with titles containing "Beneficiary Event Feedback" to be matched
        const beneficiaryHintCondition = {
            [Op.or]: [
                { target_role: 'beneficiary' },
                { target_role: 'all' },
                { 
                    title: {
                        [Op.iLike]: '%Beneficiary Event Feedback%'
                    }
                }
            ]
        };

        // If we have specific conditions, combine them with beneficiary hint
        if (event_id || category_id) {
            whereClause[Op.and] = [
                whereClause,
                beneficiaryHintCondition
            ];
            // Remove the original conditions since they're now in Op.and
            delete whereClause.event_id;
            delete whereClause.category_id;
        } else {
            // If no specific conditions, just use beneficiary hint
            Object.assign(whereClause, beneficiaryHintCondition);
        }

        console.log('Where clause:', whereClause);

        const forms = await Form.findAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    attributes: ['category_id', 'name']
                },
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'status']
                }
            ],
            order: [
                // Prioritize event-specific forms, then category-specific, then general
                ['event_id', 'ASC NULLS LAST'],
                ['category_id', 'ASC NULLS LAST'],
                ['createdAt', 'DESC']
            ]
        });

        console.log('Found forms:', forms.length);
        console.log('Forms data:', forms.map(f => ({ id: f.form_id, title: f.title, event_id: f.event_id, category_id: f.category_id })));

        return res.status(200).json({
            success: true,
            message: "Forms retrieved successfully for reflection",
            forms
        });

    } catch (error) {
        console.error("Get forms for reflection error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const submitMultipleFormResponses = async (req, res) => {
    try {
        const { form_responses } = req.body;
        const respondent_id = req.user.account_id;

        if (!form_responses || !Array.isArray(form_responses)) {
            return res.status(400).json({
                success: false,
                message: "Form responses array is required"
            });
        }

        const submittedResponses = [];
        const errors = [];

        // Process each form response
        for (const formResponse of form_responses) {
            const { form_id, response_data } = formResponse;

            try {
                // Validate form exists
                const form = await Form.findByPk(form_id);
                if (!form) {
                    errors.push({
                        form_id,
                        error: "Form not found"
                    });
                    continue;
                }

                if (!form.is_active) {
                    errors.push({
                        form_id,
                        error: "Form is not active"
                    });
                    continue;
                }

                // Generate dynamic validation schema based on form schema
                const dynamicSchema = generateFormResponseSchema(form.form_schema);
                
                // Validate response data against dynamic schema
                const { error, value } = dynamicSchema.validate(response_data);
                if (error) {
                    errors.push({
                        form_id,
                        error: "Validation error",
                        details: error.details.map(detail => ({
                            field: detail.path.join('.'),
                            message: detail.message
                        }))
                    });
                    continue;
                }

                // Check if user already submitted a response
                const existingResponse = await FormResponse.findOne({
                    where: {
                        form_id,
                        respondent_id
                    }
                });

                if (existingResponse) {
                    errors.push({
                        form_id,
                        error: "You have already submitted a response to this form"
                    });
                    continue;
                }

                // Create form response with validated data
                const newFormResponse = await FormResponse.create({
                    form_id,
                    respondent_id,
                    response_data: value, // Use validated data
                    submitted_at: new Date()
                });

                submittedResponses.push(newFormResponse);

            } catch (error) {
                console.error(`Error processing form ${form_id}:`, error);
                errors.push({
                    form_id,
                    error: "Internal server error"
                });
            }
        }

        return res.status(201).json({
            success: true,
            message: `Successfully submitted ${submittedResponses.length} form responses`,
            responses: submittedResponses,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error("Submit multiple form responses error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
