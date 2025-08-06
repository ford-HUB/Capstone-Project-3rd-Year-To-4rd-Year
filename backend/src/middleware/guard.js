import { jwtAuthenticate } from "./authentication.js"
import { authorizeRoles } from "./authorizeRoles.js"

export const guard = (...roles) => {
    return [
        jwtAuthenticate,
        authorizeRoles(...roles)
    ]
}