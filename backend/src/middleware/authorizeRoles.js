
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user) { 
            console.log('authorizeRoles: no user', { path: req.path })
            return res.json({ message: 'Unauthorized Request' }) 
        }

        if(!req.user.Role || !req.user.Role.name) {
            console.log('authorizeRoles: user has no role', { 
                userId: req.user.account_id,
                path: req.path 
            })
            return res.json({ message: 'Unauthorized Role Access' })
        }

        if(!allowedRoles.includes(req.user.Role.name))
        {
            console.log('authorizeRoles: role mismatch', {
                userId: req.user.account_id,
                userRole: req.user.Role.name,
                allowedRoles,
                path: req.path
            })
            return res.json({ message: 'Unauthorized Role Access' })
        }

        console.log('authorizeRoles: authorized', {
            userId: req.user.account_id,
            role: req.user.Role.name,
            path: req.path
        })
        next()
    }
}