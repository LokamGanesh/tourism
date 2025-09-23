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

  // Sample places data - in real app this would come from API
  const allPlaces = [
    {
      id: 1,
      name: 'Betla National Park',
      location: 'Latehar District',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop', // Tiger - wildlife
      images: [
        'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop', // Tiger close-up
        'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=600&fit=crop', // Wildlife in nature
        'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&h=600&fit=crop', // Elephant herd
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', // Dense forest
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop'  // Forest path
      ],
      rating: 4.6,
      reviews: 1234,
      category: 'Wildlife',
      description: 'Famous for tigers, elephants and diverse wildlife in natural habitat.',
      coordinates: [23.8859, 84.1917],
      bestTime: 'October to March',
      entryFee: '₹50 for Indians, ₹200 for foreigners',
      timings: '6:00 AM - 6:00 PM'
    },
    {
      id: 2,
      name: 'Hundru Falls',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop', // Waterfall
      images: [
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop', // Beautiful waterfall
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain waterfall
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Cascade waterfall
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop', // Flowing water
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'  // Forest waterfall
      ],
      rating: 4.4,
      reviews: 856,
      category: 'Waterfall',
      description: 'Spectacular 98-meter high waterfall, perfect for nature lovers.',
      coordinates: [23.4315, 85.4578],
      bestTime: 'July to February',
      entryFee: 'Free',
      timings: '24 hours'
    },
    {
      id: 3,
      name: 'Jagannath Temple',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&h=600&fit=crop', // Hindu temple
      images: [
        'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&h=600&fit=crop', // Temple exterior
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop', // Temple architecture
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop', // Temple complex
        'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop', // Religious ceremony
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'  // Temple details
      ],
      rating: 4.7,
      reviews: 2341,
      category: 'Religious',
      description: 'Ancient temple with stunning architecture and spiritual significance.',
      coordinates: [23.3441, 85.3096],
      bestTime: 'Year round',
      entryFee: 'Free',
      timings: '5:00 AM - 10:00 PM'
    },
    {
      id: 4,
      name: 'Netarhat',
      location: 'Latehar District',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain landscape
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain vista
        'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=800&h=600&fit=crop', // Hill station
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop', // Sunrise view
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop', // Forest landscape
        'https://images.unsplash.com/photo-1418065460487-3956c3aa1bdc?w=800&h=600&fit=crop'  // Sunset view
      ],
      rating: 4.5,
      reviews: 967,
      category: 'Hill Station',
      description: 'Queen of Chotanagpur, famous for sunrise and sunset views.',
      coordinates: [23.4667, 84.2667],
      bestTime: 'October to March',
      entryFee: 'Free',
      timings: '24 hours'
    },
    {
      id: 5,
      name: 'Dassam Falls',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Waterfall
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Main cascade
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop', // Waterfall power
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop', // Forest surroundings
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Natural pool
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'  // Misty atmosphere
      ],
      rating: 4.3,
      reviews: 743,
      category: 'Waterfall',
      description: 'Beautiful cascade waterfall surrounded by dense forests.',
      coordinates: [23.2167, 85.5167],
      bestTime: 'July to February',
      entryFee: 'Free',
      timings: '24 hours'
    },
    {
      id: 6,
      name: 'Palamau Tiger Reserve',
      location: 'Latehar District',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop', // Wildlife
      images: [
        'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop', // Tiger in habitat
        'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=600&fit=crop', // Wildlife sanctuary
        'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&h=600&fit=crop', // Elephants
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop', // Dense forest
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop'  // Safari experience
      ],
      rating: 4.4,
      reviews: 612,
      category: 'Wildlife',
      description: 'First tiger reserve in India, rich biodiversity and scenic beauty.',
      coordinates: [24.0167, 84.0500],
      bestTime: 'November to April',
      entryFee: '₹75 for Indians, ₹300 for foreigners',
      timings: '6:00 AM - 6:00 PM'
    },
    {
      id: 7,
      name: 'Jonha Falls',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop', // Waterfall
      images: [
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop', // Main waterfall
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop', // Water cascade
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Natural beauty
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Scenic landscape
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'  // Mythological significance
      ],
      rating: 4.2,
      reviews: 534,
      category: 'Waterfall',
      description: 'Also known as Gautamdhara, a beautiful waterfall with mythological significance.',
      coordinates: [23.2833, 85.4833],
      bestTime: 'July to February',
      entryFee: 'Free',
      timings: '24 hours'
    },
    {
      id: 8,
      name: 'Deoghar Temple',
      location: 'Deoghar',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop', // Temple
      images: [
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop', // Temple main view
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop', // Temple architecture
        'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop', // Sacred interior
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', // Pilgrimage scene
        'https://images.unsplash.com/photo-1609952651804-2fd7c3bb8f8d?w=800&h=600&fit=crop'  // Evening aarti
      ],
      rating: 4.8,
      reviews: 3456,
      category: 'Religious',
      description: 'One of the twelve Jyotirlingas, major pilgrimage destination.',
      coordinates: [24.4833, 86.7000],
      bestTime: 'October to March',
      entryFee: 'Free',
      timings: '4:00 AM - 11:00 PM'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPlaces(allPlaces)
      setFilteredPlaces(allPlaces)
      setLoading(false)
    }, 1000)
  }, [])

  const handleFilter = (filters) => {
    let filtered = allPlaces

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
