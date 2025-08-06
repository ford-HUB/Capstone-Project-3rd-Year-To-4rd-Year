import models from "../../models/index.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../../utils/generateToken.js";

export const login = async (req, res) => {
    try {
        const { Accounts } = models
        const { email, password } = req.validatedBody

        const isEmailValid = await Accounts.findOne({ where: { email: email } })
        if(!isEmailValid) { return res.json({ message: 'Invalid Credentials' }) }

        const isMatch = await bcrypt.compare(password, isEmailValid.password)
        if(!isMatch) { return res.json({ message: 'Invalid Credentials' }) }

        await Accounts.update({ is_active: true }, { where: { account_id: isEmailValid.account_id }})

        await generateToken(isEmailValid.account_id, res)

        res.json({ success: true, message: 'Welcome Director! You LoggedIn Successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('login controller failed :', error.message)
    }
}

export const check_auth_director = async (req, res) => {
    try {
        res.json({ success: true, user: req.user })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('login controller failed :', error.message)
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV === 'production'
        })

        return res.json({ success: true, message: 'logout successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('logout controller failed :', error.message)
    }
}