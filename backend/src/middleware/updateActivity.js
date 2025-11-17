import models from '../models/index.js';

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
            });
        }
        
        next()
    } catch (error) {
        console.log('Activity middleware error:', error.message);
        next()
    }
};
