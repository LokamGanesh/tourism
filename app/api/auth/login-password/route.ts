import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User, { IUser } from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  console.log('Login with password API called')
  try {
    await dbConnect()
    console.log('Database connected')

    const { identifier, password } = await request.json()
    console.log('Login attempt with identifier:', identifier)

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Mobile and password are required' },
        { status: 400 }
      )
    }

    // Determine if identifier is email or mobile
    const isEmail = identifier.includes('@')
    let query: any = {}

    if (isEmail) {
      query.email = identifier.toLowerCase()
    } else {
      // Format mobile number
      const formattedMobile = identifier.startsWith('+') ? identifier : `+91${identifier}`
      query.mobile = formattedMobile
    }

    console.log('Searching user with query:', query)

    // Find user by email or mobile
    const user = await (User as any).findOne(query) as IUser | null

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email/mobile number' },
        { status: 404 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    console.log('Login successful for user:', user.name)

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

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
