'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelCard from '../components/HotelCard'
import RestaurantCard from '../components/RestaurantCard'
import { MapPin, Filter, Star, Wifi, Car, Utensils, Coffee } from 'lucide-react'

export default function HotelsPage() {
  const [activeTab, setActiveTab] = useState('hotels')
  const [hotels, setHotels] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    priceRange: 'all',
    rating: 0,
    amenities: [],
    location: 'all'
  })

  // Sample hotels data
  const sampleHotels = [
    {
      id: 1,
      name: 'Radisson Blu Hotel Ranchi',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=800',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
        'https://images.unsplash.com/photo-1541534401786-2077eed87a74?w=800',
        'https://images.unsplash.com/photo-1501117716987-c8e0041a3eb1?w=800'
      ],
      rating: 4.5,
      reviews: 1234,
      price: 4500,
      amenities: ['wifi', 'parking', 'restaurant', 'gym', 'spa'],
      description: 'Luxury hotel in the heart of Ranchi with modern amenities and excellent service.',
      coordinates: [23.3441, 85.3096]
    },
    {
      id: 2,
      name: 'Hotel Yuvraj Palace',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
      images: [
        'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=800',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800'
      ],
      rating: 4.2,
      reviews: 856,
      price: 2800,
      amenities: ['wifi', 'parking', 'restaurant', 'room-service'],
      description: 'Comfortable mid-range hotel with good facilities and central location.',
      coordinates: [23.3441, 85.3096]
    },
    {
      id: 3,
      name: 'Forest Rest House Betla',
      location: 'Betla National Park',
      image: 'https://source.unsplash.com/featured/800x600/?forest%20lodge%20India',
      images: [
        'https://source.unsplash.com/featured/800x600/?forest%20resort',
        'https://source.unsplash.com/featured/800x600/?jungle%20lodge',
        'https://source.unsplash.com/featured/800x600/?wildlife%20India',
        'https://source.unsplash.com/featured/800x600/?eco%20room',
        'https://source.unsplash.com/featured/800x600/?nature%20dining'
      ],
      rating: 4.0,
      reviews: 432,
      price: 1200,
      amenities: ['parking', 'restaurant', 'nature-view'],
      description: 'Government rest house inside the national park, perfect for wildlife enthusiasts.',
      coordinates: [23.8859, 84.1917]
    },
    {
      id: 4,
      name: 'Eco Lodge Netarhat',
      location: 'Netarhat',
      image: 'https://source.unsplash.com/featured/800x600/?eco%20lodge%20India',
      images: [
        'https://source.unsplash.com/featured/800x600/?eco%20resort',
        'https://source.unsplash.com/featured/800x600/?Netarhat%20view',
        'https://source.unsplash.com/featured/800x600/?eco%20room',
        'https://source.unsplash.com/featured/800x600/?forest%20dining',
        'https://source.unsplash.com/featured/800x600/?bonfire%20camp'
      ],
      rating: 4.3,
      reviews: 567,
      price: 2200,
      amenities: ['wifi', 'restaurant', 'nature-view', 'bonfire'],
      description: 'Eco-friendly lodge with stunning hill views and sustainable practices.',
      coordinates: [23.4667, 84.2667]
    },
    {
      id: 5,
      name: 'Hotel Ashoka International',
      location: 'Deoghar',
      image: 'https://source.unsplash.com/featured/800x600/?hotel%20Deoghar',
      images: [
        'https://source.unsplash.com/featured/800x600/?hotel%20building%20India',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
        'https://images.unsplash.com/photo-1541534401786-2077eed87a74?w=800',
        'https://source.unsplash.com/featured/800x600/?Deoghar%20temple'
      ],
      rating: 4.1,
      reviews: 743,
      price: 1800,
      amenities: ['wifi', 'parking', 'restaurant', 'ac'],
      description: 'Well-located hotel near Baidyanath Temple with comfortable rooms.',
      coordinates: [24.4833, 86.7000]
    },
    {
      id: 6,
      name: 'The Oasis Resort',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1501117716987-c8e0041a3eb1?w=800',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1519822472237-3c8b1b626c86?w=800',
        'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=800',
        'https://images.unsplash.com/photo-1541534401786-2077eed87a74?w=800',
        'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=800'
      ],
      rating: 4.4,
      reviews: 321,
      price: 3500,
      amenities: ['wifi', 'parking', 'restaurant', 'pool', 'spa', 'gym'],
      description: 'Resort-style accommodation with recreational facilities and gardens.',
      coordinates: [23.3441, 85.3096]
    }
  ]

  // Sample restaurants data
  const sampleRestaurants = [
    {
      id: 1,
      name: 'Kaveri Restaurant',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      images: [
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
        'https://images.unsplash.com/photo-1604908554028-57f8f4e0f0d5?w=800',
        'https://images.unsplash.com/photo-1604908553985-3b48e9cf9f27?w=800',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
      ],
      rating: 4.6,
      reviews: 2341,
      cuisine: 'North Indian, South Indian',
      priceRange: '₹₹',
      specialties: ['Thali', 'Biryani', 'Dosa'],
      description: 'Popular family restaurant serving authentic Indian cuisine with great ambiance.',
      coordinates: [23.3441, 85.3096]
    },
    {
      id: 2,
      name: 'Tribal Cuisine',
      location: 'Betla',
      image: 'https://source.unsplash.com/featured/800x600/?tribal%20food%20India',
      images: [
        'https://source.unsplash.com/featured/800x600/?tribal%20cuisine',
        'https://source.unsplash.com/featured/800x600/?traditional%20cooking%20India',
        'https://source.unsplash.com/featured/800x600/?bamboo%20shoot%20curry',
        'https://source.unsplash.com/featured/800x600/?local%20ingredients%20India',
        'https://source.unsplash.com/featured/800x600/?rustic%20restaurant'
      ],
      rating: 4.3,
      reviews: 567,
      cuisine: 'Tribal, Local',
      priceRange: '₹',
      specialties: ['Handia', 'Rugra', 'Bamboo Shoot Curry'],
      description: 'Authentic tribal cuisine experience with traditional cooking methods.',
      coordinates: [23.8859, 84.1917]
    },
    {
      id: 3,
      name: 'Moti Mahal Delux',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      images: [
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
        'https://images.unsplash.com/photo-1625944526315-4d0c03f2bb27?w=800',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
        'https://images.unsplash.com/photo-1604908177073-df0b2e6900b8?w=800',
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800'
      ],
      rating: 4.4,
      reviews: 1876,
      cuisine: 'North Indian, Mughlai',
      priceRange: '₹₹₹',
      specialties: ['Butter Chicken', 'Kebabs', 'Naan'],
      description: 'Premium restaurant chain known for Mughlai cuisine and tandoor dishes.',
      coordinates: [23.3441, 85.3096]
    },
    {
      id: 4,
      name: 'Dhaba Junction',
      location: 'Highway (Multiple locations)',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856b?w=800',
      images: [
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
        'https://images.unsplash.com/photo-1601050690597-9fd4b29f4101?w=800',
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
        'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800'
      ],
      rating: 4.2,
      reviews: 934,
      cuisine: 'Punjabi, Highway Food',
      priceRange: '₹',
      specialties: ['Dal Makhani', 'Parathas', 'Lassi'],
      description: 'Roadside dhaba serving hearty Punjabi food, perfect for travelers.',
      coordinates: [23.5000, 85.0000]
    },
    {
      id: 5,
      name: 'Cafe Coffee Day',
      location: 'Ranchi (Multiple outlets)',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      images: [
        'https://images.unsplash.com/photo-1524704796725-9fc3044a58e9?w=800',
        'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
      ],
      rating: 4.0,
      reviews: 1234,
      cuisine: 'Cafe, Continental',
      priceRange: '₹₹',
      specialties: ['Coffee', 'Sandwiches', 'Pastries'],
      description: 'Popular coffee chain with comfortable seating and Wi-Fi.',
      coordinates: [23.3441, 85.3096]
    },
    {
      id: 6,
      name: 'Pind Balluchi',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
      images: [
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
        'https://images.unsplash.com/photo-1615485737657-ecb65fbbd37f?w=800',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
        'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800',
        'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800'
      ],
      rating: 4.5,
      reviews: 876,
      cuisine: 'Punjabi, North Indian',
      priceRange: '₹₹₹',
      specialties: ['Sarson da Saag', 'Kulcha', 'Punjabi Thali'],
      description: 'Themed restaurant with rustic Punjabi village ambiance and authentic food.',
      coordinates: [23.3441, 85.3096]
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setHotels(sampleHotels)
      setRestaurants(sampleRestaurants)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredHotels = hotels.filter(hotel => {
    if (filters.rating > 0 && hotel.rating < filters.rating) return false
    if (filters.location !== 'all' && hotel.location !== filters.location) return false
    if (filters.priceRange !== 'all') {
      const price = hotel.price
      if (filters.priceRange === 'budget' && price > 2000) return false
      if (filters.priceRange === 'mid' && (price < 2000 || price > 4000)) return false
      if (filters.priceRange === 'luxury' && price < 4000) return false
    }
    return true
  })

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (filters.rating > 0 && restaurant.rating < filters.rating) return false
    if (filters.location !== 'all' && restaurant.location !== filters.location) return false
    return true
  })

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
              Hotels & Restaurants
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the best places to stay and dine during your Jharkhand journey. 
              From luxury hotels to authentic local eateries.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2">
            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'hotels'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🏨 Hotels ({hotels.length})
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'restaurants'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🍽️ Restaurants ({restaurants.length})
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Locations</option>
                  <option value="Ranchi">Ranchi</option>
                  <option value="Betla National Park">Betla National Park</option>
                  <option value="Netarhat">Netarhat</option>
                  <option value="Deoghar">Deoghar</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0, 0].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={(e) => setFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                        className="h-4 w-4 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {rating === 0 ? 'Any Rating' : `${rating}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter (for hotels) */}
              {activeTab === 'hotels' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: 'budget', label: 'Budget (Under ₹2,000)' },
                      { value: 'mid', label: 'Mid-range (₹2,000-₹4,000)' },
                      { value: 'luxury', label: 'Luxury (Above ₹4,000)' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          value={option.value}
                          checked={filters.priceRange === option.value}
                          onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                          className="h-4 w-4 text-primary-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Filters
                </label>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                    🏨 Near Tourist Places
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                    🍽️ Local Cuisine
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                    ⭐ Highly Rated
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'hotels' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Hotels ({filteredHotels.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'restaurants' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Restaurants ({filteredRestaurants.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            )}

            {((activeTab === 'hotels' && filteredHotels.length === 0) || 
              (activeTab === 'restaurants' && filteredRestaurants.length === 0)) && (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more options.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
