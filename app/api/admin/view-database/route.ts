import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    console.log('Database connected for admin view')

    // Get all users (limit to 50 for performance)
    const users = await (User as any).find({})
      .select('-password -otp -otpExpiry') // Exclude sensitive fields
      .limit(50)
      .sort({ createdAt: -1 }) // Most recent first

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        // Role-specific data
        ...(user.role === 'travel_guide' && {
          licenseNumber: user.licenseNumber,
          experience: user.experience,
          languages: user.languages,
          specializations: user.specializations,
          isApproved: user.isApproved
        })
      }))
    })

  } catch (error) {
    console.error('Database view error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch database data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Get specific user by ID
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const user = await (User as any).findById(userId)
      .select('-password -otp -otpExpiry')

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // Role-specific data
        ...(user.role === 'travel_guide' && {
          licenseNumber: user.licenseNumber,
          experience: user.experience,
          languages: user.languages,
          specializations: user.specializations,
          isApproved: user.isApproved,
          rating: user.rating,
          totalReviews: user.totalReviews
        }),
        ...(user.role === 'tourist' && {
          preferences: user.preferences,
          bookings: user.bookings
        })
      }
    })

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user data'
    }, { status: 500 })
  }
}
