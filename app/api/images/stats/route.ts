// Example API route for image statistics using PostgreSQL
import { NextRequest, NextResponse } from 'next/server'
import { getImageStats } from '@/lib/image-storage'

export async function GET(request: NextRequest) {
  try {
    const stats = await getImageStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error: any) {
    console.error('Error fetching image stats:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch image statistics',
        error: error.message
      },
      { status: 500 }
    )
  }
}
