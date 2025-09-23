import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User, { IUser } from '@/lib/models/User'
import { sendOTP, generateOTP, sendManualOTP } from '@/lib/twilio'

export async function POST(request: NextRequest) {
  console.log('Send OTP API called')
  try {
    await dbConnect()
    console.log('Database connected')
    
    const { mobile, type } = await request.json()
    console.log('Request data:', { mobile, type })
    
    if (!mobile) {
      console.log('Mobile number missing')
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      )
    }

    // Format mobile number (ensure it starts with country code)
    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`
    
    if (type === 'signup') {
      // Check if user already exists
      const existingUser = await User.findOne({ mobile: formattedMobile }) as IUser | null
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this mobile number already exists' },
          { status: 400 }
        )
      }
    } else if (type === 'login') {
      // Check if user exists
      const existingUser = await User.findOne({ mobile: formattedMobile }) as IUser | null
      if (!existingUser) {
        return NextResponse.json(
          { error: 'No account found with this mobile number' },
          { status: 404 }
        )
      }
    }

    // Try to send OTP using Twilio Verify Service first
    let otpSent = false
    
    try {
      otpSent = await sendOTP(formattedMobile)
    } catch (error) {
      console.log('Twilio Verify Service failed, trying manual OTP...')
    }

    // If Twilio Verify Service fails, use manual OTP
    if (!otpSent) {
      const otp = generateOTP()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Store OTP in database for manual verification
      if (type === 'login') {
        await User.updateOne(
          { mobile: formattedMobile },
          { otp, otpExpiry }
        )
      }

      otpSent = await sendManualOTP(formattedMobile, otp)
      
      if (otpSent) {
        return NextResponse.json({
          success: true,
          message: 'OTP sent successfully',
          useManualVerification: true,
          mobile: formattedMobile
        })
      }
    } else {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        useManualVerification: false,
        mobile: formattedMobile
      })
    }

    if (!otpSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
