import mongoose, { Document } from 'mongoose'

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId
  travelId: mongoose.Types.ObjectId
  vehicleId?: mongoose.Types.ObjectId
  driverId?: mongoose.Types.ObjectId
  bookingDate: Date
  travelDate: Date
  numberOfPeople: number
  totalAmount: number
  transportType: 'bus' | 'car' | 'van' | 'suv'
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

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  travelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Travel',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  travelDate: {
    type: Date,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  transportType: {
    type: String,
    enum: ['bus', 'car', 'van', 'suv'],
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

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)
