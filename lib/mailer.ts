import nodemailer from 'nodemailer'

// Create transporter lazily to avoid issues during build
let transporter: nodemailer.Transporter | null = null

const getTransporter = () => {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.')
      throw new Error('Email credentials not configured')
    }
    
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
    
    // Verify transporter configuration (async, won't block)
    transporter.verify().then(() => {
      console.log('Email server is ready to send messages')
    }).catch((error) => {
      console.error('Email transporter error:', error)
    })
  }
  return transporter
}

// Generate OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via email
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    const transporter = getTransporter()
    const mailOptions = {
      from: {
        name: 'Jharkhand Tourism',
        address: process.env.EMAIL_USER || 'noreply@jharkhand-tourism.com',
      },
      to: email,
      subject: 'Your Verification Code - Jharkhand Tourism',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              color: #2563eb;
              margin-bottom: 30px;
            }
            .otp-box {
              background-color: #2563eb;
              color: white;
              font-size: 32px;
              font-weight: bold;
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              letter-spacing: 8px;
              margin: 30px 0;
            }
            .info {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .warning {
              color: #dc2626;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏔️ Jharkhand Tourism</h1>
              <p>Email Verification</p>
            </div>
            
            <div class="info">
              <p>Hello,</p>
              <p>Thank you for using Jharkhand Tourism Platform. Your verification code is:</p>
            </div>
            
            <div class="otp-box">
              ${otp}
            </div>
            
            <div class="info">
              <p><strong>Important:</strong></p>
              <ul>
                <li>This code is valid for <strong>10 minutes</strong></li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2026 Jharkhand Tourism Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Your Jharkhand Tourism verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

// Send welcome email
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  try {
    const transporter = getTransporter()
    const mailOptions = {
      from: {
        name: 'Jharkhand Tourism',
        address: process.env.EMAIL_USER || 'noreply@jharkhand-tourism.com',
      },
      to: email,
      subject: 'Welcome to Jharkhand Tourism Platform!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              color: #2563eb;
              margin-bottom: 30px;
            }
            .content {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏔️ Welcome to Jharkhand Tourism!</h1>
            </div>
            
            <div class="content">
              <p>Dear ${name},</p>
              <p>Welcome to the Jharkhand Tourism Platform! We're excited to have you join our community.</p>
              <p>You can now:</p>
              <ul>
                <li>Explore verified travel packages</li>
                <li>Book amazing experiences</li>
                <li>Connect with certified travel guides</li>
                <li>Discover the beauty of Jharkhand</li>
              </ul>
              <p style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" class="button">
                  Start Exploring
                </a>
              </p>
            </div>
            
            <div class="footer">
              <p>&copy; 2026 Jharkhand Tourism Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return false
  }
}
