import models from '../models/index.js';

// Middleware to update user's last active timestamp
export const updateUserActivity = async (req, res, next) => {
    try {
        // Only update if user is authenticated
        if (req.user && req.user.account_id) {
            const { Accounts } = models;
            
            // Update activeAt timestamp (non-blocking)
            Accounts.update(
                { activeAt: new Date() },
                { where: { account_id: req.user.account_id } }
            ).catch(err => {
                console.log('Activity update failed:', err.message);
                // Don't throw error, just log it
            });
        }
        
        next();
    } catch (error) {
        console.log('Activity middleware error:', error.message);
        next(); // Continue even if activity update fails
    }
};
