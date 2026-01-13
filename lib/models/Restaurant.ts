import mongoose, { Document } from 'mongoose'

export interface IRestaurant extends Document {
  name: string
  cuisineType: string[]
  location: string
  address: string
  description: string
  rating: number
  reviews: number
  priceRange: {
    min: number
    max: number
  }
  specialties: string[]
  images: string[]
  coordinates: number[]
  timings: {
    open: string
    close: string
    daysOpen: string[]
  }
  contactDetails: {
    phone: string
    email: string
    website?: string
  }
  seatingCapacity: number
  featured: boolean
  isActive: boolean
  createdBy?: mongoose.Types.ObjectId
}

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisineType: [{ type: String, required: true }],
  location: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  specialties: [String],
  images: [String],
  coordinates: [Number],
  timings: {
    open: { type: String, required: true },
    close: { type: String, required: true },
    daysOpen: [String]
  },
  contactDetails: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String
  },
  seatingCapacity: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

export default mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema)
