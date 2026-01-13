'use client'

import { usePlaces } from '@/lib/hooks/useDynamicData'
import Image from 'next/image'
import { MapPin, Star } from 'lucide-react'

interface DynamicPlacesListProps {
  featured?: boolean
  category?: string
}

export default function DynamicPlacesList({ featured, category }: DynamicPlacesListProps) {
  const { places, loading, error } = usePlaces({ featured, category })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No places found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <div key={place._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          {place.images && place.images.length > 0 && (
            <div className="relative h-48">
              <Image
                src={place.images[0]}
                alt={place.name}
                fill
                className="object-cover"
              />
              {place.featured && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Featured
                </span>
              )}
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{place.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{place.location}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{place.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="ml-1 text-sm font-medium">{place.rating.toFixed(1)}</span>
                <span className="ml-1 text-xs text-gray-500">({place.reviews} reviews)</span>
              </div>
              {place.category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {place.category}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
