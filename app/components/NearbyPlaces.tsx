'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// Use native img to avoid Next/Image domain limits for dynamic images
import { MapPin, Star, Clock, Navigation } from 'lucide-react'

interface NearbyPlacesProps {
  coordinates: [number, number]
  currentPlaceId: number
}

interface NearbyPlace {
  id: number
  name: string
  type: 'attraction' | 'hotel' | 'restaurant'
  distance: string
  rating: number
  image: string
  description: string
  coordinates: [number, number]
}

export default function NearbyPlaces({ coordinates, currentPlaceId }: NearbyPlacesProps) {
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  // Sample nearby places data
  const sampleNearbyPlaces: NearbyPlace[] = [
    {
      id: 7,
      name: 'Palamau Fort',
      type: 'attraction',
      distance: '15 km',
      rating: 4.2,
      image: 'https://source.unsplash.com/featured/300x200/?Jharkhand%20tourist%20place',
      description: 'Historic fort with ancient architecture and panoramic views.',
      coordinates: [23.9000, 84.2000]
    },
    {
      id: 8,
      name: 'Forest Rest House',
      type: 'hotel',
      distance: '2 km',
      rating: 4.0,
      image: 'https://source.unsplash.com/featured/300x200/?Hundru%20Falls',
      description: 'Comfortable accommodation within the forest premises.',
      coordinates: [23.8900, 84.1950]
    },
    {
      id: 9,
      name: 'Tribal Cuisine Restaurant',
      type: 'restaurant',
      distance: '8 km',
      rating: 4.5,
      image: 'https://source.unsplash.com/featured/300x200/?Dassam%20Falls',
      description: 'Authentic local tribal cuisine and traditional dishes.',
      coordinates: [23.8800, 84.1800]
    },
    {
      id: 10,
      name: 'Kechki Waterfall',
      type: 'attraction',
      distance: '25 km',
      rating: 4.3,
      image: 'https://source.unsplash.com/featured/300x200/?Jonha%20Falls',
      description: 'Beautiful waterfall perfect for picnics and photography.',
      coordinates: [23.8500, 84.1500]
    },
    {
      id: 11,
      name: 'Eco Lodge Betla',
      type: 'hotel',
      distance: '5 km',
      rating: 4.4,
      image: 'https://source.unsplash.com/featured/300x200/?Netarhat%20Jharkhand',
      description: 'Eco-friendly lodge with modern amenities and nature views.',
      coordinates: [23.8750, 84.1850]
    },
    {
      id: 12,
      name: 'Dhaba Junction',
      type: 'restaurant',
      distance: '12 km',
      rating: 4.1,
      image: 'https://source.unsplash.com/featured/300x200/?Parasnath%20Hill',
      description: 'Popular roadside dhaba serving North Indian cuisine.',
      coordinates: [23.8650, 84.1700]
    }
  ]

  useEffect(() => {
    // Simulate API call to fetch nearby places
    setTimeout(() => {
      setNearbyPlaces(sampleNearbyPlaces)
      setLoading(false)
    }, 1000)
  }, [coordinates])

  const filteredPlaces = nearbyPlaces.filter(place => 
    activeFilter === 'all' || place.type === activeFilter
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attraction':
        return '🏛️'
      case 'hotel':
        return '🏨'
      case 'restaurant':
        return '🍽️'
      default:
        return '📍'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'attraction':
        return 'bg-blue-100 text-blue-800'
      case 'hotel':
        return 'bg-green-100 text-green-800'
      case 'restaurant':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Places
        </button>
        <button
          onClick={() => setActiveFilter('attraction')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeFilter === 'attraction'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏛️ Attractions
        </button>
        <button
          onClick={() => setActiveFilter('hotel')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeFilter === 'hotel'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏨 Hotels
        </button>
        <button
          onClick={() => setActiveFilter('restaurant')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeFilter === 'restaurant'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🍽️ Restaurants
        </button>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x128/cccccc/666666?text=Image+Not+Available'
                }}
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(place.type)}`}>
                  {getTypeIcon(place.type)} {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {place.distance}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{place.name}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{place.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {place.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{place.distance} away</span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors">
                    <Navigation className="h-4 w-4" />
                  </button>
                  {place.type === 'attraction' && (
                    <Link
                      href={`/places/${place.id}`}
                      className="bg-primary-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      View
                    </Link>
                  )}
                  {place.type === 'hotel' && (
                    <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Book
                    </button>
                  )}
                  {place.type === 'restaurant' && (
                    <button className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                      Menu
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No places found</h4>
          <p className="text-gray-500">Try selecting a different category to see more options.</p>
        </div>
      )}

      {/* View All Button */}
      {filteredPlaces.length > 0 && (
        <div className="text-center">
          <Link
            href="/hotels"
            className="inline-flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <MapPin className="h-4 w-4 mr-2" />
            View All Nearby Places
          </Link>
        </div>
      )}
    </div>
  )
}
