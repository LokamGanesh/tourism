'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPin, Plus, Car, Users, FileText, CheckCircle, XCircle, 
  Clock, Star, LogOut, User, Upload, Edit, Trash2, Eye, Bell
} from 'lucide-react'
import ChatBot from '../../components/ChatBot'

interface Travel {
  _id: string
  title: string
  description: string
  destinations: string[]
  duration: number
  price: number
  isVerified: boolean
  isActive: boolean
  rating: number
  totalReviews: number
}

interface Vehicle {
  _id: string
  type: string
  make: string
  model: string
  registrationNumber: string
  capacity: number
  isVerified: boolean
  isActive: boolean
  pricePerDay: number
}

interface Driver {
  _id: string
  name: string
  licenseNumber: string
  phoneNumber: string
  experience: number
  isVerified: boolean
  isActive: boolean
  rating: number
}

export default function TravelGuideDashboard() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [travels, setTravels] = useState<Travel[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalType, setModalType] = useState<'travel' | 'vehicle' | 'driver'>('travel')
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/auth')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'travel_guide') {
      router.push('/auth')
      return
    }

    setUser(parsedUser)
    fetchDashboardData()
    fetchNotifications(parsedUser._id)
  }, [router])

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as Element
        if (!target.closest('.notification-dropdown')) {
          setShowNotifications(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const fetchDashboardData = async () => {
    try {
      // Mock data for now
      const mockTravels: Travel[] = [
        {
          _id: '1',
          title: 'Jharkhand Wildlife Adventure',
          description: 'Explore the rich wildlife of Jharkhand',
          destinations: ['Betla National Park', 'Hazaribagh Wildlife Sanctuary'],
          duration: 5,
          price: 15000,
          isVerified: true,
          isActive: true,
          rating: 4.5,
          totalReviews: 23
        },
        {
          _id: '2',
          title: 'Cultural Heritage Tour',
          description: 'Discover the rich cultural heritage',
          destinations: ['Deoghar', 'Rajrappa'],
          duration: 4,
          price: 12000,
          isVerified: false,
          isActive: true,
          rating: 0,
          totalReviews: 0
        }
      ]

      const mockVehicles: Vehicle[] = [
        {
          _id: '1',
          type: 'bus',
          make: 'Tata',
          model: 'Starbus',
          registrationNumber: 'JH01AB1234',
          capacity: 35,
          isVerified: true,
          isActive: true,
          pricePerDay: 5000
        },
        {
          _id: '2',
          type: 'car',
          make: 'Mahindra',
          model: 'Scorpio',
          registrationNumber: 'JH02CD5678',
          capacity: 7,
          isVerified: false,
          isActive: true,
          pricePerDay: 2500
        }
      ]

      const mockDrivers: Driver[] = [
        {
          _id: '1',
          name: 'Ram Kumar',
          licenseNumber: 'JH0120230001',
          phoneNumber: '+91 9876543210',
          experience: 8,
          isVerified: true,
          isActive: true,
          rating: 4.7
        },
        {
          _id: '2',
          name: 'Suresh Singh',
          licenseNumber: 'JH0220230002',
          phoneNumber: '+91 9876543211',
          experience: 5,
          isVerified: false,
          isActive: true,
          rating: 0
        }
      ]

      setTravels(mockTravels)
      setVehicles(mockVehicles)
      setDrivers(mockDrivers)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async (userId: string) => {
    try {
      // Mock notifications data
      const mockNotifications = [
        {
          _id: '1',
          userId: userId,
          type: 'booking',
          title: 'New Booking Request',
          message: 'You have received a new booking request for Jharkhand Wildlife Adventure',
          isRead: false,
          createdAt: '2024-01-20T10:30:00Z',
          data: {
            bookingId: 'booking123',
            customerName: 'Raj Kumar'
          }
        },
        {
          _id: '2',
          userId: userId,
          type: 'verification',
          title: 'Travel Package Approved',
          message: 'Your travel package "Cultural Heritage Tour" has been approved by admin',
          isRead: false,
          createdAt: '2024-01-19T15:45:00Z',
          data: {
            travelId: 'travel456'
          }
        },
        {
          _id: '3',
          userId: userId,
          type: 'review',
          title: 'New Review Received',
          message: 'You received a 5-star review from Priya Sharma',
          isRead: true,
          createdAt: '2024-01-18T09:15:00Z',
          data: {
            rating: 5,
            reviewId: 'review789'
          }
        }
      ]
      
      setNotifications(mockNotifications.filter(n => !n.isRead))
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const openAddModal = (type: 'travel' | 'vehicle' | 'driver') => {
    setModalType(type)
    setShowAddModal(true)
  }

  const getStatusBadge = (isVerified: boolean, isActive: boolean) => {
    if (!isActive) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>
    }
    if (isVerified) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Verified</span>
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
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
                <span className="text-sm text-gray-500">Travel Guide Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                {user?.isVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              
              {/* Notification Icon */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification._id} className="p-4 border-b hover:bg-gray-50">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(notification.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
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
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your travel services and grow your business
          </p>
          {!user?.isVerified && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Account Verification Pending</h3>
                  <p className="text-sm text-yellow-700">Your account is under review. You can add content, but it won't be visible to tourists until verified.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Travels</p>
                <p className="text-2xl font-bold text-gray-900">{travels.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Car className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{user?.rating || '0.0'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'travels', label: 'My Travels', icon: MapPin },
                { id: 'vehicles', label: 'Vehicles', icon: Car },
                { id: 'drivers', label: 'Drivers', icon: Users }
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
            {activeTab === 'travels' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">My Travel Packages</h2>
                  <button
                    onClick={() => openAddModal('travel')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Travel</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {travels.map((travel) => (
                    <div key={travel._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{travel.title}</h3>
                            {getStatusBadge(travel.isVerified, travel.isActive)}
                          </div>
                          <p className="text-gray-600 mb-2">{travel.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{travel.duration} days</span>
                            <span>₹{travel.price.toLocaleString()}</span>
                            <span>{travel.destinations.join(', ')}</span>
                            {travel.isVerified && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span>{travel.rating} ({travel.totalReviews} reviews)</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">My Vehicles</h2>
                  <button
                    onClick={() => openAddModal('vehicle')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Vehicle</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-500">{vehicle.registrationNumber}</p>
                        </div>
                        {getStatusBadge(vehicle.isVerified, vehicle.isActive)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Type: {vehicle.type}</p>
                        <p>Capacity: {vehicle.capacity} passengers</p>
                        <p>Rate: ₹{vehicle.pricePerDay}/day</p>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'drivers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">My Drivers</h2>
                  <button
                    onClick={() => openAddModal('driver')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Driver</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drivers.map((driver) => (
                    <div key={driver._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{driver.name}</h3>
                          <p className="text-sm text-gray-500">{driver.licenseNumber}</p>
                        </div>
                        {getStatusBadge(driver.isVerified, driver.isActive)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Phone: {driver.phoneNumber}</p>
                        <p>Experience: {driver.experience} years</p>
                        {driver.isVerified && driver.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{driver.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => openAddModal('travel')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
                    >
                      <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Add New Travel</p>
                    </button>
                    <button
                      onClick={() => openAddModal('vehicle')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
                    >
                      <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Add Vehicle</p>
                    </button>
                    <button
                      onClick={() => openAddModal('driver')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
                    >
                      <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Add Driver</p>
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add New {modalType}</h3>
            <p className="text-gray-600 mb-4">
              This feature will be implemented with a detailed form for adding {modalType}s.
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
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <ChatBot />
    </div>
  )
}
