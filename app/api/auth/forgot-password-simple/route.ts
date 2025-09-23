import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, sendManualOTP } from '@/lib/twilio'

// Simple forgot password without database (for testing)
export async function POST(request: NextRequest) {
  console.log('Simple Forgot Password API called')
  try {
    const { identifier } = await request.json()
    console.log('Forgot password request for:', identifier)
    
    if (!identifier) {
      return NextResponse.json(
        { error: 'Email or mobile number is required' },
        { status: 400 }
      )
    }

    // For testing, assume all users have mobile +919876543210
    const testMobile = '+919876543210'

    // Generate OTP
    const otp = generateOTP()
    console.log('Generated reset OTP:', otp)

    // Store OTP in memory for testing
    global.resetOTP = { 
      identifier: identifier.toLowerCase(), 
      otp, 
      expiry: Date.now() + 10 * 60 * 1000 // 10 minutes
    }

    // Try to send OTP via SMS
    const otpSent = await sendManualOTP(testMobile, otp)
    
    if (!otpSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

    console.log('Password reset OTP sent to:', testMobile)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your registered mobile number',
      mobile: '+91****43210' // Masked mobile number
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
