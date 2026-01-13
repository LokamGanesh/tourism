// NEW VERSION: Using Prisma with PostgreSQL
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  console.log('Verify OTP API called (Prisma version)')
  
  try {
    const body = await request.json()
    const { email, otp, password, name, role } = body

    console.log('Request body:', { email, otp, role, hasPassword: !!password, hasName: !!name })

    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and OTP are required',
          error: 'MISSING_FIELDS'
        },
        { status: 400 }
      )
    }

    // Find the OTP record
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email: email.toLowerCase(),
        otp: otp,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!otpRecord) {
      console.log('OTP not found for email:', email)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid OTP',
          error: 'INVALID_OTP'
        },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      console.log('OTP expired for email:', email)
      
      // Delete expired OTP
      await prisma.oTP.delete({
        where: { id: otpRecord.id }
      })
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'OTP has expired. Please request a new one.',
          error: 'OTP_EXPIRED'
        },
        { status: 400 }
      )
    }

    console.log('OTP verified successfully')

    // Check if this is signup or login
    if (otpRecord.type === 'signup') {
      // SIGNUP FLOW
      if (!password || !name || !role) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Password, name, and role are required for signup',
            error: 'MISSING_SIGNUP_FIELDS'
          },
          { status: 400 }
        )
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (existingUser) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'User already exists. Please login instead.',
            error: 'USER_EXISTS'
          },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10)

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role,
          isVerified: true,
        }
      })

      // Delete the used OTP
      await prisma.oTP.delete({
        where: { id: otpRecord.id }
      })

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email, 
          role: newUser.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      console.log('User created successfully:', newUser.email)

      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          isVerified: newUser.isVerified
        }
      })

    } else {
      // LOGIN FLOW
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (!user) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'User not found. Please sign up first.',
            error: 'USER_NOT_FOUND'
          },
          { status: 404 }
        )
      }

      // Update user as verified
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true }
      })

      // Delete the used OTP
      await prisma.oTP.delete({
        where: { id: otpRecord.id }
      })

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      console.log('User logged in successfully:', user.email)

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified
        }
      })
    }

  } catch (error: any) {
    console.error('Error in verify-otp:', error)
    
    let errorMessage = 'An error occurred during verification'
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Check for PostgreSQL connection issues
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Database connection failed. Please ensure PostgreSQL is configured correctly.'
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}
