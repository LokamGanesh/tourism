import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import OTP from '@/lib/models/OTP'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Simple OTP verification with user creation
export async function POST(request: NextRequest) {
  console.log('Simple Verify OTP API called')
  try {
    const body = await request.json()
    const { email, otp, type, userData } = body
    
    console.log('Request received:', { 
      email, 
      otp: otp ? '***' : null, 
      type,
      hasUserData: !!userData 
    })
    
    if (!email || !otp) {
      console.error('Missing required fields:', { email: !!email, otp: !!otp })
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    console.log('Normalized email:', normalizedEmail)

    // Connect to database
    console.log('Connecting to database...')
    await dbConnect()
    console.log('Database connected')

    // Find OTP in database
    const otpRecord = await OTP.findOne({ 
      email: normalizedEmail,
      otp: otp 
    })

    console.log('OTP record found:', !!otpRecord)

    if (!otpRecord) {
      console.error('No matching OTP found')
      return NextResponse.json(
        { error: 'Invalid OTP. Please check and try again.' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      console.error('OTP expired')
      await OTP.deleteOne({ _id: otpRecord._id })
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    console.log('OTP verified successfully')
    
    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id })

    if (type === 'signup') {
      // Create new user
      if (!userData) {
        console.error('Missing userData for signup')
        return NextResponse.json(
          { error: 'User data is required for signup' },
          { status: 400 }
        )
      }

      console.log('Creating new user with role:', userData.role)

      // Check if user already exists
      const existingUser = await User.findOne({ email: normalizedEmail }).exec()
      if (existingUser) {
        console.error('User already exists:', normalizedEmail)
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Format mobile number with +91 prefix if provided
      const formattedMobile = userData.mobile ? `+91${userData.mobile}` : undefined

      const newUser = new User({
        email: normalizedEmail,
        name: userData.name,
        mobile: formattedMobile,
        password: hashedPassword,
        role: userData.role,
        isVerified: true,
        // Role-specific fields
        ...(userData.role === 'travel_provider' && {
          businessName: userData.businessName,
          businessType: userData.businessType,
          licenseNumber: userData.licenseNumber,
          address: userData.address,
          description: userData.description,
          services: userData.services
        }),
        ...(userData.role === 'hotel_provider' && {
          hotelName: userData.hotelName,
          hotelType: userData.hotelType,
          address: userData.address,
          description: userData.description,
          amenities: userData.amenities
        }),
        ...(userData.role === 'restaurant_provider' && {
          restaurantName: userData.restaurantName,
          cuisineType: userData.cuisineType,
          address: userData.address,
          description: userData.description,
          specialties: userData.specialties
        })
      })

      await newUser.save()
      console.log('User created successfully:', newUser._id)

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
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified
        },
        token
      })

    } else if (type === 'login') {
      // Login existing user
      console.log('Logging in user:', normalizedEmail)
      const user = await User.findOne({ email: normalizedEmail })

      if (!user) {
        console.error('User not found:', normalizedEmail)
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

      console.log('Login successful for:', normalizedEmail)

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        token
      })
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Verify OTP error:', error)
    
    // Provide more helpful error messages
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Check for MongoDB connection issues
      if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
        errorMessage = 'Database connection failed. Please ensure MongoDB is running or configured correctly.'
      } else if (error.message.includes('buffering timed out')) {
        errorMessage = 'Database connection timeout. Please check your MongoDB configuration.'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
