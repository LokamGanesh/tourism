import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

// GET /api/travel-packages - Get travel packages
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')
    
    // Mock data for now - in real implementation, fetch from database
    const mockPackages = [
      {
        _id: '1',
        title: 'Jharkhand Wildlife Adventure',
        description: 'Explore the rich wildlife and natural beauty of Jharkhand',
        destinations: ['Betla National Park', 'Palamau Tiger Reserve'],
        duration: 5,
        price: 15000,
        maxGroupSize: 8,
        difficulty: 'moderate',
        category: 'wildlife',
        images: [
          'https://source.unsplash.com/featured/800x600/?Jharkhand%20tourism',
          'https://source.unsplash.com/featured/800x600/?Ranchi%20tour',
          'https://source.unsplash.com/featured/800x600/?Betla%20National%20Park'
        ],
        isActive: true,
        bookings: 15,
        rating: 4.5,
        reviews: 12,
        providerId: providerId || 'provider1'
      },
      {
        _id: '2',
        title: 'Cultural Heritage Tour',
        description: 'Discover the rich cultural heritage and tribal traditions',
        destinations: ['Ranchi', 'Khunti', 'Saraikela'],
        duration: 4,
        price: 12000,
        maxGroupSize: 10,
        difficulty: 'easy',
        category: 'cultural',
        images: [
          'https://source.unsplash.com/featured/800x600/?Netarhat%20sunset',
          'https://source.unsplash.com/featured/800x600/?Hundru%20Falls',
          'https://source.unsplash.com/featured/800x600/?Parasnath%20Hill'
        ],
        isActive: true,
        bookings: 8,
        rating: 4.2,
        reviews: 6,
        providerId: providerId || 'provider1'
      }
    ]
    
    return NextResponse.json(mockPackages)
  } catch (error) {
    console.error('Error fetching travel packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch travel packages' },
      { status: 500 }
    )
  }
}

// POST /api/travel-packages - Create new travel package
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Verify user is a travel provider
    const user = await User.findById(decoded.userId)
    if (!user || user.role !== 'travel_provider') {
      return NextResponse.json(
        { error: 'Unauthorized - Travel provider access required' },
        { status: 403 }
      )
    }
    
    const packageData = await request.json()
    
    // In real implementation, save to database
    // For now, return mock response
    const newPackage = {
      _id: Date.now().toString(),
      ...packageData,
      isActive: true,
      bookings: 0,
      rating: 0,
      reviews: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    return NextResponse.json(newPackage, { status: 201 })
  } catch (error) {
    console.error('Error creating travel package:', error)
    return NextResponse.json(
      { error: 'Failed to create travel package' },
      { status: 500 }
    )
  }
}

// PUT /api/travel-packages/[id] - Update travel package
export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Verify user is a travel provider
    const user = await User.findById(decoded.userId)
    if (!user || user.role !== 'travel_provider') {
      return NextResponse.json(
        { error: 'Unauthorized - Travel provider access required' },
        { status: 403 }
      )
    }
    
    const packageData = await request.json()
    
    // In real implementation, update in database
    // For now, return mock response
    const updatedPackage = {
      ...packageData,
      updatedAt: new Date()
    }
    
    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error('Error updating travel package:', error)
    return NextResponse.json(
      { error: 'Failed to update travel package' },
      { status: 500 }
    )
  }
}
