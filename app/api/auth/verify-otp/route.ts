import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User, { IUser } from '@/lib/models/User'
import { verifyOTP } from '@/lib/twilio'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  console.log('Verify OTP API called')
  try {
    await dbConnect()
    console.log('Database connected')

    const { mobile, otp, type, userData } = await request.json()
    console.log('Request data:', { mobile, otp: otp ? '***' : null, type })

    if (!mobile || !otp) {
      console.log('Missing mobile or OTP')
      return NextResponse.json(
        { error: 'Mobile number and OTP are required' },
        { status: 400 }
      )
    }

    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`
    let isValidOTP = false

    // Try Twilio Verify Service first
    try {
      isValidOTP = await verifyOTP(formattedMobile, otp)
    } catch (error) {
      console.log('Twilio Verify Service failed, trying manual verification...')
    }

    // If Twilio Verify Service fails, check manual OTP
    if (!isValidOTP && type === 'login') {
      const user = await (User as any).findOne({ mobile: formattedMobile }) as IUser | null
      if (user && user.otp === otp && user.otpExpiry && user.otpExpiry > new Date()) {
        isValidOTP = true
        // Clear OTP after successful verification
        await (User as any).updateOne(
          { mobile: formattedMobile },
          { $unset: { otp: 1, otpExpiry: 1 } }
        )
      }
    }

    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    if (type === 'signup') {
      // Create new user
      if (!userData) {
        return NextResponse.json(
          { error: 'User data is required for signup' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12)

      const newUser = new (User as any)({
        mobile: formattedMobile,
        email: userData.email || undefined,
        name: userData.name,
        password: hashedPassword,
        role: userData.role,
        isVerified: true,
        // Role-specific fields
        ...(userData.role === 'travel_guide' && {
          licenseNumber: userData.licenseNumber,
          experience: userData.experience || 0,
          languages: userData.languages || [],
          specializations: userData.specializations || []
        })
      })

      await newUser.save()

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      )

      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          mobile: newUser.mobile,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified
        },
        token
      })

    } else if (type === 'login') {
      // Login existing user
      const user = await (User as any).findOne({ mobile: formattedMobile }) as IUser | null

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Mark user as verified if OTP verification successful
      if (!user.isVerified) {
        user.isVerified = true
        await user.save()
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      )

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        token
      })
    }

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
