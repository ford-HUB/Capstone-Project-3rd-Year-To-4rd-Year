
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user) { 
            return res.json({ message: 'Unauthorized Request' }) 
        }

        if(!req.user.Role || !req.user.Role.name) {
            return res.json({ message: 'Unauthorized Role Access' })
        }

        if(!allowedRoles.includes(req.user.Role.name))
        {
            return res.json({ message: 'Unauthorized Role Access' })
        }

        next()
    }
}