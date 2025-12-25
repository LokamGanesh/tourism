'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import InteractiveMap from '../../components/InteractiveMap'
import LeafletMap from '../../components/LeafletMap'
import ARViewButton from '../../components/ARViewButton'
import ARViewButtonSimple from '../../components/ARViewButtonSimple'
import ReviewsSection from '../../components/ReviewsSection'
import StatisticsChart from '../../components/StatisticsChart'
import NearbyPlaces from '../../components/NearbyPlaces'
import { MapPin, Star, Clock, DollarSign, Camera, Navigation, Share2, Heart, Calendar, Users, Thermometer, Umbrella, X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function PlaceDetailsPage() {
  const params = useParams()
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showGallery, setShowGallery] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`/api/places/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setPlace(data)
        } else {
          setPlace(null)
        }
      } catch (error) {
        console.error('Error fetching place:', error)
        setPlace(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPlace()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Place not found</h2>
            <p className="text-gray-600">The place you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-16">
        <div className="relative h-96 overflow-hidden">
          <Image
            src={place.images?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'}
            alt={place.name}
            width={1200}
            height={384}
            className="w-full h-full object-cover"
            priority
            onError={(e) => {
              console.error('Hero image failed to load:', place.images[0]);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                {place.category}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium">{place.rating}</span>
                <span className="text-sm opacity-90">({place.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
            <div className="flex items-center space-x-1 text-lg">
              <MapPin className="h-5 w-5" />
              <span>{place.location}</span>
            </div>
          </div>
          <div className="absolute top-8 right-8 flex space-x-2">
            <button className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Best Time</p>
                <p className="font-semibold">{place.bestTime}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Entry Fee</p>
                <p className="font-semibold">{place.entryFee}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Timings</p>
                <p className="font-semibold">{place.timings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Visitors</p>
                <p className="font-semibold">{place.reviews}+ reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'map', label: 'Map & Directions' },
                { id: 'reviews', label: 'Reviews & Ratings' },
                { id: 'nearby', label: 'Nearby Places' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">About {place.name}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {place.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Highlights</h4>
                    <ul className="space-y-2">
                      {place.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Facilities</h4>
                    <ul className="space-y-2">
                      {place.facilities.map((facility, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-gray-700">{facility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">How to Reach</h4>
                  <p className="text-gray-700 leading-relaxed">{place.howToReach}</p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Weather Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Thermometer className="h-5 w-5 text-orange-600" />
                        <span className="font-semibold text-orange-800">Summer</span>
                      </div>
                      <p className="text-orange-700">{place.weather.summer}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Thermometer className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Winter</span>
                      </div>
                      <p className="text-blue-700">{place.weather.winter}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Umbrella className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">Monsoon</span>
                      </div>
                      <p className="text-green-700">{place.weather.monsoon}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Map Tab */}
            {activeTab === 'map' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Location & Directions</h3>

                {/* Enhanced Leaflet Map with Navigation */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Interactive Map with Navigation</h4>
                  <LeafletMap
                    destination={place.coordinates}
                    placeName={place.name}
                    showNavigation={true}
                    onNavigationStart={() => console.log('Navigation started')}
                  />
                </div>

                {/* Fallback Google Maps */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Google Maps View</h4>
                  <InteractiveMap
                    coordinates={place.coordinates}
                    placeName={place.name}
                    address={place.location}
                  />
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Statistics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <StatisticsChart placeId={place.id} />
                  <ReviewsSection placeId={place.id} />
                </div>
              </div>
            )}

            {/* Nearby Places Tab */}
            {activeTab === 'nearby' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Nearby Attractions</h3>
                <NearbyPlaces coordinates={place.coordinates} currentPlaceId={place.id} />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates[0]},${place.coordinates[1]}&travelmode=driving`
              window.open(url, '_blank')
            }}
            className="bg-primary-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Navigation className="h-5 w-5" />
            <span>Get Directions</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="bg-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Calendar className="h-5 w-5" />
            <span>Plan Visit</span>
          </button>
          <button
            onClick={() => {
              setCurrentImageIndex(0)
              setShowGallery(true)
            }}
            className="bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Camera className="h-5 w-5" />
            <span>View Gallery ({place.images.length})</span>
          </button>
          <ARViewButton
            placeName={place.name}
            placeImage={place.images[0]}
            coordinates={place.coordinates}
          />
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white">
              <span className="text-sm font-medium">
                {currentImageIndex + 1} / {place.images.length}
              </span>
            </div>

            {/* Previous Button */}
            {place.images.length > 1 && (
              <button
                onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : place.images.length - 1)}
                className="absolute left-4 z-10 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Next Button */}
            {place.images.length > 1 && (
              <button
                onClick={() => setCurrentImageIndex(currentImageIndex < place.images.length - 1 ? currentImageIndex + 1 : 0)}
                className="absolute right-4 z-10 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center p-8">
              <Image
                src={place.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'}
                alt={`${place.name} - Image ${currentImageIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  console.error('Gallery image failed to load:', place.images[currentImageIndex]);
                }}
              />
            </div>

            {/* Image Thumbnails */}
            {place.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex space-x-2 bg-black/50 backdrop-blur-md p-3 rounded-full">
                  {place.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                        ? 'border-white scale-110'
                        : 'border-white/30 hover:border-white/60'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Thumbnail image failed to load:', image);
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Title */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 text-center">
              <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full">
                <h3 className="text-white text-lg font-semibold">{place.name}</h3>
                <p className="text-white/80 text-sm">{place.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
