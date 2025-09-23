import mongoose, { Document } from 'mongoose'

export interface IRestaurantBooking extends Document {
  userId?: mongoose.Types.ObjectId
  restaurantId: string
  restaurantName: string
  reservationDate: Date
  reservationTime: string
  numberOfGuests: number
  tableType: string
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'completed'
  paymentIntentId?: string
  paymentConfirmedAt?: Date
  specialRequests?: string
  contactDetails: {
    name: string
    email: string
    mobile: string
  }
  createdAt: Date
  updatedAt: Date
}

const RestaurantBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  restaurantId: {
    type: String,
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  reservationDate: {
    type: Date,
    required: true
  },
  reservationTime: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  tableType: {
    type: String,
    required: true,
    enum: ['regular', 'window', 'private', 'outdoor'],
    default: 'regular'
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0 // Some restaurants may not charge for reservations
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'completed'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String
  },
  paymentConfirmedAt: {
    type: Date
  },
  specialRequests: String,
  contactDetails: {
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
  }
}, {
  timestamps: true
})

export default mongoose.models.RestaurantBooking || mongoose.model<IRestaurantBooking>('RestaurantBooking', RestaurantBookingSchema)
