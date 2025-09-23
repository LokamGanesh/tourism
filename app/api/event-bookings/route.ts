import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import mongoose from 'mongoose'

// Event Booking Schema
const EventBookingSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  attendeeDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    }
  },
  specialRequests: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: String,
  paymentConfirmedAt: Date,
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const EventBooking = mongoose.models.EventBooking || mongoose.model('EventBooking', EventBookingSchema)

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const bookingData = await request.json()
    
    // Generate booking ID
    const bookingId = `EVT${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    const eventBooking = new EventBooking({
      ...bookingData,
      bookingId
    })
    
    await eventBooking.save()
    
    return NextResponse.json({
      success: true,
      bookingId,
      booking: eventBooking,
      message: 'Event booking created successfully'
    })
  } catch (error) {
    console.error('Error creating event booking:', error)
    return NextResponse.json(
      { error: 'Failed to create event booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const eventId = searchParams.get('eventId')
    
    let query: any = {}
    if (userId) query.userId = userId
    if (eventId) query.eventId = parseInt(eventId)
    
    const bookings = await EventBooking.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      bookings
    })
  } catch (error) {
    console.error('Error fetching event bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event bookings' },
      { status: 500 }
    )
  }
}
