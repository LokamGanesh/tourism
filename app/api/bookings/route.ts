import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'
import Travel from '@/lib/models/Travel'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const {
      travelId,
      numberOfPeople,
      travelDate,
      transportType,
      contactDetails,
      specialRequests,
      totalAmount
    } = body

    // Validate required fields
    if (!travelId || !numberOfPeople || !travelDate || !transportType || !contactDetails || !totalAmount) {
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

    // Check if travel exists and is verified
    const travel = await (Travel as any).findById(travelId)
    if (!travel) {
      return NextResponse.json(
        { error: 'Travel package not found' },
        { status: 404 }
      )
    }

    if (!travel.isVerified) {
      return NextResponse.json(
        { error: 'Travel package is not verified' },
        { status: 400 }
      )
    }

    // Check transport availability
    const transportInfo = travel.transport[transportType]
    if (!transportInfo || transportInfo.available <= 0) {
      return NextResponse.json(
        { error: 'Selected transport is not available' },
        { status: 400 }
      )
    }

    // Check if number of people exceeds transport capacity
    if (numberOfPeople > transportInfo.capacity) {
      return NextResponse.json(
        { error: `Selected transport can accommodate maximum ${transportInfo.capacity} people` },
        { status: 400 }
      )
    }

    // Get user ID from token (optional - for guest bookings, we'll create a temporary user)
    let userId = null
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
        userId = decoded.userId
      } catch (error) {
        // Token invalid, but we'll allow guest booking
        console.log('Invalid token, proceeding with guest booking')
      }
    }

    // If no user ID, create a guest user or use contact details
    if (!userId) {
      // For guest bookings, we can either create a temporary user or handle differently
      // For now, we'll use null and handle in the booking record
    }

    // Create booking
    const booking = new Booking({
      userId,
      travelId,
      numberOfPeople,
      travelDate: new Date(travelDate),
      transportType,
      totalAmount,
      contactDetails,
      specialRequests: specialRequests || '',
      status: 'pending',
      paymentStatus: 'pending'
    })

    await booking.save()

    // Update travel transport availability (decrease by 1)
    await (Travel as any).findByIdAndUpdate(
      travelId,
      {
        $inc: {
          [`transport.${transportType}.available`]: -1
        },
        $push: {
          bookings: booking._id
        }
      }
    )

    // If user exists, add booking to user's bookings
    if (userId) {
      await (User as any).findByIdAndUpdate(
        userId,
        {
          $push: {
            bookings: booking._id
          }
        }
      )
    }

    return NextResponse.json({
      success: true,
      bookingId: booking._id,
      message: 'Booking created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Booking creation error:', error)
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
    
    let query: any = {}
    
    if (userId) {
      query.userId = userId
    }
    
    if (status) {
      query.status = status
    }

    const bookings = await (Booking as any).find(query)
      .populate('travelId', 'title duration price destinations')
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      bookings
    })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
