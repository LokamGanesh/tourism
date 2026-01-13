import mongoose, { Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  mobile?: string
  password: string
  name: string
  role: 'tourist' | 'travel_guide' | 'admin' | 'government' | 'travel_provider' | 'hotel_provider' | 'restaurant_provider'
  isVerified: boolean
  otp?: string
  otpExpiry?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ITourist extends IUser {
  role: 'tourist'
  preferences?: {
    interests: string[]
    budget: number
    travelStyle: string
  }
  bookings: mongoose.Types.ObjectId[]
}

export interface ITravelGuide extends IUser {
  role: 'travel_guide'
  licenseNumber: string
  certificates: {
    name: string
    url: string
    isVerified: boolean
  }[]
  experience: number
  languages: string[]
  specializations: string[]
  rating: number
  totalReviews: number
  totalTrips: number
  vehicles: mongoose.Types.ObjectId[]
  drivers: mongoose.Types.ObjectId[]
  travels: mongoose.Types.ObjectId[]
  isApproved: boolean
  location?: string
  bio?: string
  profileImage?: string
}

export interface IAdmin extends IUser {
  role: 'admin'
  permissions: string[]
  department: string
}

export interface IGovernment extends IUser {
  role: 'government'
  department: string
  position: string
  accessLevel: number
}

export interface ITravelProvider extends IUser {
  role: 'travel_provider'
  businessName: string
  businessType: 'travel_agency' | 'tour_operator'
  licenseNumber: string
  address: string
  description: string
  services: string[]
  images: string[]
  rating: number
  totalReviews: number
  isApproved: boolean
  packages: mongoose.Types.ObjectId[]
}

export interface IHotelProvider extends IUser {
  role: 'hotel_provider'
  hotelName: string
  hotelType: 'hotel' | 'resort' | 'guesthouse' | 'lodge'
  address: string
  description: string
  amenities: string[]
  images: string[]
  rating: number
  totalReviews: number
  isApproved: boolean
  rooms: mongoose.Types.ObjectId[]
  priceRange: {
    min: number
    max: number
  }
}

export interface IRestaurantProvider extends IUser {
  role: 'restaurant_provider'
  restaurantName: string
  cuisineType: string[]
  address: string
  description: string
  specialties: string[]
  images: string[]
  rating: number
  totalReviews: number
  isApproved: boolean
  menu: mongoose.Types.ObjectId[]
  priceRange: {
    min: number
    max: number
  }
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  mobile: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['tourist', 'travel_guide', 'admin', 'government', 'travel_provider', 'hotel_provider', 'restaurant_provider'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Tourist specific fields
  preferences: {
    interests: [String],
    budget: Number,
    travelStyle: String
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  hotelBookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelBooking'
  }],
  restaurantBookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantBooking'
  }],
  // Travel Guide specific fields
  licenseNumber: String,
  certificates: [{
    name: String,
    url: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  experience: Number,
  languages: [String],
  specializations: [String],
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalTrips: {
    type: Number,
    default: 0
  },
  vehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  drivers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  }],
  travels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Travel'
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  // Admin specific fields
  permissions: [String],
  department: String,
  // Government specific fields
  position: String,
  accessLevel: Number,
  // Additional fields for guides
  location: String,
  bio: String,
  profileImage: String,
  
  // Travel Provider specific fields
  businessName: String,
  businessType: {
    type: String,
    enum: ['travel_agency', 'tour_operator']
  },
  
  // Hotel Provider specific fields
  hotelName: String,
  hotelType: {
    type: String,
    enum: ['hotel', 'resort', 'guesthouse', 'lodge']
  },
  
  // Restaurant Provider specific fields
  restaurantName: String,
  cuisineType: [String],
  
  // Common provider fields
  address: String,
  description: String,
  services: [String],
  amenities: [String],
  specialties: [String],
  images: [String],
  packages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TravelPackage'
  }],
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
  menu: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  priceRange: {
    min: Number,
    max: Number
  }
}, {
  timestamps: true
})

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema)
