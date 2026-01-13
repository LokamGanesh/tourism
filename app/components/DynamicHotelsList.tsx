'use client'

import { useHotels } from '@/lib/hooks/useDynamicData'
import Image from 'next/image'
import { MapPin, Star, DollarSign } from 'lucide-react'

interface DynamicHotelsListProps {
  featured?: boolean
  type?: string
  location?: string
}

export default function DynamicHotelsList({ featured, type, location }: DynamicHotelsListProps) {
  const { hotels, loading, error } = useHotels({ featured, type, location })

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

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hotels found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <div key={hotel._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          {hotel.images && hotel.images.length > 0 && (
            <div className="relative h-48">
              <Image
                src={hotel.images[0]}
                alt={hotel.name}
                fill
                className="object-cover"
              />
              {hotel.featured && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Featured
                </span>
              )}
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                {hotel.type}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{hotel.location}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="ml-1 text-sm font-medium">{hotel.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center text-sm font-semibold text-green-600">
                <DollarSign className="h-4 w-4" />
                <span>₹{hotel.priceRange.min} - ₹{hotel.priceRange.max}</span>
              </div>
            </div>
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {hotel.amenities.slice(0, 3).map((amenity: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {amenity}
                  </span>
                ))}
                {hotel.amenities.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{hotel.amenities.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
