// import { MailerSend } from 'mailersend'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// export const mailer = new MailerSend({ apiKey: process.env.MAILER_API_KEY })

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,    
    secure: false,
    auth: {
      user: process.env.AUTH_MAILER,
      pass: process.env.PASS_MAILER, 
    },
})

// 🐛 Debug Function to Find Internal Server Error
export const debugEmailSetup = async () => {
    console.log('🔍 Debugging Gmail SMTP Setup...\n')
    
    try {
        // Step 1: Check if file is loading
        console.log('1. 📁 File Loading Check...')
        console.log('   ✅ Email module loaded successfully')
        
        // Step 2: Environment Variables Check
        console.log('\n2. 🔧 Environment Variables Check...')
        console.log(`   AUTH_MAILER: ${process.env.AUTH_MAILER ? '✅ Set' : '❌ Missing'}`)
        console.log(`   PASS_MAILER: ${process.env.PASS_MAILER ? '✅ Set' : '❌ Missing'}`)
        
        if (!process.env.AUTH_MAILER || !process.env.PASS_MAILER) {
            throw new Error('Missing required environment variables')
        }
        
        // Step 3: Validate Email Format
        console.log('\n3. 📧 Email Format Validation...')
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(process.env.AUTH_MAILER)) {
            throw new Error('AUTH_MAILER is not a valid email format')
        }
        console.log('   ✅ Email format is valid')
        
        // Step 4: Test SMTP Connection
        console.log('\n4. 🔌 Testing SMTP Connection...')
        await transporter.verify()
        console.log('   ✅ SMTP connection successful')
        
        // Step 5: Test Email Send
        console.log('\n5. 📤 Testing Email Send...')
        const testResult = await transporter.sendMail({
            from: process.env.AUTH_MAILER,
            to: process.env.AUTH_MAILER, // Send to self for testing
            subject: 'Gmail SMTP Debug Test',
            text: 'If you receive this, your Gmail SMTP is working!',
            html: '<p>If you receive this, your Gmail SMTP is working!</p>'
        })
        
        console.log('   ✅ Test email sent successfully!')
        console.log(`   📨 Message ID: ${testResult.messageId}`)
        
        return {
            success: true,
            message: 'Gmail SMTP setup is working correctly',
            details: {
                smtpServer: 'smtp.gmail.com:587',
                authentication: 'Working',
                emailSending: 'Working',
                messageId: testResult.messageId
            }
        }
        
    } catch (error) {
        console.error('\n❌ Debug Failed:')
        console.error(`   Error Type: ${error.code || 'Unknown'}`)
        console.error(`   Error Message: ${error.message}`)
        
        // Detailed error analysis
        let solution = 'Unknown error - check server logs'
        
        if (error.code === 'EAUTH') {
            solution = 'Authentication failed. Check: 1) 2FA enabled? 2) Using App Password? 3) Correct credentials?'
        } else if (error.code === 'ECONNECTION') {
            solution = 'Connection failed. Check: 1) Internet connection 2) Port 587 access 3) Firewall settings'
        } else if (error.message.includes('Missing required environment variables')) {
            solution = 'Add AUTH_MAILER and PASS_MAILER to your .env file'
        } else if (error.message.includes('Invalid email format')) {
            solution = 'AUTH_MAILER must be a valid email address'
        }
        
        console.error(`   💡 Solution: ${solution}`)
        
        return {
            success: false,
            error: error.message,
            errorCode: error.code,
            solution: solution,
            timestamp: new Date().toISOString()
        }
    }
}

// 🚀 Simple One-Click Test Function
export const simpleTest = async () => {
    console.log('🧪 Running Simple Gmail Test...\n')
    
    try {
        const result = await debugEmailSetup()
        
        if (result.success) {
            console.log('\n🎉 SUCCESS: Gmail SMTP is working!')
            console.log('📧 You can now use transporter.sendMail() in your code')
        } else {
            console.log('\n💥 FAILED: Check the errors above')
        }
        
        return result
        
    } catch (error) {
        console.error('💥 Unexpected error in simpleTest:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 📋 Usage Examples for Your Code:

// Example 1: Test in your main server file
export const initializeEmailService = async () => {
    console.log('📧 Initializing Email Service...')
    const emailCheck = await simpleTest()
    
    if (!emailCheck.success) {
        console.warn('⚠️ Email service disabled due to configuration issues')
        return null
    }
    
    console.log('✅ Email service initialized successfully')
    return transporter
}

// Example 2: Safe email sending function
export const sendEmailSafely = async (mailOptions) => {
    try {
        // Verify connection first
        await transporter.verify()
        
        // Send email
        const result = await transporter.sendMail({
            from: process.env.AUTH_MAILER,
            ...mailOptions
        })
        
        return {
            success: true,
            messageId: result.messageId
        }
        
    } catch (error) {
        console.error('❌ Email sending failed:', error.message)
        return {
            success: false,
            error: error.message
        }
    }
}