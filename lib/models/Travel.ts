import mongoose, { Document } from 'mongoose'

export interface ITravel extends Document {
  travelGuideId: mongoose.Types.ObjectId
  title: string
  description: string
  destinations: string[]
  duration: number // in days
  maxGroupSize: number
  price: number
  inclusions: string[]
  exclusions: string[]
  itinerary: {
    day: number
    title: string
    description: string
    activities: string[]
    meals: string[]
    accommodation: string
  }[]
  images: string[]
  difficulty: 'easy' | 'moderate' | 'challenging'
  category: string[]
  isVerified: boolean
  isActive: boolean
  rating: number
  totalReviews: number
  bookings: mongoose.Types.ObjectId[]
  transport: {
    cars: {
      available: number
      pricePerDay: number
      capacity: number
      features: string[]
    }
    buses: {
      available: number
      pricePerDay: number
      capacity: number
      features: string[]
    }
    vans: {
      available: number
      pricePerDay: number
      capacity: number
      features: string[]
    }
    suvs: {
      available: number
      pricePerDay: number
      capacity: number
      features: string[]
    }
  }
  createdAt: Date
  updatedAt: Date
}

const TravelSchema = new mongoose.Schema({
  travelGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  destinations: [String],
  duration: {
    type: Number,
    required: true
  },
  maxGroupSize: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  inclusions: [String],
  exclusions: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: [String],
    accommodation: String
  }],
  images: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'moderate'
  },
  category: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  transport: {
    cars: {
      available: {
        type: Number,
        default: 0
      },
      pricePerDay: {
        type: Number,
        default: 0
      },
      capacity: {
        type: Number,
        default: 4
      },
      features: [String]
    },
    buses: {
      available: {
        type: Number,
        default: 0
      },
      pricePerDay: {
        type: Number,
        default: 0
      },
      capacity: {
        type: Number,
        default: 40
      },
      features: [String]
    },
    vans: {
      available: {
        type: Number,
        default: 0
      },
      pricePerDay: {
        type: Number,
        default: 0
      },
      capacity: {
        type: Number,
        default: 8
      },
      features: [String]
    },
    suvs: {
      available: {
        type: Number,
        default: 0
      },
      pricePerDay: {
        type: Number,
        default: 0
      },
      capacity: {
        type: Number,
        default: 7
      },
      features: [String]
    }
  }
}, {
  timestamps: true
})

export default mongoose.models.Travel || mongoose.model<ITravel>('Travel', TravelSchema)
