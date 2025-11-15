import models from "../../models/index.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../../utils/generateToken.js";
import { clearJwtCookie } from "../../utils/clearJwtCookie.js";

export const login = async (req, res) => {
    try {
        const { Accounts, Role } = models
        const { email, password } = req.validatedBody

        const isEmailValid = await Accounts.findOne({ 
            where: { email: email },
            include: [
                { model: Role }
            ]
        })

        if(!isEmailValid) { 
            return res.json({ message: 'Invalid Credentials' }) 
        }
    
        if(['student', 'staff', 'coordinator', 'assistant_coordinator', 'donor'].includes(isEmailValid.Role.name)) {
            return res.json({ message: 'Invalid Credentials' })
        }

        const isMatch = await bcrypt.compare(password, isEmailValid.password)
        if(!isMatch) { 
            console.log('Password mismatch');
            return res.json({ message: 'Invalid Credentials' }) 
        }

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
        const { Accounts } = models;
        const accountId = req.user.account_id;

        // Clear the JWT cookie
        clearJwtCookie(res);

        // Set user as inactive
        await Accounts.update({ is_active: false }, { where: { account_id: accountId } });

        return res.json({ success: true, message: 'logout successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('logout controller failed :', error.message)
    }
}