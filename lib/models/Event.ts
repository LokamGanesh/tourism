import mongoose, { Document } from 'mongoose'

export interface IEvent extends Document {
  title: string
  description: string
  category: string
  location: string
  address: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  images: string[]
  coordinates: number[]
  organizer: {
    name: string
    contact: string
    email: string
  }
  ticketPrice: {
    free: boolean
    min?: number
    max?: number
  }
  capacity: number
  registeredCount: number
  highlights: string[]
  featured: boolean
  isActive: boolean
  createdBy?: mongoose.Types.ObjectId
}

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  images: [String],
  coordinates: [Number],
  organizer: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true }
  },
  ticketPrice: {
    free: { type: Boolean, default: false },
    min: Number,
    max: Number
  },
  capacity: { type: Number, required: true },
  registeredCount: { type: Number, default: 0 },
  highlights: [String],
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)
