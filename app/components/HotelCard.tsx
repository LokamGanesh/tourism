'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Wifi, Car, Utensils, Dumbbell, Waves, Phone, ExternalLink, Coffee, ChevronLeft, ChevronRight, Camera } from 'lucide-react'

interface Hotel {
  id: number
  name: string
  location: string
  image: string
  images?: string[]
  rating: number
  reviews: number
  price: number
  amenities: string[]
  description: string
  coordinates: [number, number]
}

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = hotel.images || [hotel.image]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getAmenityIcon = (amenity: string) => {
    const icons = {
      wifi: <Wifi className="h-4 w-4" />,
      parking: <Car className="h-4 w-4" />,
      restaurant: <Utensils className="h-4 w-4" />,
      gym: <Dumbbell className="h-4 w-4" />,
      spa: <Waves className="h-4 w-4" />,
      pool: <Waves className="h-4 w-4" />,
      'room-service': <Phone className="h-4 w-4" />,
      'nature-view': <MapPin className="h-4 w-4" />,
      bonfire: <span className="text-sm">🔥</span>,
      ac: <span className="text-sm">❄️</span>
    }
    return icons[amenity] || <span className="text-sm">✓</span>
  }

  const getAmenityLabel = (amenity: string) => {
    const labels = {
      wifi: 'Wi-Fi',
      parking: 'Parking',
      restaurant: 'Restaurant',
      gym: 'Gym',
      spa: 'Spa',
      pool: 'Pool',
      'room-service': 'Room Service',
      'nature-view': 'Nature View',
      bonfire: 'Bonfire',
      ac: 'AC'
    }
    return labels[amenity] || amenity
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative group">
        <Image
          src={images[currentImageIndex]}
          alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
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
            <span className="text-lg font-bold text-primary-600">₹{hotel.price.toLocaleString()}</span>
            <span className="text-sm text-gray-600">/night</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-900">{hotel.rating}</span>
            <span className="text-xs text-gray-600">({hotel.reviews})</span>
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{hotel.location}</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {hotel.description}
          </p>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700"
              >
                {getAmenityIcon(amenity)}
                <span>{getAmenityLabel(amenity)}</span>
              </div>
            ))}
            {hotel.amenities.length > 4 && (
              <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                +{hotel.amenities.length - 4} more
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link 
            href={`/book-hotel/${hotel.id}`}
            className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
          >
            Book Now
          </Link>
          <button className="flex items-center justify-center bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors">
            <ExternalLink className="h-4 w-4" />
          </button>
          <button className="flex items-center justify-center bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors">
            <Phone className="h-4 w-4" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Free cancellation</span>
            <span>Pay at hotel</span>
          </div>
        </div>
      </div>

    </div>
  )
}
