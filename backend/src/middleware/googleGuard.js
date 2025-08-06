
export const googleGuard = (...alowedRoles) => {
    return (req, res, next) => {
        if(!req.user || !alowedRoles.includes(req.user.Role.name))
        {
            res.json({ message: 'Unuathorized Request' })
            return
        }
        next()
    }
}