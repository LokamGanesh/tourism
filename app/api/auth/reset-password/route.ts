import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User, { IUser } from '@/lib/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  console.log('Reset password API called')
  try {
    await dbConnect()
    console.log('Database connected')
    
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

    // Find user by email or mobile
    const isEmail = identifier.includes('@')
    let query: any = {}
    
    if (isEmail) {
      query.email = identifier.toLowerCase()
    } else {
      const formattedMobile = identifier.startsWith('+') ? identifier : `+91${identifier}`
      query.mobile = formattedMobile
    }

    const user = await User.findOne(query) as IUser | null
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify OTP
    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { error: 'No password reset request found. Please request a new OTP.' },
        { status: 400 }
      )
    }

    if (user.otpExpiry < new Date()) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password and clear OTP
    await User.updateOne(
      { _id: user._id },
      { 
        password: hashedPassword,
        $unset: { 
          otp: 1, 
          otpExpiry: 1, 
          resetPasswordToken: 1 
        }
      }
    )

    console.log('Password reset successful for user:', user.name)

    return NextResponse.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
