import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User, { IUser } from '@/lib/models/User'
import { generateOTP, sendManualOTP } from '@/lib/twilio'

export async function POST(request: NextRequest) {
  console.log('Forgot password API called')
  try {
    await dbConnect()
    console.log('Database connected')

    const { identifier } = await request.json()
    console.log('Forgot password request for:', identifier)

    if (!identifier) {
      return NextResponse.json(
        { error: 'Email or mobile number is required' },
        { status: 400 }
      )
    }

    // Determine if identifier is email or mobile
    const isEmail = identifier.includes('@')
    let query: any = {}
    let user: IUser | null = null

    if (isEmail) {
      query.email = identifier.toLowerCase()
      user = await (User as any).findOne(query) as IUser | null
    } else {
      // Format mobile number
      const formattedMobile = identifier.startsWith('+') ? identifier : `+91${identifier}`
      query.mobile = formattedMobile
      user = await (User as any).findOne(query) as IUser | null
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email/mobile number' },
        { status: 404 }
      )
    }

    // Check if user has a mobile number for OTP
    if (!user.mobile) {
      return NextResponse.json(
        { error: 'No mobile number associated with this account. Please contact support.' },
        { status: 400 }
      )
    }

    // Generate OTP for password reset
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    await (User as any).updateOne(
      { _id: user._id },
      {
        otp,
        otpExpiry,
        resetPasswordToken: otp // Use OTP as reset token
      }
    )

    // Send OTP via SMS
    const otpSent = await sendManualOTP(user.mobile, otp)

    if (!otpSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

    console.log('Password reset OTP sent to:', user.mobile)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your registered mobile number',
      mobile: user.mobile.replace(/(\+\d{2})(\d{4})(\d{6})/, '$1****$3') // Mask mobile number
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
