import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { email, password, name, role, ...additionalData } = body

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await (User as any).findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user data based on role
    const userData: any = {
      email,
      password: hashedPassword,
      name,
      role,
      isVerified: role === 'tourist' // Auto-verify tourists
    }

    // Add role-specific data
    if (role === 'travel_guide') {
      userData.licenseNumber = additionalData.licenseNumber
      userData.experience = additionalData.experience || 0
      userData.languages = additionalData.languages || []
      userData.specializations = additionalData.specializations || []
      userData.isApproved = false
    } else if (role === 'admin') {
      userData.department = additionalData.department
      userData.permissions = additionalData.permissions || []
    } else if (role === 'government') {
      userData.department = additionalData.department
      userData.position = additionalData.position
      userData.accessLevel = additionalData.accessLevel || 1
    }

    // Create user
    const user = new (User as any)(userData)
    await user.save()

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject()

    return NextResponse.json({
      message: 'User created successfully',
      user: userResponse
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
