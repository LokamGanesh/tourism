import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Restaurant from '@/lib/models/Restaurant'

// Public API to fetch restaurants for users
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const cuisineType = searchParams.get('cuisineType')
    const location = searchParams.get('location')
    
    let query: any = { isActive: true }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (cuisineType) {
      query.cuisineType = { $in: [cuisineType] }
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }
    
    const restaurants = await (Restaurant as any).find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      success: true,
      restaurants,
      count: restaurants.length 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch restaurants' 
    }, { status: 500 })
  }
}
