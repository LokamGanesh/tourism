'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPin, Clock, Users, Star, Calendar, Car, Bus, 
  ArrowLeft, CheckCircle, CreditCard, Phone, Mail, User, X
} from 'lucide-react'
import PaymentForm from '@/app/components/PaymentForm'

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
    cars: { available: number; pricePerDay: number; capacity: number; features: string[] }
    buses: { available: number; pricePerDay: number; capacity: number; features: string[] }
    vans: { available: number; pricePerDay: number; capacity: number; features: string[] }
    suvs: { available: number; pricePerDay: number; capacity: number; features: string[] }
  }
  images: string[]
  rating: number
  totalReviews: number
  inclusions: string[]
  exclusions: string[]
  itinerary: {
    day: number
    title: string
    description: string
    activities: string[]
    meals: string[]
    accommodation: string
  }[]
}

interface BookingForm {
  numberOfPeople: number
  travelDate: string
  transportType: 'car' | 'bus' | 'van' | 'suv' | ''
  contactDetails: {
    name: string
    email: string
    mobile: string
  }
  specialRequests: string
}

export default function TravelDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [travel, setTravel] = useState<Travel | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedTransport, setSelectedTransport] = useState<'car' | 'bus' | 'van' | 'suv' | ''>('')
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    numberOfPeople: 1,
    travelDate: '',
    transportType: '',
    contactDetails: {
      name: '',
      email: '',
      mobile: ''
    },
    specialRequests: ''
  })

  useEffect(() => {
    fetchTravelDetails()
  }, [params.id])

  const fetchTravelDetails = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockTravel: Travel = {
        _id: params.id as string,
        title: 'Jharkhand Wildlife Adventure',
        description: 'Explore the rich wildlife and natural beauty of Jharkhand with this comprehensive adventure tour. Experience the thrill of spotting tigers, elephants, and diverse bird species in their natural habitat.',
        destinations: ['Betla National Park', 'Palamau Tiger Reserve', 'Hazaribagh Wildlife Sanctuary'],
        duration: 5,
        price: 15000,
        difficulty: 'moderate',
        category: ['Wildlife', 'Adventure', 'Nature'],
        isVerified: true,
        transport: {
          cars: { 
            available: 3, 
            pricePerDay: 2000, 
            capacity: 4,
            features: ['AC', 'GPS Navigation', 'First Aid Kit', 'Experienced Driver']
          },
          buses: { 
            available: 2, 
            pricePerDay: 5000, 
            capacity: 40,
            features: ['AC', 'Reclining Seats', 'Entertainment System', 'Washroom']
          },
          vans: { 
            available: 4, 
            pricePerDay: 3000, 
            capacity: 8,
            features: ['AC', 'Comfortable Seating', 'Storage Space', 'Music System']
          },
          suvs: { 
            available: 2, 
            pricePerDay: 3500, 
            capacity: 7,
            features: ['4WD', 'AC', 'High Ground Clearance', 'Safety Equipment']
          }
        },
        images: [
          'https://source.unsplash.com/featured/800x600/?Jharkhand%20wildlife',
          'https://source.unsplash.com/featured/800x600/?Betla%20National%20Park',
          'https://source.unsplash.com/featured/800x600/?Palamau%20Tiger%20Reserve',
          'https://source.unsplash.com/featured/800x600/?Hazaribagh%20wildlife',
          'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800'
        ],
        rating: 4.5,
        totalReviews: 128,
        inclusions: [
          'Accommodation in forest lodges',
          'All meals (breakfast, lunch, dinner)',
          'Professional wildlife guide',
          'Safari permits and entry fees',
          'Transportation as per itinerary',
          'First aid and emergency support'
        ],
        exclusions: [
          'Personal expenses',
          'Travel insurance',
          'Tips and gratuities',
          'Alcoholic beverages',
          'Camera fees (if applicable)'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival at Betla National Park',
            description: 'Check-in at forest lodge and evening safari',
            activities: ['Check-in', 'Evening Safari', 'Wildlife Spotting'],
            meals: ['Lunch', 'Dinner'],
            accommodation: 'Forest Lodge'
          },
          {
            day: 2,
            title: 'Full Day Safari at Betla',
            description: 'Morning and evening safari with rest during afternoon',
            activities: ['Morning Safari', 'Bird Watching', 'Evening Safari'],
            meals: ['Breakfast', 'Lunch', 'Dinner'],
            accommodation: 'Forest Lodge'
          },
          {
            day: 3,
            title: 'Transfer to Palamau Tiger Reserve',
            description: 'Travel to Palamau and afternoon exploration',
            activities: ['Travel', 'Tiger Tracking', 'Nature Walk'],
            meals: ['Breakfast', 'Lunch', 'Dinner'],
            accommodation: 'Tiger Reserve Lodge'
          },
          {
            day: 4,
            title: 'Palamau Tiger Reserve Safari',
            description: 'Full day dedicated to tiger spotting and wildlife photography',
            activities: ['Tiger Safari', 'Photography', 'Wildlife Documentation'],
            meals: ['Breakfast', 'Lunch', 'Dinner'],
            accommodation: 'Tiger Reserve Lodge'
          },
          {
            day: 5,
            title: 'Departure',
            description: 'Morning safari and departure',
            activities: ['Final Safari', 'Check-out', 'Departure'],
            meals: ['Breakfast'],
            accommodation: 'N/A'
          }
        ]
      }
      
      setTravel(mockTravel)
    } catch (error) {
      console.error('Error fetching travel details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTransportSelect = (type: 'car' | 'bus' | 'van' | 'suv') => {
    setSelectedTransport(type)
    setBookingForm(prev => ({ ...prev, transportType: type }))
    setShowBookingForm(true)
  }

  const calculateTotalCost = () => {
    if (!travel || !selectedTransport) return 0
    const transportCost = travel.transport[selectedTransport].pricePerDay * travel.duration
    const travelCost = travel.price * bookingForm.numberOfPeople
    return transportCost + travelCost
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Proceed to payment instead of direct booking
    setShowPaymentForm(true)
  }

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      const bookingData = {
        travelId: travel?._id,
        ...bookingForm,
        totalAmount: calculateTotalCost(),
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'completed'
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        },
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Payment successful! Your booking ID is: ${result.bookingId}. You will receive a confirmation email shortly.`)
        setShowBookingForm(false)
        setShowPaymentForm(false)
        setSelectedTransport('')
        setBookingForm({
          numberOfPeople: 1,
          travelDate: '',
          transportType: '',
          contactDetails: { name: '', email: '', mobile: '' },
          specialRequests: ''
        })
        
        // Update local travel data to reflect reduced availability
        if (travel) {
          setTravel(prev => prev ? {
            ...prev,
            transport: {
              ...prev.transport,
              [selectedTransport]: {
                ...prev.transport[selectedTransport],
                available: prev.transport[selectedTransport].available - 1
              }
            }
          } : null)
        }
      } else {
        alert(`Error: ${result.error || 'Failed to complete booking'}`)
      }
    } catch (error) {
      console.error('Error completing booking:', error)
      alert('Error completing booking. Please try again.')
    }
  }

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'challenging': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'bus': return Bus
      case 'car': return Car
      case 'van': return Car
      case 'suv': return Car
      default: return Car
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading travel details...</p>
        </div>
      </div>
    )
  }

  if (!travel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Travel not found</p>
          <Link href="/dashboard/admin" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{travel.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{travel.destinations.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{travel.duration} days</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{travel.rating} ({travel.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={travel.images[0]}
                  alt={travel.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 p-4">
                {travel.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${travel.title} ${index + 2}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Trip</h2>
              <p className="text-gray-600 mb-4">{travel.description}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(travel.difficulty)}`}>
                  {travel.difficulty}
                </span>
                {travel.category.map((cat, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Inclusions</h3>
                  <ul className="space-y-2">
                    {travel.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Exclusions</h3>
                  <ul className="space-y-2">
                    {travel.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="h-4 w-4 border border-red-300 rounded-full mt-0.5 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Itinerary</h2>
              <div className="space-y-6">
                {travel.itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-primary-500 text-white text-sm font-medium px-2 py-1 rounded">
                        Day {day.day}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">{day.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{day.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Activities:</span>
                        <ul className="text-gray-600 mt-1">
                          {day.activities.map((activity, i) => (
                            <li key={i}>• {activity}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Meals:</span>
                        <ul className="text-gray-600 mt-1">
                          {day.meals.map((meal, i) => (
                            <li key={i}>• {meal}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Stay:</span>
                        <p className="text-gray-600 mt-1">{day.accommodation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">₹{travel.price.toLocaleString()}</div>
                <div className="text-sm text-gray-500">per person</div>
              </div>
            </div>

            {/* Transport Options */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Transport</h3>
              <div className="space-y-4">
                {Object.entries(travel.transport).map(([type, details]) => {
                  if (details.available === 0) return null
                  const Icon = getTransportIcon(type)
                  return (
                    <div
                      key={type}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTransport === type
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleTransportSelect(type as 'car' | 'bus' | 'van' | 'suv')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium text-gray-900 capitalize">{type}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{details.pricePerDay}/day</div>
                          <div className="text-sm text-gray-500">{details.capacity} seats</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="text-green-600 font-medium">{details.available} available</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {details.features.map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Book Your Trip</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People
                  </label>
                  <select
                    value={bookingForm.numberOfPeople}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, numberOfPeople: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.travelDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, travelDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={bookingForm.contactDetails.name}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      contactDetails: { ...prev.contactDetails, name: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={bookingForm.contactDetails.email}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      contactDetails: { ...prev.contactDetails, email: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={bookingForm.contactDetails.mobile}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      contactDetails: { ...prev.contactDetails, mobile: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={bookingForm.specialRequests}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any special requirements or requests..."
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Trip Cost ({bookingForm.numberOfPeople} × ₹{travel.price.toLocaleString()})</span>
                    <span>₹{(travel.price * bookingForm.numberOfPeople).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport ({selectedTransport} for {travel.duration} days)</span>
                    <span>₹{(travel.transport[selectedTransport].pricePerDay * travel.duration).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{calculateTotalCost().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Proceed to Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Complete Payment</h3>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Trip: {travel?.title}</span>
                  <span className="font-medium">{bookingForm.numberOfPeople} people</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport: {selectedTransport}</span>
                  <span className="font-medium">{travel?.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel Date:</span>
                  <span className="font-medium">{bookingForm.travelDate}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-green-600">₹{calculateTotalCost().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <PaymentForm
              amount={calculateTotalCost()}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              bookingData={{
                type: 'travel',
                id: travel?._id,
                ...bookingForm,
                travelId: travel?._id,
                transportType: selectedTransport
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
