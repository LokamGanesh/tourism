'use client'

import { useState } from 'react'
import { usePlaces, useHotels, useRestaurants, useEvents } from '@/lib/hooks/useDynamicData'
import Image from 'next/image'
import { MapPin, Star, Calendar, Utensils, Hotel as HotelIcon, Landmark } from 'lucide-react'

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'places' | 'hotels' | 'restaurants' | 'events'>('places')
  
  const { places, loading: placesLoading } = usePlaces({ featured: true })
  const { hotels, loading: hotelsLoading } = useHotels({ featured: true })
  const { restaurants, loading: restaurantsLoading } = useRestaurants({ featured: true })
  const { events, loading: eventsLoading } = useEvents({ upcoming: true })

  const renderPlaces = () => {
    if (placesLoading) return <LoadingGrid />
    
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

  const renderHotels = () => {
    if (hotelsLoading) return <LoadingGrid />
    
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
                <div className="text-sm font-semibold text-green-600">
                  ₹{hotel.priceRange.min} - ₹{hotel.priceRange.max}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderRestaurants = () => {
    if (restaurantsLoading) return <LoadingGrid />
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            {restaurant.images && restaurant.images.length > 0 && (
              <div className="relative h-48">
                <Image
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
                {restaurant.featured && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </span>
                )}
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{restaurant.location}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
                </div>
                <div className="text-sm font-semibold text-green-600">
                  ₹{restaurant.priceRange.min} - ₹{restaurant.priceRange.max}
                </div>
              </div>
              {restaurant.cuisineType && restaurant.cuisineType.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {restaurant.cuisineType.slice(0, 3).map((cuisine: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      {cuisine}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderEvents = () => {
    if (eventsLoading) return <LoadingGrid />
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            {event.images && event.images.length > 0 && (
              <div className="relative h-48">
                <Image
                  src={event.images[0]}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                {event.featured && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </span>
                )}
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(event.startDate).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {event.category}
                </span>
                {event.ticketPrice?.free ? (
                  <span className="text-sm font-semibold text-green-600">Free</span>
                ) : (
                  <span className="text-sm font-semibold text-green-600">
                    ₹{event.ticketPrice?.min} - ₹{event.ticketPrice?.max}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Jharkhand</h1>
          <p className="text-gray-600">Discover amazing places, hotels, restaurants, and events</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'places' as const, label: 'Places', icon: Landmark },
                { id: 'hotels' as const, label: 'Hotels', icon: HotelIcon },
                { id: 'restaurants' as const, label: 'Restaurants', icon: Utensils },
                { id: 'events' as const, label: 'Events', icon: Calendar }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mb-6">
          {activeTab === 'places' && renderPlaces()}
          {activeTab === 'hotels' && renderHotels()}
          {activeTab === 'restaurants' && renderRestaurants()}
          {activeTab === 'events' && renderEvents()}
        </div>
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )
}
