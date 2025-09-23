import mongoose, { Document } from 'mongoose'

export interface IDriver extends Document {
  travelGuideId: mongoose.Types.ObjectId
  name: string
  licenseNumber: string
  licenseExpiry: Date
  phoneNumber: string
  experience: number
  languages: string[]
  rating: number
  totalTrips: number
  isVerified: boolean
  isActive: boolean
  documents: {
    license: string
    aadhar: string
    photo: string
  }
  createdAt: Date
  updatedAt: Date
}

const DriverSchema = new mongoose.Schema({
  travelGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  licenseExpiry: {
    type: Date,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  languages: [String],
  rating: {
    type: Number,
    default: 0
  },
  totalTrips: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  documents: {
    license: String,
    aadhar: String,
    photo: String
  }
}, {
  timestamps: true
})

export default mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema)
