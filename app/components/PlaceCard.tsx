'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Clock, Users, DollarSign, Camera, Navigation, ChevronLeft, ChevronRight } from 'lucide-react'

interface Place {
  _id?: string
  id: string | number
  name: string
  location: string
  image?: string
  images?: string[]
  rating: number
  reviews: number
  category: string
  description: string
  coordinates: [number, number]
  bestTime: string
  entryFee: string
  timings: string
}

interface PlaceCardProps {
  place: Place
  viewMode: 'grid' | 'list'
}

export default function PlaceCard({ place, viewMode }: PlaceCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = place.images || [place.image]

  const handleGetDirections = () => {
    const mapUrl = `/map?name=${encodeURIComponent(place.name)}&lat=${place.coordinates[0]}&lng=${place.coordinates[1]}&address=${encodeURIComponent(place.location)}`
    window.location.href = mapUrl
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative group">
            <Image
              src={images[currentImageIndex]}
              alt={`${place.name} - Image ${currentImageIndex + 1}`}
              width={400}
              height={256}
              className="w-full h-64 md:h-full object-cover transition-all duration-300"
              onError={(e) => {
                console.error('PlaceCard image failed to load:', images[currentImageIndex]);
                e.currentTarget.src = 'https://via.placeholder.com/400x256/cccccc/666666?text=Image+Not+Available';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {place.category}
              </span>
            </div>

            {/* Image Gallery Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  {currentImageIndex + 1}/{images.length}
                </div>
              </>
            )}
          </div>

          <div className="md:w-2/3 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{place.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{place.location}</span>
                </div>
                <div className="flex items-center space-x-1 mb-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{place.rating}</span>
                  <span className="text-sm text-gray-500">({place.reviews} reviews)</span>
                </div>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                <Camera className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {place.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary-600" />
                <div>
                  <p className="text-xs text-gray-500">Best Time</p>
                  <p className="text-sm font-medium">{place.bestTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Entry Fee</p>
                  <p className="text-sm font-medium">{place.entryFee}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Timings</p>
                  <p className="text-sm font-medium">{place.timings}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href={`/places/${place._id || place.id}`}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                View Details
              </Link>
              <button
                onClick={handleGetDirections}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative group">
        <Image
          src={images[currentImageIndex]}
          alt={`${place.name} - Image ${currentImageIndex + 1}`}
          width={400}
          height={256}
          className="w-full h-64 object-cover transition-all duration-300"
          onError={(e) => {
            console.error('PlaceCard grid image failed to load:', images[currentImageIndex]);
            e.currentTarget.src = 'https://via.placeholder.com/400x256/cccccc/666666?text=Image+Not+Available';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {place.category}
          </span>
        </div>

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
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
              {currentImageIndex + 1}/{images.length}
            </div>
          </>
        )}

        {/* Camera Icon */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
            <Camera className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{place.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{place.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {place.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Best Time:</span>
            <span className="font-medium">{place.bestTime}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Entry Fee:</span>
            <span className="font-medium text-green-600">{place.entryFee}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {place.reviews} reviews
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handleGetDirections}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-1"
              title="Get Directions"
            >
              <Navigation className="h-3 w-3" />
            </button>
            <Link
              href={`/places/${place._id || place.id}`}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
