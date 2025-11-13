import { jwtAuthenticate } from "./authentication.js"
import { authorizeRoles } from "./authorizeRoles.js"
import { updateUserActivity } from "./updateActivity.js"

export const guard = (...roles) => {
    return [
        jwtAuthenticate,
        updateUserActivity,
        authorizeRoles(...roles)
    ]
}