
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        if(!req.user) { return res.json({ message: 'Unuathorized Request' }) }

        if(!allowedRoles.includes(req.user.Role.name))
        {
            return res.json({ message: 'Unuathorized Role Access' })
        }

        next()
    }
}