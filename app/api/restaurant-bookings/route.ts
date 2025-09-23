import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import RestaurantBooking from '@/lib/models/RestaurantBooking'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const {
      restaurantId,
      restaurantName,
      reservationDate,
      reservationTime,
      numberOfGuests,
      tableType,
      contactDetails,
      specialRequests,
      totalAmount
    } = body

    // Validate required fields
    if (!restaurantId || !restaurantName || !reservationDate || !reservationTime || !numberOfGuests || !contactDetails) {
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

    // Validate reservation date
    const reservationDateTime = new Date(reservationDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (reservationDateTime < today) {
      return NextResponse.json(
        { error: 'Reservation date cannot be in the past' },
        { status: 400 }
      )
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(reservationTime)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM format' },
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

    // Create restaurant booking
    const booking = new RestaurantBooking({
      userId,
      restaurantId,
      restaurantName,
      reservationDate: reservationDateTime,
      reservationTime,
      numberOfGuests,
      tableType: tableType || 'regular',
      totalAmount: totalAmount || 0,
      contactDetails,
      specialRequests: specialRequests || '',
      status: 'pending',
      paymentStatus: totalAmount > 0 ? 'pending' : 'completed'
    })

    await booking.save()

    // If user exists, add booking to user's bookings
    if (userId) {
      await (User as any).findByIdAndUpdate(
        userId,
        {
          $push: {
            restaurantBookings: booking._id
          }
        }
      )
    }

    return NextResponse.json({
      success: true,
      bookingId: booking._id,
      message: 'Restaurant reservation created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Restaurant booking creation error:', error)
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
    const restaurantId = searchParams.get('restaurantId')
    
    let query: any = {}
    
    if (userId) {
      query.userId = userId
    }
    
    if (status) {
      query.status = status
    }

    if (restaurantId) {
      query.restaurantId = restaurantId
    }

    const bookings = await (RestaurantBooking as any).find(query)
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      bookings
    })

  } catch (error) {
    console.error('Error fetching restaurant bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
