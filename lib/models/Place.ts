import mongoose, { Document } from 'mongoose'

export interface IPlace extends Document {
  name: string
  location: string
  description: string
  category: string
  rating: number
  reviews: number
  bestTime: string
  entryFee: string
  timings: string
  images: string[]
  coordinates: number[]
  highlights: string[]
  facilities: string[]
  howToReach: string
  weather: {
    summer: string
    winter: string
    monsoon: string
  }
  featured: boolean
}

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  bestTime: String,
  entryFee: String,
  timings: String,
  images: [String],
  coordinates: [Number], // [lat, lng]
  highlights: [String],
  facilities: [String],
  howToReach: String,
  weather: {
    summer: String,
    winter: String,
    monsoon: String
  },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
})

export default mongoose.models.Place || mongoose.model<IPlace>('Place', PlaceSchema)
