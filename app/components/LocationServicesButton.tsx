'use client'

import { useState, useEffect } from 'react'
import { MapPin, Cross, Utensils, Hotel, X, Navigation, Phone } from 'lucide-react'

interface NearbyService {
  id: string
  name: string
  type: 'restaurant' | 'hotel' | 'hospital'
  distance: number
  rating?: number
  address: string
  phone?: string
  coordinates: [number, number]
}

export default function LocationServicesButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [nearbyServices, setNearbyServices] = useState<NearbyService[]>([])
  const [loading, setLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'restaurant' | 'hotel' | 'hospital'>('all')

  // Sample nearby services data (in real app, this would come from APIs)
  const sampleServices: NearbyService[] = [
    {
      id: '1',
      name: 'Kaveri Restaurant',
      type: 'restaurant',
      distance: 0.5,
      rating: 4.5,
      address: 'Main Road, Ranchi',
      phone: '+91-651-2234567',
      coordinates: [23.3441, 85.3096]
    },
    {
      id: '2',
      name: 'Hotel Yuvraj Palace',
      type: 'hotel',
      distance: 0.8,
      rating: 4.2,
      address: 'Station Road, Ranchi',
      phone: '+91-651-2345678',
      coordinates: [23.3450, 85.3100]
    },
    {
      id: '3',
      name: 'Rajendra Institute of Medical Sciences',
      type: 'hospital',
      distance: 1.2,
      address: 'Bariatu, Ranchi',
      phone: '+91-651-2451070',
      coordinates: [23.3520, 85.3200]
    },
    {
      id: '4',
      name: 'Moti Mahal Delux',
      type: 'restaurant',
      distance: 0.3,
      rating: 4.4,
      address: 'Albert Ekka Chowk, Ranchi',
      phone: '+91-651-2567890',
      coordinates: [23.3430, 85.3080]
    },
    {
      id: '5',
      name: 'Radisson Blu Hotel',
      type: 'hotel',
      distance: 1.0,
      rating: 4.6,
      address: 'Hinoo, Ranchi',
      phone: '+91-651-6666666',
      coordinates: [23.3400, 85.3150]
    },
    {
      id: '6',
      name: 'Sadar Hospital',
      type: 'hospital',
      distance: 0.7,
      address: 'Doranda, Ranchi',
      phone: '+91-651-2408234',
      coordinates: [23.3380, 85.3120]
    }
  ]

  const getUserLocation = () => {
    setLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Location services not supported by this browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation([latitude, longitude])
        
        // Calculate actual distances using Haversine formula
        const servicesWithDistance = sampleServices.map(service => {
          const distance = calculateDistance(
            latitude, longitude,
            service.coordinates[0], service.coordinates[1]
          )
          return {
            ...service,
            distance: Math.round(distance * 10) / 10 // Round to 1 decimal
          }
        }).sort((a, b) => a.distance - b.distance)
        
        setNearbyServices(servicesWithDistance)
        setLoading(false)
      },
      (error) => {
        let errorMessage = 'Unable to get your location. '
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage += 'Please allow location access and try again.'
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage += 'Location information unavailable.'
        } else if (error.code === error.TIMEOUT) {
          errorMessage += 'Location request timed out.'
        }
        
        setLocationError(errorMessage)
        setLoading(false)
        console.error('Geolocation error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    )
  }

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return <Utensils className="h-4 w-4" />
      case 'hotel':
        return <Hotel className="h-4 w-4" />
      case 'hospital':
        return <Cross className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'text-orange-600 bg-orange-100'
      case 'hotel':
        return 'text-blue-600 bg-blue-100'
      case 'hospital':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const handleServiceClick = (service: NearbyService) => {
    // Open directions in Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&destination=${service.coordinates[0]},${service.coordinates[1]}`
    window.open(url, '_blank')
  }

  const handleCallService = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true)
          if (!userLocation) {
            getUserLocation()
          }
        }}
        className="fixed bottom-24 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all transform hover:scale-110 z-40"
        title="Find Nearby Services"
      >
        <MapPin className="h-6 w-6" />
      </button>
    )
  }

  const filteredServices = activeFilter === 'all' 
    ? nearbyServices 
    : nearbyServices.filter(service => service.type === activeFilter)

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-40 border border-gray-200 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <h3 className="font-semibold text-lg">Nearby Services</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2 mt-3">
          {(['all', 'restaurant', 'hotel', 'hospital'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-white text-green-600'
                  : 'bg-green-700 text-white hover:bg-green-600'
              }`}
            >
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-80">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Finding nearby services...</span>
          </div>
        )}

        {locationError && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">
              <MapPin className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-red-600 mb-4">{locationError}</p>
            <button
              onClick={getUserLocation}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !locationError && filteredServices.length > 0 && (
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`p-1 rounded-full ${getServiceColor(service.type)}`}>
                        {getServiceIcon(service.type)}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">{service.name}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{service.address}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{service.distance.toFixed(1)} km away</span>
                      {service.rating && (
                        <span className="flex items-center">
                          ⭐ {service.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleServiceClick(service)}
                      className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                      title="Get Directions"
                    >
                      <Navigation className="h-3 w-3" />
                    </button>
                    {service.phone && (
                      <button
                        onClick={() => handleCallService(service.phone!)}
                        className="bg-green-600 text-white p-1.5 rounded-lg hover:bg-green-700 transition-colors"
                        title="Call"
                      >
                        <Phone className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !locationError && filteredServices.length === 0 && nearbyServices.length > 0 && (
          <div className="text-center py-8">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No {activeFilter} services found nearby</p>
          </div>
        )}

        {!loading && !locationError && nearbyServices.length === 0 && userLocation && (
          <div className="text-center py-8">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No nearby services found</p>
          </div>
        )}
        {!loading && !locationError && !userLocation && (
          <div className="text-center py-8">
            <button
              onClick={getUserLocation}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Enable Location Access
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Allow location access to find nearby services
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
