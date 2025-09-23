'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, Calendar, Users, Filter, Search, LogOut, User } from 'lucide-react'

interface Travel {
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

export default function TouristDashboard() {
  const [user, setUser] = useState<any>(null)
  const [travels, setTravels] = useState<Travel[]>([])
  const [filteredTravels, setFilteredTravels] = useState<Travel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/auth')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'tourist') {
      router.push('/auth')
      return
    }

    setUser(parsedUser)
    fetchVerifiedTravels()
  }, [router])

  const fetchVerifiedTravels = async () => {
    try {
      // For now, we'll use mock data since the API endpoints aren't created yet
      const mockTravels: Travel[] = [
        {
          _id: '1',
          title: 'Jharkhand Wildlife Adventure',
          description: 'Explore the rich wildlife of Jharkhand including Betla National Park and Hazaribagh Wildlife Sanctuary.',
          destinations: ['Betla National Park', 'Hazaribagh Wildlife Sanctuary'],
          duration: 5,
          maxGroupSize: 12,
          price: 15000,
          images: [
            'https://source.unsplash.com/featured/400x300/?Jharkhand%20tourism',
            'https://source.unsplash.com/featured/400x300/?Jharkhand%20landscape',
            'https://source.unsplash.com/featured/400x300/?Jharkhand%20culture'
          ],
          difficulty: 'moderate',
          category: ['Wildlife', 'Adventure'],
          rating: 4.5,
          totalReviews: 23,
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
          title: 'Cultural Heritage Tour',
          description: 'Discover the rich cultural heritage of Jharkhand with visits to ancient temples and tribal villages.',
          destinations: ['Deoghar', 'Rajrappa', 'Tribal Villages'],
          duration: 4,
          maxGroupSize: 15,
          price: 12000,
          images: [
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
            'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400'
          ],
          difficulty: 'easy',
          category: ['Cultural', 'Heritage'],
          rating: 4.3,
          totalReviews: 18,
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
          title: 'Waterfall Trekking Expedition',
          description: 'Trek through the beautiful waterfalls of Jharkhand including Hundru Falls and Dassam Falls.',
          destinations: ['Hundru Falls', 'Dassam Falls', 'Jonha Falls'],
          duration: 3,
          maxGroupSize: 10,
          price: 8000,
          images: [
            'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400'
          ],
          difficulty: 'challenging',
          category: ['Adventure', 'Trekking'],
          rating: 4.8,
          totalReviews: 31,
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
        }
      ]
      
      setTravels(mockTravels)
      setFilteredTravels(mockTravels)
    } catch (error) {
      console.error('Error fetching travels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">Jharkhand Tourism</span>
                </div>
              </Link>
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">Tourist Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Discover amazing verified travel experiences in Jharkhand
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Travels</h2>
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
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Heritage">Heritage</option>
                <option value="Trekking">Trekking</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

        {/* Travel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTravels.map((travel) => (
            <div key={travel._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={travel.images[0]}
                  alt={travel.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {travel.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(travel.difficulty)}`}>
                    {travel.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {travel.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{travel.destinations.join(', ')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{travel.duration} days</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Max {travel.maxGroupSize} people</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{travel.rating}</span>
                    <span className="text-sm text-gray-500">({travel.totalReviews} reviews)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">₹{travel.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">per person</div>
                  </div>
                </div>
                
                {/* Transport Options */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Available Transport:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(travel.transport).map(([type, details]) => (
                      details.available > 0 && (
                        <span key={type} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {type}: {details.available}
                        </span>
                      )
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{travel.travelGuideId.name}</div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500">{travel.travelGuideId.rating} • {travel.travelGuideId.experience} years exp</span>
                      </div>
                    </div>
                    <Link 
                      href={`/travel/${travel._id}`}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTravels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No travels found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}
