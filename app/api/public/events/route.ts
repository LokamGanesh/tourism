import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Event from '@/lib/models/Event'

// Public API to fetch events for users
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const upcoming = searchParams.get('upcoming')
    
    let query: any = { isActive: true }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (category) {
      query.category = category
    }
    
    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() }
    }
    
    const events = await Event.find(query).sort({ startDate: 1 })
    
    return NextResponse.json({ 
      success: true,
      events,
      count: events.length 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch events' 
    }, { status: 500 })
  }
}
