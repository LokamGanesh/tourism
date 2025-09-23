'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Clock, DollarSign, Phone, Utensils, ExternalLink, ChevronLeft, ChevronRight, Camera } from 'lucide-react'

interface Restaurant {
  id: number
  name: string
  location: string
  image: string
  images?: string[]
  rating: number
  reviews: number
  cuisine: string
  priceRange: string
  specialties: string[]
  description: string
  coordinates: [number, number]
}

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = restaurant.images || [restaurant.image]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '₹':
        return 'text-green-600'
      case '₹₹':
        return 'text-yellow-600'
      case '₹₹₹':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative group">
        <Image
          src={images[currentImageIndex]}
          alt={`${restaurant.name} - Image ${currentImageIndex + 1}`}
          width={400}
          height={192}
          className="w-full h-48 object-cover transition-all duration-300"
        />
        
        {/* Image Gallery Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
              {currentImageIndex + 1}/{images.length}
            </div>
          </>
        )}
        
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className={`text-lg font-bold ${getPriceColor(restaurant.priceRange)}`}>
              {restaurant.priceRange}
            </span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-900">{restaurant.rating}</span>
            <span className="text-xs text-gray-600">({restaurant.reviews})</span>
          </div>
        </div>
        
        {/* Camera Icon */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
            <Camera className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{restaurant.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Utensils className="h-4 w-4 mr-1" />
              <span className="text-sm">{restaurant.cuisine}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {restaurant.specialties.map((specialty, index) => (
              <span
                key={index}
                className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Open: 11:00 AM - 11:00 PM</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link 
            href={`/book-restaurant/${restaurant.id}`}
            className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors text-center"
          >
            Book Now
          </Link>
          <button className="flex items-center justify-center bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors">
            <Phone className="h-4 w-4" />
          </button>
          <button className="flex items-center justify-center bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors">
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Dine-in • Takeaway</span>
            <span>Delivery available</span>
          </div>
        </div>
      </div>

    </div>
  )
}
