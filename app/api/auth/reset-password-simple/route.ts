import { NextRequest, NextResponse } from 'next/server'

// Simple reset password without database (for testing)
export async function POST(request: NextRequest) {
  console.log('Simple Reset Password API called')
  try {
    const { identifier, otp, newPassword } = await request.json()
    console.log('Reset password attempt for:', identifier)
    
    if (!identifier || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check stored OTP (from memory - testing only)
    const storedReset = global.resetOTP
    
    if (!storedReset || storedReset.identifier !== identifier.toLowerCase()) {
      return NextResponse.json(
        { error: 'No password reset request found. Please request a new OTP.' },
        { status: 400 }
      )
    }

    if (storedReset.expiry < Date.now()) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    if (storedReset.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Clear the reset OTP
    delete global.resetOTP

    console.log('Password reset successful for:', identifier)

    return NextResponse.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
