'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { ArrowLeft, Calendar, Users, Clock, MapPin, Star, Utensils, CheckCircle, AlertCircle } from 'lucide-react'

// Mock restaurant data - in real app, this would come from API
const restaurants = [
  {
    id: 1,
    name: "Spice Garden Restaurant",
    location: "Ranchi",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3",
    rating: 4.3,
    reviews: 245,
    cuisine: "Indian, Chinese",
    priceRange: "₹₹",
    specialties: ["Biryani", "Tandoor", "Chinese"],
    description: "Authentic Indian and Chinese cuisine in a cozy atmosphere.",
    coordinates: [23.3441, 85.3096] as [number, number]
  },
  {
    id: 2,
    name: "Royal Dining",
    location: "Ranchi",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3",
    rating: 4.5,
    reviews: 189,
    cuisine: "Multi-cuisine",
    priceRange: "₹₹₹",
    specialties: ["Continental", "Indian", "Italian"],
    description: "Fine dining experience with multi-cuisine options.",
    coordinates: [23.3441, 85.3096] as [number, number]
  }
]

export default function BookRestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = parseInt(params.id as string)
  const restaurant = restaurants.find(r => r.id === restaurantId)

  const [currentStep, setCurrentStep] = useState(1) // 1: Details, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState('')

  const [formData, setFormData] = useState({
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 2,
    tableType: 'regular',
    contactDetails: {
      name: '',
      email: '',
      mobile: ''
    },
    specialRequests: ''
  })

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ]

  const tableTypes = [
    { value: 'regular', label: 'Regular Table', charge: 0 },
    { value: 'window', label: 'Window Table', charge: 100 },
    { value: 'private', label: 'Private Dining', charge: 500 },
    { value: 'outdoor', label: 'Outdoor Seating', charge: 50 }
  ]

  const calculateTotalAmount = () => {
    const tableTypeData = tableTypes.find(tt => tt.value === formData.tableType)
    return tableTypeData?.charge || 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('contactDetails.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contactDetails: {
          ...prev.contactDetails,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'numberOfGuests' ? parseInt(value) : value
      }))
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const totalAmount = calculateTotalAmount()
      
      const response = await fetch('/api/restaurant-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurant?.id.toString(),
          restaurantName: restaurant?.name,
          reservationDate: formData.reservationDate,
          reservationTime: formData.reservationTime,
          numberOfGuests: formData.numberOfGuests,
          tableType: formData.tableType,
          contactDetails: formData.contactDetails,
          specialRequests: formData.specialRequests,
          totalAmount
        })
      })

      const data = await response.json()

      if (data.success) {
        setBookingId(data.bookingId)
        if (totalAmount > 0) {
          setCurrentStep(2) // Move to payment step
        } else {
          setCurrentStep(3) // Skip payment for free reservations
        }
      } else {
        setError(data.error || 'Reservation failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setCurrentStep(3) // Move to confirmation step
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Not Found</h1>
            <button
              onClick={() => router.push('/hotels')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
            >
              Back to Restaurants
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/hotels')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Restaurants
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-6">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-600">{restaurant.location}</span>
                  <div className="flex items-center ml-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600 ml-1">{restaurant.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({restaurant.reviews} reviews)</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">{restaurant.cuisine} • {restaurant.priceRange}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Reservation Details</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservation Details</h2>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Date</label>
                    <input
                      type="date"
                      name="reservationDate"
                      value={formData.reservationDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Time</label>
                    <select
                      name="reservationTime"
                      value={formData.reservationTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Guests and Table Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <select
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Table Type</label>
                    <select
                      name="tableType"
                      value={formData.tableType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {tableTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} {type.charge > 0 ? `(+₹${type.charge})` : '(Free)'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="contactDetails.name"
                        value={formData.contactDetails.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="contactDetails.email"
                        value={formData.contactDetails.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="contactDetails.mobile"
                      value={formData.contactDetails.mobile}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Any dietary restrictions, special occasions, or other requests..."
                  />
                </div>

                {/* Total Amount */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Reservation Charge:</span>
                    <span className="text-2xl text-orange-600">
                      {calculateTotalAmount() > 0 ? `₹${calculateTotalAmount().toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.reservationDate || !formData.reservationTime}
                  className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Utensils className="h-5 w-5 mr-2" />
                      {calculateTotalAmount() > 0 ? 'Continue to Payment' : 'Confirm Reservation'}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
              
              <div className="space-y-6">
                {/* Reservation Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Restaurant:</span>
                      <span className="font-medium">{restaurant.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{formData.reservationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{formData.reservationTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span>{formData.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Table Type:</span>
                      <span>{tableTypes.find(t => t.value === formData.tableType)?.label}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-4">
                      <span className="font-semibold">Reservation Charge:</span>
                      <span className="font-bold text-lg text-orange-600">₹{calculateTotalAmount().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Form Placeholder */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">Payment Processing</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <p className="text-sm text-gray-600 mb-4">Stripe payment integration will be available here.</p>
                      <p className="text-sm text-gray-600 mb-4">Booking ID: <span className="font-mono">{bookingId}</span></p>
                      <button
                        onClick={handlePaymentSuccess}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Simulate Payment Success
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Reservation Details
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h2>
                <p className="text-gray-600">Your table reservation has been successfully confirmed.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono font-medium">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Restaurant:</span>
                    <span className="font-medium">{restaurant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guest Name:</span>
                    <span>{formData.contactDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>{formData.reservationDate} at {formData.reservationTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{formData.numberOfGuests}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-4">
                    <span className="font-semibold">Amount Paid:</span>
                    <span className="font-bold text-lg text-green-600">
                      {calculateTotalAmount() > 0 ? `₹${calculateTotalAmount().toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to {formData.contactDetails.email}
                </p>
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={() => router.push('/hotels')}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Book Another Table
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
