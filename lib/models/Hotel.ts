import mongoose, { Document } from 'mongoose'

export interface IHotel extends Document {
  name: string
  type: 'hotel' | 'resort' | 'guesthouse' | 'lodge'
  location: string
  address: string
  description: string
  rating: number
  reviews: number
  priceRange: {
    min: number
    max: number
  }
  amenities: string[]
  images: string[]
  coordinates: number[]
  rooms: {
    type: string
    available: number
    price: number
    capacity: number
  }[]
  contactDetails: {
    phone: string
    email: string
    website?: string
  }
  featured: boolean
  isActive: boolean
  createdBy?: mongoose.Types.ObjectId
}

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['hotel', 'resort', 'guesthouse', 'lodge'],
    required: true 
  },
  location: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  amenities: [String],
  images: [String],
  coordinates: [Number],
  rooms: [{
    type: { type: String, required: true },
    available: { type: Number, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true }
  }],
  contactDetails: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String
  },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

export default mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema)
