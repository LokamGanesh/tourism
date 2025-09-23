'use client'

import { useState } from 'react'
import HotelBookingModal from '../components/HotelBookingModal'
import RestaurantBookingModal from '../components/RestaurantBookingModal'

const testHotel = {
  id: 1,
  name: "Test Hotel",
  location: "Ranchi",
  image: "/test.jpg",
  rating: 4.5,
  reviews: 100,
  price: 3000,
  amenities: ["Wi-Fi", "Parking"],
  description: "Test hotel",
  coordinates: [23.3441, 85.3096] as [number, number]
}

const testRestaurant = {
  id: 1,
  name: "Test Restaurant",
  location: "Ranchi",
  image: "/test.jpg",
  rating: 4.2,
  reviews: 50,
  cuisine: "Indian",
  priceRange: "₹₹",
  specialties: ["Biryani", "Curry"],
  description: "Test restaurant",
  coordinates: [23.3441, 85.3096] as [number, number]
}

export default function TestModals() {
  const [hotelModalOpen, setHotelModalOpen] = useState(false)
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Booking Modals</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => setHotelModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Test Hotel Booking Modal
          </button>
          
          <button
            onClick={() => setRestaurantModalOpen(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 ml-4"
          >
            Test Restaurant Booking Modal
          </button>
        </div>

        <HotelBookingModal
          hotel={testHotel}
          isOpen={hotelModalOpen}
          onClose={() => setHotelModalOpen(false)}
        />

        <RestaurantBookingModal
          restaurant={testRestaurant}
          isOpen={restaurantModalOpen}
          onClose={() => setRestaurantModalOpen(false)}
        />
      </div>
    </div>
  )
}
