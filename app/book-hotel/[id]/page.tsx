'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { ArrowLeft, Calendar, Users, Bed, CreditCard, MapPin, Star, CheckCircle, AlertCircle } from 'lucide-react'

// Mock hotel data - in real app, this would come from API
const hotels = [
  {
    id: 1,
    name: "Radisson Blu Hotel Ranchi",
    location: "Ranchi",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3",
    rating: 4.5,
    reviews: 856,
    price: 4500,
    amenities: ["Wi-Fi", "Parking", "Restaurant", "Gym", "Pool"],
    description: "Luxury hotel in the heart of Ranchi with modern amenities.",
    coordinates: [23.3441, 85.3096] as [number, number]
  },
  {
    id: 2,
    name: "Hotel Yuvraj Palace",
    location: "Ranchi",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3",
    rating: 4.2,
    reviews: 432,
    price: 3200,
    amenities: ["Wi-Fi", "Parking", "Restaurant"],
    description: "Comfortable mid-range hotel with good facilities and central location.",
    coordinates: [23.3441, 85.3096] as [number, number]
  }
]

export default function BookHotelPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = parseInt(params.id as string)
  const hotel = hotels.find(h => h.id === hotelId)

  const [currentStep, setCurrentStep] = useState(1) // 1: Details, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState('')

  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    numberOfRooms: 1,
    roomType: 'standard',
    contactDetails: {
      name: '',
      email: '',
      mobile: ''
    },
    specialRequests: ''
  })

  const roomTypes = [
    { value: 'standard', label: 'Standard Room', price: hotel?.price || 3000 },
    { value: 'deluxe', label: 'Deluxe Room', price: (hotel?.price || 3000) * 1.3 },
    { value: 'suite', label: 'Suite', price: (hotel?.price || 3000) * 1.8 },
    { value: 'premium', label: 'Premium Room', price: (hotel?.price || 3000) * 2.2 }
  ]

  const calculateTotalAmount = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0
    
    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    const roomTypeData = roomTypes.find(rt => rt.value === formData.roomType)
    const pricePerNight = roomTypeData?.price || hotel?.price || 3000
    
    return nights * pricePerNight * formData.numberOfRooms
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
        [name]: name === 'numberOfGuests' || name === 'numberOfRooms' ? parseInt(value) : value
      }))
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const totalAmount = calculateTotalAmount()
      
      const response = await fetch('/api/hotel-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId: hotel?.id.toString(),
          hotelName: hotel?.name,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          numberOfGuests: formData.numberOfGuests,
          numberOfRooms: formData.numberOfRooms,
          roomType: formData.roomType,
          contactDetails: formData.contactDetails,
          specialRequests: formData.specialRequests,
          totalAmount
        })
      })

      const data = await response.json()

      if (data.success) {
        setBookingId(data.bookingId)
        setCurrentStep(2) // Move to payment step
      } else {
        setError(data.error || 'Booking failed')
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

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h1>
            <button
              onClick={() => router.push('/hotels')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              Back to Hotels
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
            Back to Hotels
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-6">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-600">{hotel.location}</span>
                  <div className="flex items-center ml-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600 ml-1">{hotel.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({hotel.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Booking Details</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Guests and Rooms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                    <select
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                    <select
                      name="numberOfRooms"
                      value={formData.numberOfRooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {[1,2,3,4].map(num => (
                        <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {roomTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} - ₹{type.price.toLocaleString()}/night
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                {/* Total Amount */}
                {formData.checkInDate && formData.checkOutDate && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-2xl text-primary-600">₹{calculateTotalAmount().toLocaleString()}</span>
                    </div>
                  </div>
                )}

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
                  disabled={loading || !formData.checkInDate || !formData.checkOutDate}
                  className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Continue to Payment
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
                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Hotel:</span>
                      <span className="font-medium">{hotel.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span>{formData.checkInDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span>{formData.checkOutDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span>{formData.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rooms:</span>
                      <span>{formData.numberOfRooms}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-4">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-bold text-lg text-primary-600">₹{calculateTotalAmount().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Form Placeholder */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Payment Processing</h3>
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
                  Back to Booking Details
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600">Your hotel booking has been successfully confirmed.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono font-medium">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotel:</span>
                    <span className="font-medium">{hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guest Name:</span>
                    <span>{formData.contactDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{formData.checkInDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{formData.checkOutDate}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-4">
                    <span className="font-semibold">Total Paid:</span>
                    <span className="font-bold text-lg text-green-600">₹{calculateTotalAmount().toLocaleString()}</span>
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
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Book Another Hotel
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
