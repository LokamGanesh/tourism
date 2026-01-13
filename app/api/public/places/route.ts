import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Place from '@/lib/models/Place'

// Public API to fetch places for users
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    
    let query: any = {}
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (category) {
      query.category = category
    }
    
    const places = await Place.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      success: true,
      places,
      count: places.length 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching places:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch places' 
    }, { status: 500 })
  }
}
