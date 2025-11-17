import models from "../../models/index.js";
import { db } from "../../config/db.js";
import bcrypt from 'bcrypt'
import CryptoJS from "crypto-js";
import { sendMail } from "../../services/mailService.js";
import { generateUniqueCode } from "../../utils/generateUniqueCode.js";
import { generateToken } from "../../utils/generateToken.js";
import { clearJwtCookie } from "../../utils/clearJwtCookie.js";
import { emitUserActivityUpdate } from "../../socket.js";


export const signup = async (req, res) => {
    const t = await db.transaction();

    try {
        const { 
            studentId,
            email,
            password,
            confirmPassword,
            firstname,
            lastname,
            middlename,
            age,
            gender,
            phoneNumber,
            address,
            department,
            course,
            yearLevel,
            isBeneficiary,
            beneficiaryType,
            organization_name
        } = req.validatedBody;

        const picture_id_image = req.file ? req.file.path : null;
        const { Accounts, Role, Beneficiary, Department, Course, YearLevel, Student, StrandCourse, Volunteer, VerificationCodes } = models;

        // Check if email exists
        const isEmailExist = await Accounts.findOne({ where: { email } });
        if (isEmailExist) {
            await t.rollback();
            return res.status(400).json({ message: 'Your email account already exists' });
        }

        const truePassword = password || confirmPassword;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(truePassword, salt);

        const newAccount = await Accounts.create({
            email,
            password: hashPassword,
            is_active: false
        }, { transaction: t });

        const IsBeneficiary = isBeneficiary === "true"

        console.log('is beneficiary type: ', typeof IsBeneficiary)
        console.log('is beneficiary type: ', IsBeneficiary)
        
        await Role.create({
            account_id: newAccount.account_id,
            name: IsBeneficiary ? 'beneficiary' : 'student',
            description: IsBeneficiary 
                ? 'This role allows access to beneficiary events' 
                : 'This role allows access to volunteer events'
        }, { transaction: t });

        if (IsBeneficiary) {
            await Beneficiary.create({
                account_id: newAccount.account_id,
                firstname,
                lastname,
                middle_initial: middlename,
                phone_number: phoneNumber,
                current_address: address,
                age,
                gender,
                organization_name: beneficiaryType === 'organization' ? organization_name : null
            }, { transaction: t });

            // Generate verification code
            const uniqueCode = await generateUniqueCode();
            const ONE_MINUTE = new Date(Date.now() + 60_000);

            await VerificationCodes.create({
                account_id: newAccount.account_id,
                code: uniqueCode,
                expires_at: ONE_MINUTE,
                used: false
            }, { transaction: t });

            await sendMail(
                email,
                'Verify Your Account',
                'Verify Your Account Fallback',
                'mailingTemplate.html',
                { email: process.env.AUTH_MAILER, code: uniqueCode, company_name: 'uclmcares' }
            );

            await generateToken(newAccount.account_id, res);

            await t.commit();

            return res.json({ 
                success: true, 
                message: 'Beneficiary registration successful! Please verify your email.', 
                otp_expiration: ONE_MINUTE 
            });
        }

        // Department
        const [newDepartment] = await Department.findOrCreate({
            where: { department_name: department },
            defaults: { department_name: department },
            transaction: t
        });

        let courseId = null
        let strandCourseId = null

        console.log('department data: ' + department)

        if(department === 'Senior High Department') {
            const [strandCourse] = await StrandCourse.findOrCreate({
                where: { name: course },
                defaults: { name: course },
                transaction: t
            })
            strandCourseId = strandCourse.strand_course_id
        } else {
            const [regularCourse] = await Course.findOrCreate({
                where: { course_name: course },
                defaults: { course_name: course },
                transaction: t
            });
            courseId = regularCourse.course_id
        }

        // YearLevel
        const [newYearLevel] = await YearLevel.findOrCreate({
            where: { year_level: yearLevel },
            defaults: { year_level: yearLevel },
            transaction: t
        });

        // Student
        const newStudent = await Student.create({
            account_id: newAccount.account_id,
            student_number: studentId,
            firstname,
            lastname,
            middle_initial: middlename,
            phone_number: phoneNumber,
            current_address: address,
            age,
            gender,
            profile_image: picture_id_image,
            strand_course_id: strandCourseId,
            course_id: courseId,
            department_id: newDepartment.department_id,
            yl_id: newYearLevel.yl_id
        }, { transaction: t });

        await Volunteer.create({
            student_id: newStudent.student_id,
            department_id: newDepartment.department_id,
            course_id: courseId,
            strand_course_id: strandCourseId,
            yl_id: newYearLevel.yl_id,
            profile_image: picture_id_image,
            is_subscribed: true
        }, { transaction: t });

        // Generate verification code
        const uniqueCode = await generateUniqueCode();
        const FIVE_MINUTES = new Date(Date.now() + 5 * 60_000);

        await VerificationCodes.create({
            account_id: newAccount.account_id,
            code: uniqueCode,
            expires_at: FIVE_MINUTES,
            used: false
        }, { transaction: t });

        await sendMail(
            email,
            'Verify Your Account',
            'Verify Your Account Fallback',
            'mailingTemplate.html',
            { email: process.env.AUTH_MAILER, code: uniqueCode, company_name: 'uclmcares' }
        );

        await generateToken(newAccount.account_id, res);

        await t.commit();

        res.json({ 
            success: true, 
            message: 'Volunteer registration successful! Please verify your email.', 
            otp_expiration: FIVE_MINUTES 
        });

    } catch (error) {
        // Rollback transaction if it hasn't been committed
        await t.rollback();
        console.error('Sign up controller failed:', error);
        res.json({ message: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.validatedBody
        const { Accounts, VerificationCodes, Role, ApprovalToken, RequestApproval } = models

        const isValid = await Accounts.findOne({ where: { email: email } })
        if(!isValid) { return res.json({ message: 'Invalid Credentials' }) }
        
        const roleType = await Role.findOne({ where: { account_id: isValid.account_id } })

        // Restrict director and donor from logging in through this endpoint
        if(roleType.name === 'director' || roleType.name === 'donor') {
            return res.json({ message: 'Invalid Credentials' })
        }

        if(roleType.name !== 'student') {
            const isMatch = await bcrypt.compare(password, isValid.password)
            if(!isMatch) { return res.json({ message: 'Invalid Credentials' }) }
            await Accounts.update({ is_active: true }, { where: { account_id: isValid.account_id } })
            const role = await Role.findOne({ where: { account_id: isValid.account_id } })
            console.log(role.name)
            console.log(email)
            await generateToken(isValid.account_id, res)
            
            // Emit socket event for user login
            try {
                emitUserActivityUpdate(isValid.account_id, "online", {
                    email: isValid.email,
                    role: role.name,
                    loginTime: new Date()
                });
            } catch (socketError) {
                console.log('Socket emit failed:', socketError.message);
            }
            
            return res.json({ success: true, message: 'Login Successfully', role: role.name, userId: isValid.account_id })
        }

        const isVerified = await VerificationCodes.findOne({ where: { account_id: isValid.account_id, used: true } })
        if(!isVerified) { return res.json({ message: 'Account is not fully verified' }) }

        const isMatch = await bcrypt.compare(password, isValid.password)
        if(!isMatch) { return res.json({ message: 'Invalid Credentials' }) }

        await Accounts.update({ is_active: true }, { where: { account_id: isValid.account_id } })

        const role = await Role.findOne({ where: { account_id: isValid.account_id } })
        await generateToken(isValid.account_id, res)

        // Emit socket event for user login
        try {
            emitUserActivityUpdate(isValid.account_id, "online", {
                email: isValid.email,
                role: role.name,
                loginTime: new Date()
            });
        } catch (socketError) {
            console.log('Socket emit failed:', socketError.message);
        }

        return res.json({ success: true, message: 'Login Successfully', role: role.name, userId: isValid.account_id })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('login controller failed :', error.message)
    }
}

export const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.json({ 
                success: false, 
                message: 'Email is required' 
            });
        }

        const { Accounts } = models;
        
        // Check if email exists (including soft-deleted records)
        const account = await Accounts.findOne({ 
            where: { email: email }, 
            paranoid: false // include soft-deleted records
        })
        
        if (!account) {
            return res.json({ 
                success: true, 
                exists: false,
                message: 'Email not found'
            });
        }

        return res.json({ 
            success: true, 
            exists: true,
            account: {
                account_id: account.account_id,
                email: account.email,
                is_active: account.is_active,
                is_deactivated: account.is_deactivated,
                activeAt: account.activeAt
            },
            message: 'Email found'
        });
    } catch (error) {
        console.error('checkEmailExists controller failed:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.validatedBody;

        const { Accounts, Student, Beneficiary, Staff, Coordinator, Director, Role, ResetPassword } = models;
        
        // Check if email exists in database
        const account = await Accounts.findOne({ 
            where: { email: email },
            include: [
                {
                model: Role,
                attributes: ['name']
            },
            {
                model: Student,
                attributes: ['firstname'],
                required: false
            },
            {
                model: Beneficiary,
                attributes: ['firstname'],
                required: false
            },
            {
                model: Staff,
                attributes: ['firstname'],
                required: false
            },
            {
                model: Coordinator,
                attributes: ['firstname'],
                required: false
            },
            {
                model: Director,
                attributes: ['firstname'],
                required: false
            },

        ]
        });

        // console.log('test payload data: ', account)

        const accountData = {
            account_id: account.account_id,
            email: account.email,
            is_deactivated: account.is_deactivated,
            firstname: account.Director ? account.Director.firstname :
            account.Staff ? account.Staff.firstname :
            account.Coordinator ? account.Coordinator.firstname :
            account.Student ? account.Student.firstname : 'User'
        }
        
        if (!account) {
            return res.json({ 
                success: false, 
                message: 'Email not found in our system' 
            });
        }

        // Check if account is deactivated
        if (accountData.is_deactivated) {
            return res.json({ 
                success: false, 
                message: 'This account is deactivated. Please contact support.' 
            });
        }

        // Generate a unique reset token
        const resetToken = await generateUniqueCode();
        
        // Set expiration time (1 hour from now)
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        
        // Store reset token in database
        await ResetPassword.create({
            account_id: accountData.account_id,
            reset_token: resetToken,
            expires_at: expiresAt,
            used: false,
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('User-Agent')
        });
        
        // Send reset email
        await sendMail(
            email,
            'Password Reset Request - UCLM CARES',
            { text: 'Please click the link to reset your password' },
            'passwordReset.html',
            {
                resetToken: resetToken,
                email: accountData.email,
                firstName: accountData.firstname || 'User',
                resetLink: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
            }
        );

        return res.json({ 
            success: true, 
            message: 'Password reset instructions have been sent to your email'
        });
    } catch (error) {
        console.error('forgotPassword controller failed:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.validatedBody;

        const { Accounts, ResetPassword } = models;
        
        // Find the account
        const account = await Accounts.findOne({ where: { email: email } });
        
        if (!account) {
            return res.json({ 
                success: false, 
                message: 'Invalid reset request' 
            });
        }

        // Find the reset token
        const resetRecord = await ResetPassword.findOne({
            where: {
                account_id: account.account_id,
                reset_token: token,
                used: false
            }
        });

        if (!resetRecord) {
            return res.json({ 
                success: false, 
                message: 'Invalid or expired reset token' 
            });
        }

        // Check if token is expired
        if (new Date() > resetRecord.expires_at) {
            return res.json({ 
                success: false, 
                message: 'Reset token has expired. Please request a new one.' 
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update the password
        await Accounts.update(
            { password: hashedPassword },
            { where: { account_id: account.account_id } }
        );

        // Mark the reset token as used
        await ResetPassword.update(
            { 
                used: true,
                used_at: new Date()
            },
            { where: { reset_id: resetRecord.reset_id } }
        );

        return res.json({ 
            success: true, 
            message: 'Password has been reset successfully' 
        });
    } catch (error) {
        console.error('resetPassword controller failed:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export const logout = async (req, res) => {
    try {
        const { Accounts } = models;
        const accountId = req.user.account_id;

        // Clear the JWT cookie
        clearJwtCookie(res);

        // Set user as inactive
        await Accounts.update({ is_active: false }, { where: { account_id: accountId } });

        // Emit socket event for user logout
        try {
            emitUserActivityUpdate(accountId, "offline", {
                logoutTime: new Date()
            });
        } catch (socketError) {
            console.log('Socket emit failed:', socketError.message);
        }

        return res.json({ success: true, message: 'logout successfully', userId: accountId })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('logout controller failed :', error.message)
    }
}

export const VerifyCode = async (req, res) => {
    try {
        const { code } = req.body
        const { rq_access } = req.query

        const { VerificationCodes, Accounts } = models

        if (!rq_access) { return res.json({ message: 'rq_access parameter is required' })}

        // Decrypt rq_access to get the email
        const decrypted_data = CryptoJS.AES
            .decrypt(rq_access, process.env.CRYPTO_SECRET_KEY)
            .toString(CryptoJS.enc.Utf8)

        const user = await Accounts.findOne({ where: { email: decrypted_data } })
        if (!user) { return res.json({ message: 'User not found' }) }

        const isMatch = await VerificationCodes.findOne({ where: { account_id: user.account_id, code: code } })
        if(!isMatch) { return res.json({ message: 'Verification Code Does not Match' }) }

        if(isMatch.used) { return res.json({ message: 'Verification Code Already Used, Please attempt resend code' }) }

        const now = Date.now()
        const expiresAt = new Date(isMatch.expires_at)
        if(now > expiresAt) { return res.json({ message: 'Verification Code is Expired' }) }

        const updateStatus = await VerificationCodes.update({ used: true }, { where: { vc_id: isMatch.vc_id } })
        if(!updateStatus) { return res.json({ message: 'verification code is not successfully updated the status' }) }

        // Activate the account after successful verification
        await Accounts.update({ is_active: true }, { where: { account_id: user.account_id } });

        return res.json({ success: true, message: 'Verification Code Accepted - Account Activated!',  })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('VerifyCode controller failed :', error.message)
    }
}

export const reSendCode = async (req, res) => {
    try {
        const { rq_access } = req.query
        const { VerificationCodes, Accounts } = models

        if (!rq_access) {
            return res.json({ success: false, message: 'rq_access parameter is required' })
        }

        // Decrypt rq_access to get the email
        const decrypted_data = CryptoJS.AES
            .decrypt(rq_access, process.env.CRYPTO_SECRET_KEY)
            .toString(CryptoJS.enc.Utf8)

        const user = await Accounts.findOne({ where: { email: decrypted_data } })
        if(!user) { return res.json({ success: false, message: 'User not found' }) }

        const uniqueCode = await generateUniqueCode()
        await sendMail(user.email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingTemplate.html', { email: process.env.AUTH_MAILER, code: uniqueCode, company_name: 'uclmcares' })

        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000) // this will set expireration to 5 minutes

        await VerificationCodes.update({
            account_id: user.account_id,
            code: uniqueCode,
            expires_at: FIVE_MINUTES,
            used: false
        }, { 
            where: {
                account_id: user.account_id
            }
        })

        res.json({ success: true, message: "New OTP sent to your email", otp_expiration: FIVE_MINUTES })
        
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('Resend Code controller failed :', error.message)
    }
}

export const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            console.error('checkAuth: No user found in request');
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        
        console.log('checkAuth: User authenticated:', {
            account_id: req.user.account_id,
            email: req.user.email,
            role: req.user.Role?.name
        });
        
        res.json({success: true, message: 'user authenticated', user: req.user})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' })
        console.error('Check Auth controller failed :', error.message)
    }
}
