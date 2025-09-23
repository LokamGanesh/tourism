import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

// GET /api/provider-bookings - Get bookings for a provider
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')
    const type = searchParams.get('type') // 'travel', 'hotel', 'restaurant'
    
    if (!providerId || !type) {
      return NextResponse.json(
        { error: 'Provider ID and type are required' },
        { status: 400 }
      )
    }
    
    // Mock data based on provider type
    let mockBookings = []
    
    if (type === 'travel') {
      mockBookings = [
        {
          _id: '1',
          packageId: 'pkg1',
          packageTitle: 'Jharkhand Wildlife Adventure',
          customerName: 'Raj Kumar',
          customerEmail: 'raj@example.com',
          customerPhone: '+91 9876543210',
          travelDate: '2024-02-15',
          numberOfPeople: 4,
          totalAmount: 60000,
          status: 'confirmed',
          createdAt: '2024-01-10',
          transport: 'SUV',
          specialRequests: 'Vegetarian meals preferred'
        },
        {
          _id: '2',
          packageId: 'pkg2',
          packageTitle: 'Cultural Heritage Tour',
          customerName: 'Priya Sharma',
          customerEmail: 'priya@example.com',
          customerPhone: '+91 9876543211',
          travelDate: '2024-02-20',
          numberOfPeople: 2,
          totalAmount: 24000,
          status: 'pending',
          createdAt: '2024-01-12',
          transport: 'Car',
          specialRequests: 'Early morning pickup'
        }
      ]
    } else if (type === 'hotel') {
      mockBookings = [
        {
          _id: '1',
          roomId: 'room1',
          roomType: 'Deluxe Room',
          customerName: 'Amit Singh',
          customerEmail: 'amit@example.com',
          customerPhone: '+91 9876543212',
          checkIn: '2024-02-10',
          checkOut: '2024-02-12',
          guests: 2,
          totalAmount: 7000,
          status: 'confirmed',
          createdAt: '2024-01-15',
          specialRequests: 'Late checkout requested'
        }
      ]
    } else if (type === 'restaurant') {
      mockBookings = [
        {
          _id: '1',
          customerName: 'Sunita Devi',
          customerEmail: 'sunita@example.com',
          customerPhone: '+91 9876543213',
          date: '2024-02-08',
          time: '19:30',
          guests: 6,
          specialRequests: 'Birthday celebration',
          status: 'confirmed',
          createdAt: '2024-01-20'
        }
      ]
    }
    
    return NextResponse.json(mockBookings)
  } catch (error) {
    console.error('Error fetching provider bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/provider-bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const bookingData = await request.json()
    
    // In real implementation, save to database and send notifications
    const newBooking = {
      _id: Date.now().toString(),
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    // Send notification to provider (mock)
    console.log(`New booking notification sent to provider: ${bookingData.providerId}`)
    
    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// PUT /api/provider-bookings/[id] - Update booking status
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
    
    // Verify user is a provider
    const user = await User.findById(decoded.userId)
    if (!user || !['travel_provider', 'hotel_provider', 'restaurant_provider'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Provider access required' },
        { status: 403 }
      )
    }
    
    const updateData = await request.json()
    
    // In real implementation, update in database and send notifications
    const updatedBooking = {
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    // Send notification to customer (mock)
    console.log(`Booking status update notification sent to customer`)
    
    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
