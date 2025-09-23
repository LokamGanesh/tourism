import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import HotelBooking from '@/lib/models/HotelBooking'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const {
      hotelId,
      hotelName,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      numberOfRooms,
      roomType,
      contactDetails,
      specialRequests,
      totalAmount
    } = body

    // Validate required fields
    if (!hotelId || !hotelName || !checkInDate || !checkOutDate || !numberOfGuests || !numberOfRooms || !contactDetails || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate contact details
    if (!contactDetails.name || !contactDetails.email || !contactDetails.mobile) {
      return NextResponse.json(
        { error: 'Complete contact details are required' },
        { status: 400 }
      )
    }

    // Validate dates
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkIn < today) {
      return NextResponse.json(
        { error: 'Check-in date cannot be in the past' },
        { status: 400 }
      )
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      )
    }

    // Get user ID from token (optional - for guest bookings)
    let userId = null
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
        userId = decoded.userId
      } catch (error) {
        console.log('Invalid token, proceeding with guest booking')
      }
    }

    // Create hotel booking
    const booking = new HotelBooking({
      userId,
      hotelId,
      hotelName,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      numberOfRooms,
      roomType: roomType || 'standard',
      totalAmount,
      contactDetails,
      specialRequests: specialRequests || '',
      status: 'pending',
      paymentStatus: 'pending'
    })

    await booking.save()

    // If user exists, add booking to user's bookings
    if (userId) {
      await (User as any).findByIdAndUpdate(
        userId,
        {
          $push: {
            hotelBookings: booking._id
          }
        }
      )
    }

    return NextResponse.json({
      success: true,
      bookingId: booking._id,
      message: 'Hotel booking created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Hotel booking creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const hotelId = searchParams.get('hotelId')
    
    let query: any = {}
    
    if (userId) {
      query.userId = userId
    }
    
    if (status) {
      query.status = status
    }

    if (hotelId) {
      query.hotelId = hotelId
    }

    const bookings = await (HotelBooking as any).find(query)
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      bookings
    })

  } catch (error) {
    console.error('Error fetching hotel bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
