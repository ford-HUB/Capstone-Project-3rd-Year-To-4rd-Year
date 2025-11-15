// Middleware to ensure OAuth session is valid before processing
export const oauthSessionGuard = (req, res, next) => {
    // Check if user is authenticated via Passport session
    if (!req.user) {
        console.error('OAuth session guard: No user in session', {
            path: req.path,
            hasSession: !!req.session,
            sessionId: req.sessionID
        });
        const FRONTEND_URL = process.env.NODE_ENV === 'development'
            ? process.env.FRONT_END_URL
            : process.env.FRONTEND_URL_PROD;
        return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=session_expired`);
    }
    
    // Check if user has a role
    if (!req.user.Role) {
        console.error('OAuth session guard: User has no role', {
            userId: req.user.account_id,
            email: req.user.email
        });
        const FRONTEND_URL = process.env.NODE_ENV === 'development'
            ? process.env.FRONT_END_URL
            : process.env.FRONTEND_URL_PROD;
        return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=no_role`);
    }
    
    next();
}

