'use client'

import { useState, useEffect } from 'react'
import { Star, MapPin, Calendar, Users, Eye, Heart, Shield, Clock, Car, Bus, Filter, Search, Plus, UserPlus, Truck, Activity, FileText, BarChart3, Phone } from 'lucide-react'
import Navbar from '../components/Navbar'
import Link from 'next/link'

interface VerifiedTravel {
  _id: string
  title: string
  description: string
  destinations: string[]
  duration: number
  maxGroupSize: number
  price: number
  images: string[]
  difficulty: 'easy' | 'moderate' | 'challenging'
  category: string[]
  rating: number
  totalReviews: number
  isVerified: boolean
  transport: {
    cars: { available: number; pricePerDay: number; capacity: number }
    buses: { available: number; pricePerDay: number; capacity: number }
    vans: { available: number; pricePerDay: number; capacity: number }
    suvs: { available: number; pricePerDay: number; capacity: number }
  }
  travelGuideId: {
    name: string
    rating: number
    experience: number
  }
}

interface MyTravel {
  _id: string
  title: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  destination: string
  totalCost: number
  participants: number
  transport: string
}

interface Vehicle {
  _id: string
  type: 'car' | 'bus' | 'van' | 'suv'
  model: string
  registrationNumber: string
  capacity: number
  status: 'available' | 'in-use' | 'maintenance'
  pricePerDay: number
  features: string[]
}

interface Driver {
  _id: string
  name: string
  licenseNumber: string
  experience: number
  rating: number
  phoneNumber: string
  status: 'available' | 'assigned' | 'off-duty'
  vehicleTypes: string[]
}

export default function VerifiedTravelsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [travels, setTravels] = useState<VerifiedTravel[]>([])
  const [filteredTravels, setFilteredTravels] = useState<VerifiedTravel[]>([])
  const [myTravels, setMyTravels] = useState<MyTravel[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 })
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalType, setModalType] = useState<'travel' | 'vehicle' | 'driver'>('travel')

  useEffect(() => {
    fetchVerifiedTravels()
  }, [])

  const fetchVerifiedTravels = async () => {
    try {
      // Mock data for verified travels
      const mockTravels: VerifiedTravel[] = [
        {
          _id: '1',
          title: 'Jharkhand Wildlife Adventure',
          description: 'Explore the rich wildlife and natural beauty of Jharkhand with this comprehensive adventure tour. Experience the thrill of spotting tigers, elephants, and diverse bird species in their natural habitat.',
          destinations: ['Betla National Park', 'Palamau Tiger Reserve', 'Hazaribagh Wildlife Sanctuary'],
          duration: 5,
          maxGroupSize: 12,
          price: 15000,
          images: [
            'https://source.unsplash.com/featured/800x600/?Jharkhand%20travel',
            'https://source.unsplash.com/featured/800x600/?tour%20jeep%20India',
            'https://source.unsplash.com/featured/800x600/?forest%20safari'
          ],
          difficulty: 'moderate',
          category: ['Wildlife', 'Adventure', 'Nature'],
          rating: 4.5,
          totalReviews: 128,
          isVerified: true,
          transport: {
            cars: { available: 3, pricePerDay: 2000, capacity: 4 },
            buses: { available: 2, pricePerDay: 5000, capacity: 40 },
            vans: { available: 4, pricePerDay: 3000, capacity: 8 },
            suvs: { available: 2, pricePerDay: 3500, capacity: 7 }
          },
          travelGuideId: {
            name: 'Rajesh Kumar',
            rating: 4.7,
            experience: 8
          }
        },
        {
          _id: '2',
          title: 'Jharkhand Cultural Heritage Tour',
          description: 'Discover the rich cultural heritage and tribal traditions of Jharkhand. Visit ancient temples, traditional villages, and experience local customs.',
          destinations: ['Ranchi', 'Khunti', 'Saraikela', 'Deoghar'],
          duration: 4,
          maxGroupSize: 15,
          price: 12000,
          images: [
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
            'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'
          ],
          difficulty: 'easy',
          category: ['Cultural', 'Heritage', 'Traditional'],
          rating: 4.3,
          totalReviews: 95,
          isVerified: true,
          transport: {
            cars: { available: 2, pricePerDay: 1800, capacity: 4 },
            buses: { available: 1, pricePerDay: 4500, capacity: 40 },
            vans: { available: 3, pricePerDay: 2800, capacity: 8 },
            suvs: { available: 1, pricePerDay: 3200, capacity: 7 }
          },
          travelGuideId: {
            name: 'Priya Sharma',
            rating: 4.6,
            experience: 6
          }
        },
        {
          _id: '3',
          title: 'Jharkhand Waterfall Trek',
          description: 'Trek through beautiful waterfalls and scenic landscapes. Perfect for adventure enthusiasts who love nature and photography.',
          destinations: ['Hundru Falls', 'Dassam Falls', 'Jonha Falls'],
          duration: 3,
          maxGroupSize: 10,
          price: 8000,
          images: [
            'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800'
          ],
          difficulty: 'challenging',
          category: ['Adventure', 'Trekking', 'Photography'],
          rating: 4.8,
          totalReviews: 156,
          isVerified: true,
          transport: {
            cars: { available: 1, pricePerDay: 2200, capacity: 4 },
            buses: { available: 0, pricePerDay: 0, capacity: 40 },
            vans: { available: 2, pricePerDay: 3200, capacity: 8 },
            suvs: { available: 3, pricePerDay: 3800, capacity: 7 }
          },
          travelGuideId: {
            name: 'Amit Singh',
            rating: 4.9,
            experience: 10
          }
        },
        {
          _id: '4',
          title: 'Jharkhand Spiritual Journey',
          description: 'Experience the spiritual side of Jharkhand with visits to famous temples and religious sites. Perfect for those seeking peace and spirituality.',
          destinations: ['Baidyanath Dham', 'Rajrappa Temple', 'Parasnath Hill'],
          duration: 3,
          maxGroupSize: 20,
          price: 9000,
          images: [
            'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
            'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800'
          ],
          difficulty: 'easy',
          category: ['Spiritual', 'Religious', 'Cultural'],
          rating: 4.4,
          totalReviews: 87,
          isVerified: true,
          transport: {
            cars: { available: 4, pricePerDay: 1900, capacity: 4 },
            buses: { available: 3, pricePerDay: 4200, capacity: 40 },
            vans: { available: 5, pricePerDay: 2700, capacity: 8 },
            suvs: { available: 2, pricePerDay: 3100, capacity: 7 }
          },
          travelGuideId: {
            name: 'Sunita Devi',
            rating: 4.5,
            experience: 7
          }
        }
      ]

      setTravels(mockTravels)
      setFilteredTravels(mockTravels)

      // Mock data for My Travels
      const mockMyTravels: MyTravel[] = [
        {
          _id: '1',
          title: 'Jharkhand Wildlife Adventure',
          status: 'upcoming',
          startDate: '2024-12-15',
          endDate: '2024-12-20',
          destination: 'Betla National Park',
          totalCost: 18000,
          participants: 4,
          transport: 'SUV'
        },
        {
          _id: '2',
          title: 'Cultural Heritage Tour',
          status: 'completed',
          startDate: '2024-10-10',
          endDate: '2024-10-14',
          destination: 'Ranchi, Khunti',
          totalCost: 15000,
          participants: 6,
          transport: 'Van'
        }
      ]
      setMyTravels(mockMyTravels)

      // Mock data for Vehicles
      const mockVehicles: Vehicle[] = [
        {
          _id: '1',
          type: 'suv',
          model: 'Toyota Fortuner',
          registrationNumber: 'JH01AB1234',
          capacity: 7,
          status: 'available',
          pricePerDay: 3500,
          features: ['AC', '4WD', 'GPS', 'First Aid Kit']
        },
        {
          _id: '2',
          type: 'van',
          model: 'Mahindra Bolero',
          registrationNumber: 'JH02CD5678',
          capacity: 8,
          status: 'in-use',
          pricePerDay: 3000,
          features: ['AC', 'Comfortable Seating', 'Storage Space']
        },
        {
          _id: '3',
          type: 'car',
          model: 'Maruti Swift Dzire',
          registrationNumber: 'JH03EF9012',
          capacity: 4,
          status: 'available',
          pricePerDay: 2000,
          features: ['AC', 'GPS', 'Music System']
        }
      ]
      setVehicles(mockVehicles)

      // Mock data for Drivers
      const mockDrivers: Driver[] = [
        {
          _id: '1',
          name: 'Ramesh Kumar',
          licenseNumber: 'JH0120240001',
          experience: 8,
          rating: 4.7,
          phoneNumber: '+91 9876543210',
          status: 'available',
          vehicleTypes: ['car', 'suv', 'van']
        },
        {
          _id: '2',
          name: 'Suresh Singh',
          licenseNumber: 'JH0220240002',
          experience: 12,
          rating: 4.9,
          phoneNumber: '+91 9876543211',
          status: 'assigned',
          vehicleTypes: ['bus', 'van', 'suv']
        },
        {
          _id: '3',
          name: 'Prakash Mahto',
          licenseNumber: 'JH0320240003',
          experience: 5,
          rating: 4.5,
          phoneNumber: '+91 9876543212',
          status: 'available',
          vehicleTypes: ['car', 'van']
        }
      ]
      setDrivers(mockDrivers)

    } catch (error) {
      console.error('Error fetching travels:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = travels

    if (searchTerm) {
      filtered = filtered.filter(travel =>
        travel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.destinations.some(dest => dest.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(travel =>
        travel.category.includes(selectedCategory)
      )
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(travel =>
        travel.difficulty === selectedDifficulty
      )
    }

    filtered = filtered.filter(travel =>
      travel.price >= priceRange.min && travel.price <= priceRange.max
    )

    setFilteredTravels(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedCategory, selectedDifficulty, priceRange, travels])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'challenging': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ))
  }

  const allCategories = Array.from(new Set(travels.flatMap(travel => travel.category)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'available': return 'bg-green-100 text-green-800'
      case 'in-use': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-red-100 text-red-800'
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'off-duty': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddNew = (type: 'travel' | 'vehicle' | 'driver') => {
    setModalType(type)
    setShowAddModal(true)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'my-travels', label: 'My Travels', icon: MapPin },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'drivers', label: 'Drivers', icon: Users }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading verified travels...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Travel Management Dashboard</h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Manage your travels, vehicles, and drivers all in one place. Track bookings, monitor fleet status, and organize your travel operations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleAddNew('travel')}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">Add New Travel</span>
              <span className="text-sm text-gray-500 mt-1">Create a new travel package</span>
            </button>

            <button
              onClick={() => handleAddNew('vehicle')}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-medium text-gray-900">Add Vehicle</span>
              <span className="text-sm text-gray-500 mt-1">Register a new vehicle</span>
            </button>

            <button
              onClick={() => handleAddNew('driver')}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
              <span className="font-medium text-gray-900">Add Driver</span>
              <span className="text-sm text-gray-500 mt-1">Register a new driver</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Travels</p>
                    <p className="text-2xl font-semibold text-gray-900">{travels.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Car className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Vehicles</p>
                    <p className="text-2xl font-semibold text-gray-900">{vehicles.filter(v => v.status === 'available').length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Drivers</p>
                    <p className="text-2xl font-semibold text-gray-900">{drivers.filter(d => d.status === 'available').length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Activity className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">{myTravels.filter(t => t.status === 'upcoming' || t.status === 'ongoing').length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {myTravels.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  myTravels.slice(0, 3).map((travel) => (
                    <div key={travel._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{travel.title}</p>
                          <p className="text-sm text-gray-600">{travel.destination}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(travel.status)}`}>
                        {travel.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Filters Section for Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Filter Travel Packages</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search travels..."
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {allCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range (₹{priceRange.min} - ₹{priceRange.max})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Travel Packages Grid */}
            {filteredTravels.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No travel packages found</h3>
                <p className="text-gray-600">Try adjusting your search filters to see more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredTravels.map((travel) => (
                  <div key={travel._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                    {/* Travel Header with Image */}
                    <div className="relative">
                      <div className="h-48 relative overflow-hidden">
                        <img
                          src={travel.images[0]}
                          alt={travel.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                        {/* Verified Badge */}
                        <div className="absolute top-4 left-4 bg-green-600 text-white rounded-full px-3 py-1 flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span className="text-xs font-semibold">Verified</span>
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold text-gray-900">{travel.rating.toFixed(1)}</span>
                        </div>

                        {/* Price Badge */}
                        <div className="absolute bottom-4 left-4 bg-blue-600 text-white rounded-lg px-3 py-2">
                          <div className="text-lg font-bold">₹{travel.price.toLocaleString()}</div>
                          <div className="text-xs opacity-90">per person</div>
                        </div>

                        {/* Difficulty Badge */}
                        <div className="absolute bottom-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(travel.difficulty)}`}>
                            {travel.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Travel Info */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{travel.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{travel.description}</p>

                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{travel.destinations.join(', ')}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{travel.duration} days</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Max {travel.maxGroupSize} people</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 mb-3">
                          {renderStars(travel.rating)}
                          <span className="text-sm text-gray-600 ml-1">({travel.totalReviews} reviews)</span>
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {travel.category.map((cat, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Transport Options */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Available Transport:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(travel.transport).map(([type, details]) => (
                            details.available > 0 && (
                              <span key={type} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 flex items-center space-x-1">
                                {type === 'buses' ? <Bus className="h-3 w-3" /> : <Car className="h-3 w-3" />}
                                <span>{type}: {details.available}</span>
                              </span>
                            )
                          ))}
                        </div>
                      </div>

                      {/* Guide Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Travel Guide:</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{travel.travelGuideId.name}</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{travel.travelGuideId.rating} • {travel.travelGuideId.experience} years exp</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                            <Heart className="h-4 w-4 mr-1" />
                            <span>Save</span>
                          </button>
                          <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>View Details</span>
                          </button>
                        </div>
                        <Link
                          href={`/travel/${travel._id}`}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Travels Tab */}
        {activeTab === 'my-travels' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Travel Bookings</h3>
              <div className="space-y-4">
                {myTravels.map((travel) => (
                  <div key={travel._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{travel.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{travel.destination}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>📅 {travel.startDate} to {travel.endDate}</span>
                          <span>👥 {travel.participants} people</span>
                          <span>🚗 {travel.transport}</span>
                          <span>💰 ₹{travel.totalCost.toLocaleString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(travel.status)}`}>
                        {travel.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Fleet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Car className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">{vehicle.model}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Registration:</strong> {vehicle.registrationNumber}</p>
                      <p><strong>Capacity:</strong> {vehicle.capacity} people</p>
                      <p><strong>Price:</strong> ₹{vehicle.pricePerDay}/day</p>
                      <div>
                        <strong>Features:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {vehicle.features.map((feature, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Network</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map((driver) => (
                  <div key={driver._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-gray-900">{driver.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                        {driver.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>License:</strong> {driver.licenseNumber}</p>
                      <p><strong>Experience:</strong> {driver.experience} years</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span><strong>Rating:</strong> {driver.rating}</span>
                      </div>
                      <p className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{driver.phoneNumber}</span>
                      </p>
                      <div>
                        <strong>Vehicle Types:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {driver.vehicleTypes.map((type, index) => (
                            <span key={index} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New {modalType === 'travel' ? 'Travel Package' : modalType === 'vehicle' ? 'Vehicle' : 'Driver'}
              </h3>
              <p className="text-gray-600 mb-4">
                This feature will be available soon. You&apos;ll be able to add new {modalType}s directly from this interface.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
