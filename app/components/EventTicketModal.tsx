'use client'

import { useState } from 'react'
import { X, Calendar, MapPin, Users, Ticket, CreditCard } from 'lucide-react'
import PaymentForm from './PaymentForm'

interface Event {
  id: number
  name: string
  description: string
  location: string
  date: string
  time: string
  duration: string
  ticketPrice: string
  organizer: string
  expectedAttendees: number
  rating: number
}

interface EventTicketModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

interface TicketForm {
  numberOfTickets: number
  attendeeDetails: {
    name: string
    email: string
    mobile: string
  }
  specialRequests: string
}

export default function EventTicketModal({ event, isOpen, onClose }: EventTicketModalProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [ticketForm, setTicketForm] = useState<TicketForm>({
    numberOfTickets: 1,
    attendeeDetails: {
      name: '',
      email: '',
      mobile: ''
    },
    specialRequests: ''
  })

  if (!isOpen) return null

  const getTicketPrice = () => {
    if (event.ticketPrice === 'Free') return 0
    const priceMatch = event.ticketPrice.match(/₹(\d+)/)
    return priceMatch ? parseInt(priceMatch[1]) : 0
  }

  const calculateTotalCost = () => {
    return getTicketPrice() * ticketForm.numberOfTickets
  }

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (getTicketPrice() === 0) {
      // Free event - direct booking
      handleFreeEventBooking()
    } else {
      // Paid event - proceed to payment
      setShowPaymentForm(true)
    }
  }

  const handleFreeEventBooking = async () => {
    try {
      const bookingData = {
        eventId: event.id,
        ...ticketForm,
        totalAmount: 0,
        paymentStatus: 'completed'
      }

      // Here you would typically call an API to save the booking
      alert(`Free event booking confirmed! You will receive a confirmation email shortly.`)
      onClose()
    } catch (error) {
      console.error('Error booking free event:', error)
      alert('Error booking event. Please try again.')
    }
  }

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      const bookingData = {
        eventId: event.id,
        ...ticketForm,
        totalAmount: calculateTotalCost(),
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'completed'
      }

      // Here you would typically call an API to save the booking
      alert(`Payment successful! Your event tickets have been booked. You will receive a confirmation email shortly.`)
      setShowPaymentForm(false)
      onClose()
    } catch (error) {
      console.error('Error completing event booking:', error)
      alert('Error completing booking. Please try again.')
    }
  }

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[10000] modal-overlay modal">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showPaymentForm ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Book Event Tickets</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Event Details */}
            <div className="p-6 border-b bg-gray-50">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{event.expectedAttendees.toLocaleString()} expected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ticket className="h-4 w-4" />
                  <span className="font-semibold text-green-600">{event.ticketPrice}</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleTicketSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <select
                  value={ticketForm.numberOfTickets}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, numberOfTickets: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Ticket' : 'Tickets'}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={ticketForm.attendeeDetails.name}
                    onChange={(e) => setTicketForm(prev => ({
                      ...prev,
                      attendeeDetails: { ...prev.attendeeDetails, name: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={ticketForm.attendeeDetails.email}
                    onChange={(e) => setTicketForm(prev => ({
                      ...prev,
                      attendeeDetails: { ...prev.attendeeDetails, email: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={ticketForm.attendeeDetails.mobile}
                    onChange={(e) => setTicketForm(prev => ({
                      ...prev,
                      attendeeDetails: { ...prev.attendeeDetails, mobile: e.target.value }
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
                  value={ticketForm.specialRequests}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, specialRequests: e.target.value }))}
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
                    <span>Event: {event.name}</span>
                    <span>{ticketForm.numberOfTickets} tickets</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date: {formatDate(event.date)}</span>
                    <span>Time: {event.time}</span>
                  </div>
                  {getTicketPrice() > 0 && (
                    <div className="flex justify-between">
                      <span>Price per ticket:</span>
                      <span>₹{getTicketPrice().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      {getTicketPrice() === 0 ? 'Free' : `₹${calculateTotalCost().toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {getTicketPrice() === 0 ? (
                    <>
                      <Ticket className="h-4 w-4" />
                      <span>Book Free Tickets</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Payment Form */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Complete Payment</h3>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Event Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Event: {event.name}</span>
                    <span className="font-medium">{ticketForm.numberOfTickets} tickets</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date: {formatDate(event.date)}</span>
                    <span className="font-medium">{event.time}</span>
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
                  type: 'event',
                  id: event.id,
                  ...ticketForm,
                  eventId: event.id
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
