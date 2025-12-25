'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PlaceCard from '../components/PlaceCard'
import SearchFilter from '../components/SearchFilter'
import { MapPin, Filter, Grid, List } from 'lucide-react'

export default function PlacesPage() {
  const [places, setPlaces] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('/api/places')
        if (response.ok) {
          const data = await response.json()
          // Ensure images array exists and has content for compatibility
          const processedData = data.map(place => ({
            ...place,
            id: place._id, // Map _id to id for component compatibility
            image: place.images && place.images.length > 0 ? place.images[0] : 'https://via.placeholder.com/800x600?text=No+Image',
            coordinates: place.coordinates || [23.3441, 85.3096] // Fallback to Ranchi
          }))
          setPlaces(processedData)
          setFilteredPlaces(processedData)
        } else {
          console.error('Failed to fetch places')
        }
      } catch (error) {
        console.error('Error fetching places:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  const handleFilter = (filters) => {
    let filtered = places

    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(place => place.category === filters.category)
    }

    if (filters.location && filters.location !== 'All') {
      filtered = filtered.filter(place => place.location === filters.location)
    }

    if (filters.rating) {
      filtered = filtered.filter(place => place.rating >= filters.rating)
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    setFilteredPlaces(filtered)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-12 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Jharkhand
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the diverse tourist destinations across Jharkhand, from pristine waterfalls to ancient temples and wildlife sanctuaries.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <SearchFilter onFilter={handleFilter} />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700 font-medium">
                  {filteredPlaces.length} places found
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Places Grid/List */}
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-6'
            }>
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {filteredPlaces.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No places found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
