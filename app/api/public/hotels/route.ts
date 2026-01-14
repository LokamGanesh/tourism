import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Hotel from '@/lib/models/Hotel'

// Public API to fetch hotels for users
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    
    let query: any = { isActive: true }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (type) {
      query.type = type
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }
    
    const hotels = await (Hotel as any).find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      success: true,
      hotels,
      count: hotels.length 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch hotels' 
    }, { status: 500 })
  }
}
