import models from '../../models/index.js';
import { Op } from 'sequelize';

const { Requirement, RequirementVisibility, Director } = models;

// Create a new requirement
export const createRequirement = async (req, res) => {
    try {
        const { title, description, dueDate, category, isRequired } = req.validatedBody;
        const accountId = req.user.account_id;
        const { Director } = models;
        
        // Creating requirement with validated data

        
        // Get director_id from account_id
        const director = await Director.findOne({ where: { account_id: accountId } });
        if (!director) {
            return res.json({ success: false, message: 'Director profile not found' });
        }
        
        // Create the requirement
        const newRequirement = await Requirement.create({
            title,
            description,
            due_date: dueDate,
            category,
            is_required: isRequired,
            created_by: director.director_id,
            is_active: true
        });

        if(!newRequirement) { 
            return res.json({ success: false, message: 'create requirements failed' });
        }
        
        // Set default visibility for staff and coordinators
        const visibility = await RequirementVisibility.bulkCreate([
            { requirement_id: newRequirement.requirement_id, role: 'staff' },
            { requirement_id: newRequirement.requirement_id, role: 'coordinator' }
        ]);

        if (!visibility) {
            return res.json({ success: false, message: 'Requirement visibility not created' });
        }

        const fetchedRequirement = await Requirement.findByPk(newRequirement.requirement_id, {
            include: [{
                model: Director,
                attributes: ['firstname', 'lastname']
            }]
        });
        
        res.json({
            success: true,
            message: 'Requirement created successfully',
            data: fetchedRequirement
        });
        
    } catch (error) {
        console.error('Error creating requirement:', error);
        res.json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all requirements (for directors)
export const getAllRequirements = async (req, res) => {
    try {
        const requirements = await Requirement.findAll({
            where: {
                is_active: true
            },
            include: [{
                model: Director,
                attributes: ['firstname', 'lastname']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        res.json({
            success: true,
            message: 'Requirements retrieved successfully',
            data: requirements
        });
        
    } catch (error) {
        console.error('Error fetching requirements:', error);
        res.json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get requirements visible to specific role (for staff/coordinators)
export const getRequirementsForRole = async (req, res) => {
    try {
        const { role } = req.params;
        
        // Validate role
        if (!['staff', 'coordinator', 'director'].includes(role)) {
            return res.json({
                success: false,
                message: 'Invalid role specified'
            });
        }
        
        let requirements;
        
        if (role === 'director') {
            // Directors can see all requirements
            requirements = await Requirement.findAll({
                where: {
                    is_active: true
                },
                include: [
                    {
                        model: Director,
                        attributes: ['firstname', 'lastname']
                    }
                ],
                order: [['due_date', 'ASC']]
            });
        } else {
            // Other roles see only requirements visible to them
            requirements = await Requirement.findAll({
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
                            role: role
                        },
                        attributes: []
                    }
                ],
                order: [['due_date', 'ASC']]
            });
        }
        
        res.json({
            success: true,
            message: 'Requirements retrieved successfully',
            data: requirements
        });
        
    } catch (error) {
        console.error('Error fetching requirements for role:', error);
        
        res.json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update a requirement
export const updateRequirement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, category, isRequired } = req.validatedBody;
        const accountId = req.user.account_id;
        const { Director } = models;
        
        // Updating requirement with validated data
        
        // Get director_id from account_id
        const director = await Director.findOne({ where: { account_id: accountId } });
        if (!director) {
            return res.json({ success: false, message: 'Director profile not found' });
        }
        
        // Check if requirement exists and user has permission
        const existing = await Requirement.findOne({
            where: {
                requirement_id: id,
                created_by: director.director_id,
                is_active: true
            }
        });
        
        if (!existing) {
            return res.json({
                success: false,
                message: 'Requirement not found or you do not have permission to edit it'
            });
        }
        
        // Update requirement
        await Requirement.update({
            title,
            description,
            due_date: dueDate,
            category,
            is_required: isRequired
        }, {
            where: {
                requirement_id: id
            }
        });
        
        // Fetch updated requirement
        const updatedRequirement = await Requirement.findByPk(id, {
            include: [{
                model: Director,
                attributes: ['firstname', 'lastname']
            }]
        });
        
        res.json({
            success: true,
            message: 'Requirement updated successfully',
            data: updatedRequirement
        });
        
    } catch (error) {
        console.error('Error updating requirement:', error);
        
        res.json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete a requirement (soft delete)
export const deleteRequirement = async (req, res) => {
    try {
        const { id } = req.params;
        const accountId = req.user.account_id;
        const { Director } = models;
        
        // Get director_id from account_id
        const director = await Director.findOne({ where: { account_id: accountId } });
        if (!director) {
            return res.json({ success: false, message: 'Director profile not found' });
        }
        
        // Check if requirement exists and user has permission
        const existing = await Requirement.findOne({
            where: {
                requirement_id: id,
                created_by: director.director_id,
                is_active: true
            }
        });
        
        if (!existing) {
            return res.json({
                success: false,
                message: 'Requirement not found or you do not have permission to delete it'
            });
        }
        
        // Soft delete requirement
        await Requirement.update({
            is_active: false
        }, {
            where: {
                requirement_id: id
            }
        });
        
        res.json({
            success: true,
            message: 'Requirement deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting requirement:', error);
        
        res.json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get requirement by ID
export const getRequirementById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const requirement = await Requirement.findOne({
            where: {
                requirement_id: id,
                is_active: true
            },
            include: [{
                model: Director,
                attributes: ['firstname', 'lastname']
            }]
        });
        
        if (!requirement) {
            return res.json({
                success: false,
                message: 'Requirement not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Requirement retrieved successfully',
            data: requirement
        });
        
    } catch (error) {
        console.error('Error fetching requirement:', error);
        
        res.json({
            success: false,
            message: 'Internal server error'
        });
    }
};
