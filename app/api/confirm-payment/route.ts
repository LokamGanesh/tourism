import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import dbConnect from '@/lib/mongodb'
import Booking from '@/lib/models/Booking'
import HotelBooking from '@/lib/models/HotelBooking'
import RestaurantBooking from '@/lib/models/RestaurantBooking'

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, bookingData } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Connect to database and update booking
    await dbConnect()

    // Determine booking type and use appropriate model
    const bookingType = bookingData.type || 'travel'
    let updatedBooking
    
    const bookingDoc = {
      paymentIntentId,
      paymentStatus: 'completed' as const,
      paymentConfirmedAt: new Date(),
      ...bookingData
    }
    
    // Remove the type field from bookingDoc as it's not part of the schema
    delete bookingDoc.type

    switch (bookingType) {
      case 'hotel':
        updatedBooking = new HotelBooking(bookingDoc)
        break
      case 'restaurant':
        updatedBooking = new RestaurantBooking(bookingDoc)
        break
      case 'travel':
      default:
        updatedBooking = new Booking(bookingDoc)
        break
    }
    
    await updatedBooking.save()

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      bookingType,
      message: 'Payment confirmed and booking updated'
    })
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
