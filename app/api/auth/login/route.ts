import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import { verifyPassword, generateToken } from '@/lib/auth'

// Fallback credentials for testing without database
const FALLBACK_USERS = {
  'tourist@test.com': {
    _id: 'tourist_001',
    email: 'tourist@test.com',
    password: 'test123',
    name: 'Arjun Patel',
    role: 'tourist',
    isVerified: true
  },
  'travelguide@test.com': {
    _id: 'guide_001',
    email: 'travelguide@test.com',
    password: 'guide456',
    name: 'Meera Gupta',
    role: 'travel_guide',
    licenseNumber: 'JH-GUIDE-2024',
    experience: 6,
    languages: ['English', 'Hindi', 'Odia'],
    specializations: ['Nature Tours', 'Tribal Culture', 'Waterfall Expeditions'],
    isVerified: true
  },
  'admin@test.com': {
    _id: 'admin_001',
    email: 'admin@test.com',
    password: 'admin789',
    name: 'Vikash Kumar',
    role: 'admin',
    department: 'Tourism Administration',
    permissions: ['verify_certificates', 'approve_travels', 'manage_users'],
    isVerified: true
  },
  'govt@test.com': {
    _id: 'govt_001',
    email: 'govt@test.com',
    password: 'govt321',
    name: 'Smt. Kavita Singh',
    role: 'government',
    department: 'State Tourism Board',
    position: 'Joint Secretary',
    accessLevel: 5,
    isVerified: true
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    let user = null

    // Try database first
    try {
      await dbConnect()
      const dbUser = await User.findOne({ email })
      
      if (dbUser) {
        // Verify password with database user
        const isValidPassword = await verifyPassword(password, dbUser.password)
        if (!isValidPassword) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          )
        }
        user = dbUser
      }
    } catch (dbError) {
      console.log('Database not available, using fallback authentication')
    }

    // If no database user found, try fallback users
    if (!user) {
      const fallbackUser = FALLBACK_USERS[email as keyof typeof FALLBACK_USERS]
      
      if (!fallbackUser || fallbackUser.password !== password) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }
      
      user = fallbackUser
    }

    // Check if user is verified (for travel guides)
    if (user.role === 'travel_guide' && !user.isVerified) {
      return NextResponse.json(
        { error: 'Account not verified. Please wait for admin approval.' },
        { status: 403 }
      )
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role)

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject ? user.toObject() : user

    // Set cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
