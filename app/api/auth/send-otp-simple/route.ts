import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, sendOTPEmail } from '@/lib/mailer'

// Simple OTP sending without database (for testing)
export async function POST(request: NextRequest) {
  console.log('Simple Send OTP API called')
  try {
    const { email, type } = await request.json()
    console.log('Request data:', { email, type })
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    console.log('Normalized email:', normalizedEmail)

    // Generate OTP
    const otp = generateOTP()
    console.log('Generated OTP:', otp)

    // Try to send email
    const otpSent = await sendOTPEmail(normalizedEmail, otp)
    
    if (otpSent) {
      // Store OTP in memory for testing (not production ready)
      if (typeof global !== 'undefined') {
        (global as any).testOTP = { 
          email: normalizedEmail, 
          otp, 
          expiry: Date.now() + 10 * 60 * 1000 
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'OTP sent to your email successfully',
        email: normalizedEmail,
        // For testing only - remove in production
        testOTP: otp
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send OTP error:', error)
    
    // Provide more helpful error messages
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Check for common issues
      if (error.message.includes('Email credentials not configured')) {
        errorMessage = 'Email service not configured. Please contact administrator.'
      } else if (error.message.includes('EAUTH') || error.message.includes('Invalid login')) {
        errorMessage = 'Email authentication failed. Please contact administrator.'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
