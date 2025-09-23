'use client'

import { useEffect, useRef, useState } from 'react'
import { Navigation, Volume2, VolumeX, Play, Square, MapPin } from 'lucide-react'

interface LeafletMapProps {
  destination: [number, number]
  placeName: string
  showNavigation?: boolean
  onNavigationStart?: () => void
}

export default function LeafletMap({ destination, placeName, showNavigation = false, onNavigationStart }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [routingControl, setRoutingControl] = useState<any>(null)
  const [nearbyPOIs, setNearbyPOIs] = useState<any[]>([])

  // Sample POI data
  const samplePOIs = [
    { id: 1, name: 'Hotel Yuvraj Palace', type: 'hotel', coords: [23.3450, 85.3100], icon: '🏨' },
    { id: 2, name: 'Kaveri Restaurant', type: 'restaurant', coords: [23.3441, 85.3096], icon: '🍽️' },
    { id: 3, name: 'RIMS Hospital', type: 'hospital', coords: [23.3520, 85.3200], icon: '🏥' },
    { id: 4, name: 'Tribal Handicrafts Center', type: 'handicraft', coords: [23.3460, 85.3110], icon: '🎨' },
    { id: 5, name: 'Cultural Festival Ground', type: 'event', coords: [23.3480, 85.3130], icon: '🎭' }
  ]

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      initializeMap()
    }
  }, [])

  useEffect(() => {
    if (map && userLocation && destination && showNavigation) {
      setupRouting()
    }
  }, [map, userLocation, destination, showNavigation])

  const initializeMap = async () => {
    try {
      // Dynamic import for client-side only
      const L = (await import('leaflet')).default
      
      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      const mapInstance = L.map(mapRef.current!).setView([destination[0], destination[1]], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance)

      // Add destination marker
      const destinationMarker = L.marker([destination[0], destination[1]]).addTo(mapInstance)
      destinationMarker.bindPopup(`<b>${placeName}</b>`).openPopup()

      // Add POI markers
      samplePOIs.forEach(poi => {
        const poiMarker = L.marker([poi.coords[0], poi.coords[1]]).addTo(mapInstance)
        poiMarker.bindPopup(`${poi.icon} <b>${poi.name}</b><br><small>${poi.type}</small>`)
      })

      setMap(mapInstance)
      setNearbyPOIs(samplePOIs)

      // Get user location
      getUserLocation()

    } catch (error) {
      console.error('Error initializing map:', error)
    }
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          
          if (map) {
            const L = require('leaflet')
            const userMarker = L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'user-location-marker',
                html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(map)
            
            userMarker.bindPopup('Your Location')
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
        }
      )
    }
  }

  const setupRouting = async () => {
    if (!map || !userLocation) return

    try {
      const L = (await import('leaflet')).default

      if (routingControl) {
        map.removeLayer(routingControl)
      }

      // Simple polyline route (in real app, use routing service)
      const routeCoords: [number, number][] = [
        [userLocation[0], userLocation[1]],
        [destination[0], destination[1]]
      ]

      const polyline = L.polyline(routeCoords, {
        color: '#3b82f6',
        weight: 6,
        opacity: 0.8
      }).addTo(map)

      setRoutingControl(polyline)

      // Calculate approximate distance
      const distance = map.distance([userLocation[0], userLocation[1]], [destination[0], destination[1]])
      const distanceKm = (distance / 1000).toFixed(1)
      const estimatedTime = Math.round(distance / 1000 * 3) // Rough estimate: 3 min per km

      if (voiceEnabled && isNavigating) {
        speakInstruction(`Route found. Total distance: ${distanceKm} kilometers. Estimated time: ${estimatedTime} minutes.`)
      }
    } catch (error) {
      console.error('Error setting up routing:', error)
    }
  }

  const speakInstruction = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const startNavigation = () => {
    setIsNavigating(true)
    onNavigationStart?.()
    
    if (voiceEnabled) {
      speakInstruction(`Starting navigation to ${placeName}. Please follow the blue route on the map.`)
    }

    // Simulate turn-by-turn instructions
    simulateTurnByTurnNavigation()
  }

  const stopNavigation = () => {
    setIsNavigating(false)
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
  }

  const simulateTurnByTurnNavigation = () => {
    const instructions = [
      "In 100 meters, turn right onto Main Road",
      "Continue straight for 2 kilometers",
      "Turn left at the traffic signal",
      "Your destination will be on the right"
    ]

    let currentInstruction = 0
    
    const instructionInterval = setInterval(() => {
      if (currentInstruction < instructions.length && isNavigating) {
        if (voiceEnabled) {
          speakInstruction(instructions[currentInstruction])
        }
        currentInstruction++
      } else {
        clearInterval(instructionInterval)
        if (isNavigating && voiceEnabled) {
          speakInstruction(`You have arrived at ${placeName}`)
        }
      }
    }, 5000) // Every 5 seconds for demo
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-96 rounded-lg shadow-lg" />
      
      {showNavigation && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={voiceEnabled ? () => setVoiceEnabled(false) : () => setVoiceEnabled(true)}
              className={`p-2 rounded-lg transition-colors ${
                voiceEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}
              title={voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            
            {!isNavigating ? (
              <button
                onClick={startNavigation}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Start Navigation</span>
              </button>
            ) : (
              <button
                onClick={stopNavigation}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Square className="h-4 w-4" />
                <span>Stop</span>
              </button>
            )}
          </div>
          
          {isNavigating && (
            <div className="bg-blue-50 p-2 rounded text-sm text-blue-800">
              <div className="flex items-center space-x-1">
                <Navigation className="h-3 w-3" />
                <span>Navigation Active</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* POI Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <span>🏨</span><span>Hotels</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🍽️</span><span>Restaurants</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🏥</span><span>Hospitals</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🎨</span><span>Handicrafts</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🎭</span><span>Events</span>
          </div>
        </div>
      </div>
    </div>
  )
}
