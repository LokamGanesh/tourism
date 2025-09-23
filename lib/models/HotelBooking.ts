import mongoose, { Document } from 'mongoose'

export interface IHotelBooking extends Document {
  userId?: mongoose.Types.ObjectId
  hotelId: string
  hotelName: string
  checkInDate: Date
  checkOutDate: Date
  numberOfGuests: number
  numberOfRooms: number
  roomType: string
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

const HotelBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hotelId: {
    type: String,
    required: true
  },
  hotelName: {
    type: String,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  numberOfRooms: {
    type: Number,
    required: true,
    min: 1
  },
  roomType: {
    type: String,
    required: true,
    enum: ['standard', 'deluxe', 'suite', 'premium'],
    default: 'standard'
  },
  totalAmount: {
    type: Number,
    required: true
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

export default mongoose.models.HotelBooking || mongoose.model<IHotelBooking>('HotelBooking', HotelBookingSchema)
