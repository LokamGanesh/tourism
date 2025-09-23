'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building, TrendingUp, Users, MapPin, Car, Star, 
  Calendar, DollarSign, LogOut, BarChart3, PieChart,
  Download, Filter, RefreshCw, Activity, Target, Globe
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface TourismStats {
  totalTourists: number
  totalTravelGuides: number
  totalTravels: number
  totalVehicles: number
  totalRevenue: number
  averageRating: number
  monthlyGrowth: number
  // New provider statistics
  totalTravelProviders: number
  totalHotelProviders: number
  totalRestaurantProviders: number
  totalBookings: number
  averageBookingValue: number
  popularDestinations: { name: string; visits: number }[]
  monthlyVisitors: { month: string; visitors: number }[]
  revenueByCategory: { category: string; revenue: number }[]
  // New analytics
  providerDistribution: { type: string; count: number }[]
  bookingTrends: { month: string; bookings: number }[]
  customerSatisfaction: { rating: number; percentage: number }[]
  regionalStats: { region: string; tourists: number; revenue: number }[]
}

export default function GovernmentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<TourismStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('last-12-months')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/auth')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'government') {
      router.push('/auth')
      return
    }

    setUser(parsedUser)
    fetchTourismStats()
  }, [router, dateRange, selectedRegion])

  const fetchTourismStats = async () => {
    try {
      // Mock data for demonstration
      const mockStats: TourismStats = {
        totalTourists: 45678,
        totalTravelGuides: 234,
        totalTravels: 156,
        totalVehicles: 89,
        totalRevenue: 12500000,
        averageRating: 4.3,
        monthlyGrowth: 15.2,
        // New provider statistics
        totalTravelProviders: 45,
        totalHotelProviders: 78,
        totalRestaurantProviders: 92,
        totalBookings: 3456,
        averageBookingValue: 8500,
        popularDestinations: [
          { name: 'Betla National Park', visits: 8945 },
          { name: 'Hundru Falls', visits: 7234 },
          { name: 'Deoghar Temple', visits: 6789 },
          { name: 'Hazaribagh Wildlife Sanctuary', visits: 5432 },
          { name: 'Dassam Falls', visits: 4321 }
        ],
        monthlyVisitors: [
          { month: 'Jan', visitors: 3200 },
          { month: 'Feb', visitors: 3800 },
          { month: 'Mar', visitors: 4200 },
          { month: 'Apr', visitors: 4800 },
          { month: 'May', visitors: 5200 },
          { month: 'Jun', visitors: 4600 },
          { month: 'Jul', visitors: 3900 },
          { month: 'Aug', visitors: 4100 },
          { month: 'Sep', visitors: 4500 },
          { month: 'Oct', visitors: 5100 },
          { month: 'Nov', visitors: 4700 },
          { month: 'Dec', visitors: 4300 }
        ],
        revenueByCategory: [
          { category: 'Adventure Tours', revenue: 4200000 },
          { category: 'Cultural Tours', revenue: 3100000 },
          { category: 'Wildlife Tours', revenue: 2800000 },
          { category: 'Religious Tours', revenue: 2400000 }
        ],
        // New analytics data
        providerDistribution: [
          { type: 'Travel Providers', count: 45 },
          { type: 'Hotel Providers', count: 78 },
          { type: 'Restaurant Providers', count: 92 },
          { type: 'Travel Guides', count: 234 }
        ],
        bookingTrends: [
          { month: 'Jan', bookings: 245 },
          { month: 'Feb', bookings: 289 },
          { month: 'Mar', bookings: 334 },
          { month: 'Apr', bookings: 378 },
          { month: 'May', bookings: 412 },
          { month: 'Jun', bookings: 356 },
          { month: 'Jul', bookings: 298 },
          { month: 'Aug', bookings: 321 },
          { month: 'Sep', bookings: 367 },
          { month: 'Oct', bookings: 398 },
          { month: 'Nov', bookings: 345 },
          { month: 'Dec', bookings: 313 }
        ],
        customerSatisfaction: [
          { rating: 5, percentage: 45 },
          { rating: 4, percentage: 35 },
          { rating: 3, percentage: 15 },
          { rating: 2, percentage: 3 },
          { rating: 1, percentage: 2 }
        ],
        regionalStats: [
          { region: 'Ranchi', tourists: 15234, revenue: 4200000 },
          { region: 'Jamshedpur', tourists: 12456, revenue: 3100000 },
          { region: 'Dhanbad', tourists: 9876, revenue: 2800000 },
          { region: 'Bokaro', tourists: 8234, revenue: 2400000 }
        ]
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching tourism stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const exportData = (type: string) => {
    // This would generate and download reports
    console.log(`Exporting ${type} data...`)
    alert(`${type} report will be downloaded shortly.`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading government dashboard...</p>
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
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">Government Portal</span>
                </div>
              </Link>
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">Tourism Analytics</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="text-xs text-gray-500">({user?.position})</span>
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
            Tourism Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into Jharkhand's tourism industry
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
                <option value="last-12-months">Last 12 Months</option>
                <option value="custom">Custom Range</option>
              </select>
              
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Regions</option>
                <option value="ranchi">Ranchi</option>
                <option value="dhanbad">Dhanbad</option>
                <option value="jamshedpur">Jamshedpur</option>
                <option value="bokaro">Bokaro</option>
                <option value="deoghar">Deoghar</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchTourismStats()}
                className="flex items-center space-x-2 px-3 py-1 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm">Refresh</span>
              </button>
              
              <button
                onClick={() => exportData('comprehensive')}
                className="flex items-center space-x-2 bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tourists</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats?.totalTourists || 0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{stats?.monthlyGrowth}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tourism Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12.3%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Travel Guides</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats?.totalTravelGuides || 0)}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">{stats?.totalTravels} active tours</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.averageRating}/5.0</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                  <span className="text-sm text-gray-500">Customer satisfaction</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Visitors Area Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Monthly Visitors</h3>
              </div>
              <button
                onClick={() => exportData('monthly-visitors')}
                className="text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats?.monthlyVisitors}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `${(value/1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [formatNumber(value), 'Visitors']}
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVisitors)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Destinations Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Popular Destinations</h3>
              </div>
              <button
                onClick={() => exportData('destinations')}
                className="text-gray-500 hover:text-green-600 transition-colors p-2 hover:bg-green-50 rounded-lg"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.popularDestinations} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `${(value/1000).toFixed(1)}k`}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [formatNumber(value), 'Visits']}
                />
                <Bar 
                  dataKey="visits" 
                  fill="#10B981"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Booking Trends Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Booking Trends</h3>
              </div>
              <button
                onClick={() => exportData('booking-trends')}
                className="text-gray-500 hover:text-purple-600 transition-colors p-2 hover:bg-purple-50 rounded-lg"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [formatNumber(value), 'Bookings']}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Provider Distribution Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                  <PieChart className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Provider Distribution</h3>
              </div>
              <button
                onClick={() => exportData('provider-distribution')}
                className="text-gray-500 hover:text-orange-600 transition-colors p-2 hover:bg-orange-50 rounded-lg"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={stats?.providerDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats?.providerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [formatNumber(value), 'Count']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue by Category Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Revenue by Category</h3>
              </div>
              <button
                onClick={() => exportData('revenue-category')}
                className="text-gray-500 hover:text-yellow-600 transition-colors p-2 hover:bg-yellow-50 rounded-lg"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `₹${(value/1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-lg">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Customer Satisfaction</h3>
              </div>
            </div>
            
            <div className="space-y-4">
              {stats?.customerSatisfaction.map((rating, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm font-medium text-gray-700">{rating.rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12">{rating.percentage}%</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Overall Rating: {stats?.averageRating}/5.0</span>
              </div>
              <p className="text-xs text-green-600 mt-1">80% customers rated 4+ stars</p>
            </div>
          </div>
        </div>

        {/* Regional Analytics */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Regional Performance</h3>
            </div>
            <button
              onClick={() => exportData('regional-stats')}
              className="text-gray-500 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats?.regionalStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="region"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `₹${(value/1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: string) => [
                  name === 'tourists' ? formatNumber(value) : formatCurrency(value),
                  name === 'tourists' ? 'Tourists' : 'Revenue'
                ]}
              />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="tourists" 
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                name="tourists"
              />
              <Bar 
                yAxisId="right"
                dataKey="revenue" 
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
                name="revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Insights Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Service Providers</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Travel Providers</span>
                <span className="text-lg font-bold text-blue-600">{stats?.totalTravelProviders}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Hotel Providers</span>
                <span className="text-lg font-bold text-green-600">{stats?.totalHotelProviders}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Restaurant Providers</span>
                <span className="text-lg font-bold text-yellow-600">{stats?.totalRestaurantProviders}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Travel Guides</span>
                <span className="text-lg font-bold text-purple-600">{stats?.totalTravelGuides}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Growth Metrics</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Growth</span>
                  <span className="text-lg font-bold text-green-600">+{stats?.monthlyGrowth}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(stats?.monthlyGrowth || 0, 100)}%` }}></div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Revenue Growth</span>
                  <span className="text-lg font-bold text-blue-600">+12.3%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">New Registrations</span>
                  <span className="text-lg font-bold text-purple-600">+8.7%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => exportData('full-report')}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-200"
              >
                📊 Generate Full Report
              </button>
              <button
                onClick={() => exportData('monthly-summary')}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 rounded-xl transition-all duration-200 border border-gray-200 hover:border-green-200"
              >
                📈 Monthly Summary
              </button>
              <button
                onClick={() => exportData('performance-metrics')}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 rounded-xl transition-all duration-200 border border-gray-200 hover:border-purple-200"
              >
                🎯 Performance Metrics
              </button>
              <button
                onClick={() => exportData('regional-analysis')}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-yellow-700 rounded-xl transition-all duration-200 border border-gray-200 hover:border-yellow-200"
              >
                🗺️ Regional Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
