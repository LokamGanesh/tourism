'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield, CheckCircle, XCircle, Clock, FileText, Users, Car, 
  MapPin, Star, LogOut, User, Eye, Download, AlertTriangle
} from 'lucide-react'

interface PendingItem {
  _id: string
  type: 'travel_guide' | 'travel' | 'vehicle' | 'driver' | 'travel_provider' | 'hotel_provider' | 'restaurant_provider'
  title: string
  submittedBy: string
  submittedAt: Date
  status: 'pending' | 'approved' | 'rejected'
  priority: 'high' | 'medium' | 'low'
}

interface Travel {
  _id: string
  title: string
  description: string
  destinations: string[]
  duration: number
  price: number
  difficulty: 'easy' | 'moderate' | 'challenging'
  category: string[]
  isVerified: boolean
  transport: {
    cars: { available: number; pricePerDay: number; capacity: number }
    buses: { available: number; pricePerDay: number; capacity: number }
    vans: { available: number; pricePerDay: number; capacity: number }
    suvs: { available: number; pricePerDay: number; capacity: number }
  }
  submittedAt: Date
  travelGuideId: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([])
  const [travels, setTravels] = useState<Travel[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/auth')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push('/auth')
      return
    }

    setUser(parsedUser)
    fetchAdminData()
  }, [router])

  const fetchAdminData = async () => {
    try {
      // Mock data for demonstration
      const mockPendingItems: PendingItem[] = [
        {
          _id: '1',
          type: 'travel_guide',
          title: 'Rajesh Kumar - Travel Guide Verification',
          submittedBy: 'Rajesh Kumar',
          submittedAt: new Date('2024-01-15'),
          status: 'pending',
          priority: 'high'
        },
        {
          _id: '2',
          type: 'travel',
          title: 'Jharkhand Wildlife Adventure',
          submittedBy: 'Priya Sharma',
          submittedAt: new Date('2024-01-14'),
          status: 'pending',
          priority: 'medium'
        },
        {
          _id: '3',
          type: 'vehicle',
          title: 'Tata Starbus - JH01AB1234',
          submittedBy: 'Amit Singh',
          submittedAt: new Date('2024-01-13'),
          status: 'pending',
          priority: 'medium'
        },
        {
          _id: '4',
          type: 'driver',
          title: 'Ram Kumar - Driver Verification',
          submittedBy: 'Suresh Gupta',
          submittedAt: new Date('2024-01-12'),
          status: 'pending',
          priority: 'low'
        },
        {
          _id: '5',
          type: 'travel_provider',
          title: 'Jharkhand Adventures - Travel Agency',
          submittedBy: 'Vikash Kumar',
          submittedAt: new Date('2024-01-16'),
          status: 'pending',
          priority: 'high'
        },
        {
          _id: '6',
          type: 'hotel_provider',
          title: 'Green Valley Resort - Hotel Registration',
          submittedBy: 'Sunita Devi',
          submittedAt: new Date('2024-01-17'),
          status: 'pending',
          priority: 'medium'
        },
        {
          _id: '7',
          type: 'restaurant_provider',
          title: 'Tribal Flavors Restaurant - Registration',
          submittedBy: 'Manoj Singh',
          submittedAt: new Date('2024-01-18'),
          status: 'pending',
          priority: 'medium'
        }
      ]

      const mockTravels: Travel[] = [
        {
          _id: '1',
          title: 'Jharkhand Wildlife Adventure',
          description: 'Explore the rich wildlife and natural beauty of Jharkhand',
          destinations: ['Betla National Park', 'Palamau Tiger Reserve'],
          duration: 5,
          price: 15000,
          difficulty: 'moderate',
          category: ['Wildlife', 'Adventure'],
          isVerified: true,
          transport: {
            cars: { available: 3, pricePerDay: 2000, capacity: 4 },
            buses: { available: 2, pricePerDay: 5000, capacity: 40 },
            vans: { available: 4, pricePerDay: 3000, capacity: 8 },
            suvs: { available: 2, pricePerDay: 3500, capacity: 7 }
          },
          submittedAt: new Date('2024-01-15'),
          travelGuideId: 'guide1'
        },
        {
          _id: '2',
          title: 'Jharkhand Cultural Heritage Tour',
          description: 'Discover the rich cultural heritage and tribal traditions',
          destinations: ['Ranchi', 'Khunti', 'Saraikela'],
          duration: 4,
          price: 12000,
          difficulty: 'easy',
          category: ['Cultural', 'Heritage'],
          isVerified: true,
          transport: {
            cars: { available: 2, pricePerDay: 1800, capacity: 4 },
            buses: { available: 1, pricePerDay: 4500, capacity: 40 },
            vans: { available: 3, pricePerDay: 2800, capacity: 8 },
            suvs: { available: 1, pricePerDay: 3200, capacity: 7 }
          },
          submittedAt: new Date('2024-01-12'),
          travelGuideId: 'guide2'
        },
        {
          _id: '3',
          title: 'Jharkhand Waterfall Trek',
          description: 'Trek through beautiful waterfalls and scenic landscapes',
          destinations: ['Hundru Falls', 'Dassam Falls', 'Jonha Falls'],
          duration: 3,
          price: 8000,
          difficulty: 'challenging',
          category: ['Adventure', 'Trekking'],
          isVerified: false,
          transport: {
            cars: { available: 1, pricePerDay: 2200, capacity: 4 },
            buses: { available: 0, pricePerDay: 0, capacity: 40 },
            vans: { available: 2, pricePerDay: 3200, capacity: 8 },
            suvs: { available: 3, pricePerDay: 3800, capacity: 7 }
          },
          submittedAt: new Date('2024-01-10'),
          travelGuideId: 'guide3'
        }
      ]

      setPendingItems(mockPendingItems)
      setTravels(mockTravels)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleApprove = async (itemId: string, type: string) => {
    try {
      // API call would go here
      console.log(`Approving ${type} with ID: ${itemId}`)
      
      // Update local state
      setPendingItems(prev => 
        prev.map(item => 
          item._id === itemId ? { ...item, status: 'approved' as const } : item
        )
      )
      
      if (type === 'travel') {
        setTravels(prev =>
          prev.map(travel =>
            travel._id === itemId ? { ...travel, isVerified: true } : travel
          )
        )
      }
    } catch (error) {
      console.error('Error approving item:', error)
    }
  }

  const handleReject = async (itemId: string, type: string) => {
    try {
      // API call would go here
      console.log(`Rejecting ${type} with ID: ${itemId}`)
      
      // Update local state
      setPendingItems(prev => 
        prev.map(item => 
          item._id === itemId ? { ...item, status: 'rejected' as const } : item
        )
      )
    } catch (error) {
      console.error('Error rejecting item:', error)
    }
  }

  const openDetailsModal = (item: any) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'travel_guide': return Users
      case 'travel': return MapPin
      case 'vehicle': return Car
      case 'driver': return User
      case 'travel_provider': return MapPin
      case 'hotel_provider': return Shield
      case 'restaurant_provider': return Star
      default: return FileText
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                </div>
              </Link>
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">Tourism Department</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-gray-400" />
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and verify tourism services and providers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingItems.filter(item => item.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingItems.filter(item => item.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Travels</p>
                <p className="text-2xl font-bold text-gray-900">{travels.filter(t => t.isVerified).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingItems.filter(item => item.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Link 
            href="/dashboard/admin/manage"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <MapPin className="h-5 w-5" />
            <span>Manage Places, Hotels, Restaurants & Events</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Shield },
                { id: 'pending', label: 'Pending Reviews', icon: Clock },
                { id: 'travels', label: 'Verified Travels', icon: MapPin }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Pending Reviews</h2>
                  <div className="text-sm text-gray-500">
                    {pendingItems.filter(item => item.status === 'pending').length} items awaiting review
                  </div>
                </div>
                
                <div className="space-y-4">
                  {pendingItems.filter(item => item.status === 'pending').map((item) => {
                    const Icon = getTypeIcon(item.type)
                    return (
                      <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Icon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                              <div className="flex items-center space-x-3 text-sm text-gray-500">
                                <span>Submitted by {item.submittedBy}</span>
                                <span>•</span>
                                <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                  {item.priority} priority
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openDetailsModal(item)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(item._id, item.type)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(item._id, item.type)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'travels' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Verified Travels</h2>
                  <div className="text-sm text-gray-500">
                    {travels.filter(travel => travel.isVerified).length} verified travels
                  </div>
                </div>
                
                <div className="space-y-4">
                  {travels.filter(travel => travel.isVerified).map((travel) => (
                    <div key={travel._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                         onClick={() => router.push(`/travel/${travel._id}`)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <MapPin className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{travel.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{travel.description}</p>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <span>{travel.duration} days</span>
                              <span>•</span>
                              <span>₹{travel.price.toLocaleString()}</span>
                              <span>•</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                travel.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                travel.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {travel.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-sm text-gray-500">Transport Available:</span>
                              {travel.transport.cars.available > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Cars: {travel.transport.cars.available}
                                </span>
                              )}
                              {travel.transport.buses.available > 0 && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                  Buses: {travel.transport.buses.available}
                                </span>
                              )}
                              {travel.transport.vans.available > 0 && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                  Vans: {travel.transport.vans.available}
                                </span>
                              )}
                              {travel.transport.suvs.available > 0 && (
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                  SUVs: {travel.transport.suvs.available}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {getStatusBadge('approved')}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openDetailsModal(travel)
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {pendingItems.slice(0, 5).map((item) => {
                      const Icon = getTypeIcon(item.type)
                      return (
                        <div key={item._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">
                              {item.status === 'pending' ? 'Awaiting review' : `${item.status} on ${new Date(item.submittedAt).toLocaleDateString()}`}
                            </p>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Verification Status</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Verified Travels</span>
                          <span className="font-medium">{travels.filter(t => t.isVerified).length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pending Verification</span>
                          <span className="font-medium">{travels.filter(t => !t.isVerified).length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Priority Items</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>High Priority</span>
                          <span className="font-medium text-red-600">{pendingItems.filter(i => i.priority === 'high').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Medium Priority</span>
                          <span className="font-medium text-yellow-600">{pendingItems.filter(i => i.priority === 'medium').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[10000] modal-overlay modal">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Item Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="text-sm text-gray-900">{selectedItem.title}</p>
              </div>
              
              {selectedItem.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedItem.description}</p>
                </div>
              )}
              
              {selectedItem.destinations && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destinations</label>
                  <p className="text-sm text-gray-900">{selectedItem.destinations.join(', ')}</p>
                </div>
              )}
              
              {selectedItem.duration && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-sm text-gray-900">{selectedItem.duration} days</p>
                </div>
              )}
              
              {selectedItem.price && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="text-sm text-gray-900">₹{selectedItem.price.toLocaleString()}</p>
                </div>
              )}
              
              {selectedItem.transport && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Transport</label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedItem.transport).map(([type, details]: [string, any]) => (
                      details.available > 0 && (
                        <div key={type} className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 capitalize">{type}</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Available: {details.available}</p>
                            <p>Capacity: {details.capacity} people</p>
                            <p>Price: ₹{details.pricePerDay}/day</p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              {selectedItem.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedItem.email}</p>
                </div>
              )}
              
              {selectedItem.licenseNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <p className="text-sm text-gray-900">{selectedItem.licenseNumber}</p>
                </div>
              )}
              
              {selectedItem.certificates && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certificates</label>
                  <div className="space-y-2">
                    {selectedItem.certificates.map((cert: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{cert.name}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              {selectedItem.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedItem._id, selectedItem.type)
                      setShowModal(false)
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedItem._id, selectedItem.type)
                      setShowModal(false)
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
