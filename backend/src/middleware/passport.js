import passport from "passport"
import models from "../models/index.js"
import { jwtStrategy } from '../config/jwtStrategy.js'
import { googleStrategy } from "../config/googleStrategy.js"
import { facebookStrategy } from "../config/facebookStrategy.js"

passport.use(jwtStrategy)
passport.use(googleStrategy)
passport.use(facebookStrategy)

passport.serializeUser((user, done) => {
    done(null, user.account_id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const { Accounts, Role } = models
        const user = await Accounts.findOne({ 
            where: { account_id: id },
            include: [{
                model: Role,
                attributes: ['name']
            }],attributes: { exclude: ['password'] }  
        })
        done(null, user)

    } catch (error) {
        done(error, null)
    }
})

export default passport