'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation, MapPin, Volume2, VolumeX, Play, Square, RotateCcw } from 'lucide-react'
import Navbar from '../components/Navbar'

interface LocationData {
  name: string
  coordinates: [number, number]
  address: string
}

export default function MapPage() {
  const searchParams = useSearchParams()
  const [location, setLocation] = useState<LocationData | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [currentInstruction, setCurrentInstruction] = useState('')
  const [distance, setDistance] = useState<string>('')
  const [eta, setEta] = useState<string>('')
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Get location data from URL parameters
    const name = searchParams.get('name')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const address = searchParams.get('address')

    console.log('URL Parameters:', { name, lat, lng, address })

    if (name && lat && lng) {
      const parsedLat = parseFloat(lat)
      const parsedLng = parseFloat(lng)
      
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        setLocation({
          name,
          coordinates: [parsedLat, parsedLng],
          address: address || `${lat}, ${lng}`
        })
        console.log('Location set:', { name, coordinates: [parsedLat, parsedLng], address })
      } else {
        console.error('Invalid coordinates:', { lat, lng })
      }
    } else {
      console.log('Missing required parameters:', { name, lat, lng })
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [searchParams])

  const getCurrentLocation = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ]
          resolve(coords)
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = (lon2 - lon1) * Math.PI / 180
    const lat1Rad = lat1 * Math.PI / 180
    const lat2Rad = lat2 * Math.PI / 180
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad)
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon)
    
    const bearing = Math.atan2(y, x) * 180 / Math.PI
    return (bearing + 360) % 360
  }

  const getDirectionText = (bearing: number): string => {
    const directions = [
      'North', 'North-East', 'East', 'South-East',
      'South', 'South-West', 'West', 'North-West'
    ]
    const index = Math.round(bearing / 45) % 8
    return directions[index]
  }

  const speakInstruction = (text: string) => {
    if (!voiceEnabled || !speechSynthesisRef.current) return

    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesisRef.current.speak(utterance)
  }

  const updateNavigation = (currentPos: [number, number]) => {
    if (!location) return

    const dist = calculateDistance(
      currentPos[0], currentPos[1],
      location.coordinates[0], location.coordinates[1]
    )

    const bearing = calculateBearing(
      currentPos[0], currentPos[1],
      location.coordinates[0], location.coordinates[1]
    )

    const direction = getDirectionText(bearing)
    const distanceText = dist < 1 
      ? `${Math.round(dist * 1000)} meters`
      : `${dist.toFixed(1)} kilometers`

    setDistance(distanceText)
    
    // Calculate ETA (assuming average speed of 40 km/h)
    const etaMinutes = Math.round((dist / 40) * 60)
    setEta(etaMinutes < 1 ? '< 1 minute' : `${etaMinutes} minutes`)

    let instruction = ''
    if (dist < 0.1) {
      instruction = `You have arrived at ${location.name}`
      setIsNavigating(false)
    } else if (dist < 0.5) {
      instruction = `You are ${distanceText} away from ${location.name}. Continue straight.`
    } else {
      instruction = `Head ${direction} for ${distanceText} towards ${location.name}`
    }

    setCurrentInstruction(instruction)

    // Speak instruction every 30 seconds or when direction changes significantly
    if (voiceEnabled) {
      speakInstruction(instruction)
    }
  }

  const startNavigation = async () => {
    try {
      const currentPos = await getCurrentLocation()
      setUserLocation(currentPos)
      setIsNavigating(true)

      // Initial instruction
      speakInstruction(`Starting navigation to ${location?.name}. Getting your current location.`)

      // Watch position changes
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newPos: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ]
          setUserLocation(newPos)
          updateNavigation(newPos)
        },
        (error) => {
          console.error('Error watching position:', error)
          speakInstruction('Unable to track your location. Please check your GPS settings.')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      )

    } catch (error) {
      console.error('Error getting location:', error)
      alert('Unable to access your location. Please enable location services.')
    }
  }

  const stopNavigation = () => {
    setIsNavigating(false)
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
    }
    setIsSpeaking(false)
    speakInstruction('Navigation stopped.')
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (voiceEnabled && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Location not found</h3>
              <p className="text-gray-600 mb-4">Please select a location to view directions.</p>
              
              {/* Debug info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-semibold text-gray-900 mb-2">Debug Information:</h4>
                <p className="text-sm text-gray-600">
                  Name: {searchParams.get('name') || 'Not provided'}<br/>
                  Latitude: {searchParams.get('lat') || 'Not provided'}<br/>
                  Longitude: {searchParams.get('lng') || 'Not provided'}<br/>
                  Address: {searchParams.get('address') || 'Not provided'}
                </p>
              </div>
              
              {/* Test Navigation Button */}
              <div className="mt-6">
                <button
                  onClick={() => window.location.href = '/test-map'}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Test Navigation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
                <p className="text-gray-600">{location.address}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleVoice}
                  className={`p-3 rounded-lg transition-colors ${
                    voiceEnabled 
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                  title={voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
                >
                  {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-[60vh] bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-md mx-4">
              <div className="relative mb-6">
                <div className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center ${
                  isNavigating ? 'bg-green-100 animate-pulse' : 'bg-blue-100'
                }`}>
                  <MapPin className={`h-8 w-8 ${isNavigating ? 'text-green-600' : 'text-blue-600'}`} />
                </div>
                {isNavigating && (
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isNavigating ? 'Navigation Active' : 'AI Navigation Ready'}
              </h3>
              
              <p className="text-gray-600 mb-4">
                Destination: <span className="font-medium">{location.name}</span>
              </p>
              
              {!isNavigating ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Click the start button below to begin AI-powered voice navigation with real-time GPS tracking.
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium">
                      🤖 AI Assistant will provide turn-by-turn directions
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-green-600 font-medium">
                    AI Assistant is guiding you to your destination
                  </p>
                  {distance && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        📍 Distance: {distance} • ETA: {eta}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {userLocation && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    📍 Your location: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation Status Overlay */}
          {isNavigating && (
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                    <span className="text-sm font-medium text-gray-900">
                      {isSpeaking ? 'Speaking...' : 'Navigating'}
                    </span>
                  </div>
                  {distance && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-600">{distance}</div>
                      <div className="text-xs text-gray-500">ETA: {eta}</div>
                    </div>
                  )}
                </div>
                {currentInstruction && (
                  <p className="text-sm text-gray-700 leading-relaxed">{currentInstruction}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls - Always Visible */}
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Debug Status */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {location ? `Ready for ${location.name}` : 'No location data'} | 
                <strong> Navigation:</strong> {isNavigating ? 'Active' : 'Inactive'} | 
                <strong> Voice:</strong> {voiceEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {!isNavigating ? (
                <button
                  onClick={startNavigation}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <div className="relative">
                    <Play className="h-6 w-6" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-lg">Start AI Navigation</div>
                    <div className="text-xs text-blue-100">Voice-guided directions</div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={stopNavigation}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <Square className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-lg">Stop Navigation</div>
                    <div className="text-xs text-red-100">End voice guidance</div>
                  </div>
                </button>
              )}
              
              <button
                onClick={() => {
                  if (location) {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[0]},${location.coordinates[1]}`, '_blank')
                  } else {
                    alert('No destination coordinates available')
                  }
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-3"
              >
                <Navigation className="h-5 w-5" />
                <span>Open in Google Maps</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">How Voice Navigation Works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click "Start Voice Navigation" to begin</li>
                <li>• Allow location access when prompted</li>
                <li>• The AI assistant will provide turn-by-turn directions</li>
                <li>• Toggle voice on/off using the speaker icon</li>
                <li>• Your location is tracked in real-time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
