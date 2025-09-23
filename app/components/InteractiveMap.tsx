'use client'

import { useEffect, useRef } from 'react'
import { MapPin, Navigation, Share2 } from 'lucide-react'

interface InteractiveMapProps {
  coordinates: [number, number]
  placeName: string
  address: string
}

export default function InteractiveMap({ coordinates, placeName, address }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real implementation, you would initialize Leaflet here
    // For now, we'll create a placeholder with Google Maps embed
  }, [coordinates])

  const handleGetDirections = () => {
    const mapUrl = `/map?name=${encodeURIComponent(placeName)}&lat=${coordinates[0]}&lng=${coordinates[1]}&address=${encodeURIComponent(address)}`
    window.location.href = mapUrl
  }

  const handleShareLocation = () => {
    const shareUrl = `https://www.google.com/maps/place/${coordinates[0]},${coordinates[1]}`
    navigator.clipboard.writeText(shareUrl)
    alert('Location link copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="relative bg-gray-200 rounded-xl overflow-hidden" style={{ height: '400px' }}>
        {/* Placeholder for actual map - replace with Leaflet implementation */}
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.2!2d${coordinates[1]}!3d${coordinates[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUzJzA5LjIiTiA4NMKwMTEnMzAuMSJF!5e0!3m2!1sen!2sin!4v1635789012345!5m2!1sen!2sin`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={handleGetDirections}
            className="bg-white shadow-lg p-3 rounded-lg hover:bg-gray-50 transition-colors"
            title="Get Directions"
          >
            <Navigation className="h-5 w-5 text-primary-600" />
          </button>
          <button
            onClick={handleShareLocation}
            className="bg-white shadow-lg p-3 rounded-lg hover:bg-gray-50 transition-colors"
            title="Share Location"
          >
            <Share2 className="h-5 w-5 text-primary-600" />
          </button>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{placeName}</h4>
            <p className="text-gray-600 mb-4">{address}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGetDirections}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions</span>
              </button>
              <button
                onClick={handleShareLocation}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Location</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h5 className="font-medium text-gray-900 mb-2">Coordinates</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Latitude:</span>
            <span className="ml-2 font-mono">{coordinates[0]}</span>
          </div>
          <div>
            <span className="text-gray-500">Longitude:</span>
            <span className="ml-2 font-mono">{coordinates[1]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
