import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, sendManualOTP } from '@/lib/twilio'

// Simple OTP sending without database (for testing)
export async function POST(request: NextRequest) {
  console.log('Simple Send OTP API called')
  try {
    const { mobile, type } = await request.json()
    console.log('Request data:', { mobile, type })
    
    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      )
    }

    // Format mobile number
    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`
    console.log('Formatted mobile:', formattedMobile)

    // Generate OTP
    const otp = generateOTP()
    console.log('Generated OTP:', otp)

    // Try to send SMS
    const otpSent = await sendManualOTP(formattedMobile, otp)
    
    if (otpSent) {
      // Store OTP in memory for testing (not production ready)
      global.testOTP = { mobile: formattedMobile, otp, expiry: Date.now() + 10 * 60 * 1000 }
      
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        mobile: formattedMobile,
        // For testing only - remove in production
        testOTP: otp
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
