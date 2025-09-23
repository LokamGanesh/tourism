'use client'

import { useState } from 'react'
import { X, Calendar, Users, Bed, CreditCard, MapPin, Star } from 'lucide-react'

interface Hotel {
  id: number
  name: string
  location: string
  image: string
  rating: number
  reviews: number
  price: number
  amenities: string[]
  description: string
  coordinates: [number, number]
}

interface HotelBookingModalProps {
  hotel: Hotel
  isOpen: boolean
  onClose: () => void
}

export default function HotelBookingModal({ hotel, isOpen, onClose }: HotelBookingModalProps) {
  console.log('HotelBookingModal rendered, isOpen:', isOpen)
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [bookingId, setBookingId] = useState('')

  const roomTypes = [
    { value: 'standard', label: 'Standard Room', price: hotel.price },
    { value: 'deluxe', label: 'Deluxe Room', price: hotel.price * 1.3 },
    { value: 'suite', label: 'Suite', price: hotel.price * 1.8 },
    { value: 'premium', label: 'Premium Room', price: hotel.price * 2.2 }
  ]

  const calculateTotalAmount = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0
    
    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    const roomTypePrice = roomTypes.find(rt => rt.value === formData.roomType)?.price || hotel.price
    return nights * roomTypePrice * formData.numberOfRooms
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

  const handlePaymentSuccess = (paymentIntent: any) => {
    setSuccess(`Payment successful! Your hotel booking is confirmed. Booking ID: ${bookingId}`)
    setShowPayment(false)
    // Reset form
    setFormData({
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      numberOfRooms: 1,
      roomType: 'standard',
      contactDetails: { name: '', email: '', mobile: '' },
      specialRequests: ''
    })
  }

  const handlePaymentError = (error: string) => {
    setError(`Payment failed: ${error}`)
    setShowPayment(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const totalAmount = calculateTotalAmount()
      
      const response = await fetch('/api/hotel-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId: hotel.id.toString(),
          hotelName: hotel.name,
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
        setShowPayment(true)
      } else {
        setError(data.error || 'Booking failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4 modal-overlay modal">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Hotel Room</h2>
            <div className="flex items-center mt-2">
              <h3 className="text-lg font-semibold text-gray-700">{hotel.name}</h3>
              <div className="flex items-center ml-3">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-600 ml-1">{hotel.rating}</span>
              </div>
            </div>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{hotel.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Check-in Date
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Check-out Date
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Guests and Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Guests
              </label>
              <select
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bed className="h-4 w-4 inline mr-1" />
                Rooms
              </label>
              <select
                name="numberOfRooms"
                value={formData.numberOfRooms}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[1, 2, 3, 4].map(num => (
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
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} (₹{type.price.toLocaleString()}/night)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Contact Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="contactDetails.name"
                  value={formData.contactDetails.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input
                type="tel"
                name="contactDetails.mobile"
                value={formData.contactDetails.mobile}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any special requirements or requests..."
            />
          </div>

          {/* Total Amount */}
          {formData.checkInDate && formData.checkOutDate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ₹{calculateTotalAmount().toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {Math.ceil((new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights × {formData.numberOfRooms} room(s)
              </p>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Submit Button or Payment Form */}
          {!showPayment ? (
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.checkInDate || !formData.checkOutDate}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Continue to Payment
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Payment Processing</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">₹{calculateTotalAmount().toLocaleString()}</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-600 mb-4">Stripe payment integration will be available here.</p>
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
                type="button"
                onClick={() => setShowPayment(false)}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Booking Details
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
