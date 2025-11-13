
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user) { 
            return res.json({ message: 'Unauthorized Request' }) 
        }

        if(!allowedRoles.includes(req.user.Role.name))
        {
            return res.json({ message: 'Unauthorized Role Access' })
        }

        next()
    }
}