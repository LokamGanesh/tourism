import mongoose, { Document } from 'mongoose'

export interface IVehicle extends Document {
  travelGuideId: mongoose.Types.ObjectId
  type: 'bus' | 'car' | 'van' | 'suv'
  make: string
  model: string
  year: number
  registrationNumber: string
  capacity: number
  amenities: string[]
  images: string[]
  isVerified: boolean
  isActive: boolean
  pricePerDay: number
  createdAt: Date
  updatedAt: Date
}

const VehicleSchema = new mongoose.Schema({
  travelGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['bus', 'car', 'van', 'suv'],
    required: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: [String],
  images: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  pricePerDay: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema)
