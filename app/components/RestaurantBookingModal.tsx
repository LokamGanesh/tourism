'use client'

import { useState } from 'react'
import { X, Calendar, Users, Clock, MapPin, Star, Utensils } from 'lucide-react'

interface Restaurant {
  id: number
  name: string
  location: string
  image: string
  rating: number
  reviews: number
  cuisine: string
  priceRange: string
  specialties: string[]
  description: string
  coordinates: [number, number]
}

interface RestaurantBookingModalProps {
  restaurant: Restaurant
  isOpen: boolean
  onClose: () => void
}

export default function RestaurantBookingModal({ restaurant, isOpen, onClose }: RestaurantBookingModalProps) {
  console.log('RestaurantBookingModal rendered, isOpen:', isOpen)
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [bookingId, setBookingId] = useState('')

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
    const tableTypeCharge = tableTypes.find(tt => tt.value === formData.tableType)?.charge || 0
    return tableTypeCharge
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

  const handlePaymentSuccess = (paymentIntent: any) => {
    setSuccess(`Payment successful! Your table reservation is confirmed. Booking ID: ${bookingId}`)
    setShowPayment(false)
    // Reset form
    setFormData({
      reservationDate: '',
      reservationTime: '',
      numberOfGuests: 2,
      tableType: 'regular',
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
      
      const response = await fetch('/api/restaurant-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurant.id.toString(),
          restaurantName: restaurant.name,
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
        const totalAmount = calculateTotalAmount()
        if (totalAmount > 0) {
          setShowPayment(true)
        } else {
          setSuccess(`Reservation confirmed! Your booking ID is: ${data.bookingId}`)
          // Reset form for free reservations
          setFormData({
            reservationDate: '',
            reservationTime: '',
            numberOfGuests: 2,
            tableType: 'regular',
            contactDetails: { name: '', email: '', mobile: '' },
            specialRequests: ''
          })
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4 modal-overlay modal">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Make Reservation</h2>
            <div className="flex items-center mt-2">
              <h3 className="text-lg font-semibold text-gray-700">{restaurant.name}</h3>
              <div className="flex items-center ml-3">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-600 ml-1">{restaurant.rating}</span>
              </div>
            </div>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{restaurant.location}</span>
              <Utensils className="h-4 w-4 ml-3 mr-1" />
              <span className="text-sm">{restaurant.cuisine}</span>
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
          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Reservation Date
              </label>
              <input
                type="date"
                name="reservationDate"
                value={formData.reservationDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Reservation Time
              </label>
              <select
                name="reservationTime"
                value={formData.reservationTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Guests and Table Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Number of Guests
              </label>
              <select
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Table Preference</label>
              <select
                name="tableType"
                value={formData.tableType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {tableTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} {type.charge > 0 && `(+₹${type.charge})`}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Dietary restrictions, celebration details, seating preferences..."
            />
          </div>

          {/* Specialties Display */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Restaurant Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {restaurant.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          {calculateTotalAmount() > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Reservation Charge:</span>
                <span className="text-2xl font-bold text-orange-600">
                  ₹{calculateTotalAmount().toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                This amount will be adjusted against your final bill
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
                disabled={loading || !formData.reservationDate || !formData.reservationTime}
                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Utensils className="h-5 w-5 mr-2" />
                    {calculateTotalAmount() > 0 ? 'Continue to Payment' : 'Reserve Table'}
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-4">Payment Processing</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Reservation Charge:</span>
                    <span className="text-2xl font-bold text-orange-600">₹{calculateTotalAmount().toLocaleString()}</span>
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
                Back to Reservation Details
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
