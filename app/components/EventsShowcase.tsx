'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, MapPin, Clock, Users, Ticket, Star, ExternalLink, Filter } from 'lucide-react'
import EventTicketModal from './EventTicketModal'

interface Event {
  id: number
  name: string
  description: string
  image: string
  images: string[]
  location: string
  coordinates: [number, number]
  date: string
  time: string
  duration: string
  category: string
  ticketPrice: string
  organizer: string
  expectedAttendees: number
  rating: number
  highlights: string[]
}

export default function EventsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showTicketModal, setShowTicketModal] = useState(false)

  const events: Event[] = [
    {
      id: 1,
      name: 'Sarhul Festival',
      description: 'Traditional spring festival celebrating nature and new beginnings, featuring tribal dances and rituals.',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', // Festival
      images: [
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', // Cultural celebration
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', // Traditional dance
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'  // Spring rituals
      ],
      location: 'Ranchi, Various Villages',
      coordinates: [23.3441, 85.3096],
      date: '2024-04-15',
      time: '6:00 AM',
      duration: '3 days',
      category: 'Cultural',
      ticketPrice: 'Free',
      organizer: 'Jharkhand Tourism Board',
      expectedAttendees: 50000,
      rating: 4.8,
      highlights: ['Traditional Dances', 'Tribal Music', 'Local Cuisine', 'Cultural Performances']
    },
    {
      id: 2,
      name: 'Karma Festival',
      description: 'Harvest festival with folk songs, dances, and traditional rituals celebrating agricultural prosperity.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', // Cultural event
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', // Traditional dance
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', // Harvest celebration
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'  // Folk music
      ],
      location: 'Jamshedpur Cultural Center',
      coordinates: [22.8046, 86.2029],
      date: '2024-09-20',
      time: '7:00 PM',
      duration: '2 days',
      category: 'Cultural',
      ticketPrice: '₹100 - ₹500',
      organizer: 'Cultural Heritage Society',
      expectedAttendees: 25000,
      rating: 4.6,
      highlights: ['Folk Dances', 'Traditional Music', 'Art Exhibitions', 'Food Festival']
    },
    {
      id: 3,
      name: 'Jharkhand Adventure Sports Meet',
      description: 'Annual adventure sports competition featuring rock climbing, trekking, and water sports.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', // Adventure
      images: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', // Rock climbing
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', // Nature adventure
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop'  // Outdoor sports
      ],
      location: 'Netarhat Hills',
      coordinates: [23.4667, 84.2667],
      date: '2024-11-10',
      time: '8:00 AM',
      duration: '5 days',
      category: 'Adventure',
      ticketPrice: '₹500 - ₹2000',
      organizer: 'Adventure Sports Federation',
      expectedAttendees: 5000,
      rating: 4.7,
      highlights: ['Rock Climbing', 'Paragliding', 'Trekking', 'Photography Contest']
    },
    {
      id: 4,
      name: 'Tribal Art & Handicrafts Fair',
      description: 'Exhibition and sale of authentic tribal handicrafts, paintings, and traditional artifacts.',
      image: 'https://source.unsplash.com/featured/400x300/?handicrafts%20fair%20India',
      images: [
        'https://source.unsplash.com/featured/400x300/?art%20exhibition%20India',
        'https://source.unsplash.com/featured/400x300/?craft%20demonstration',
        'https://source.unsplash.com/featured/400x300/?tribal%20artifacts'
      ],
      location: 'Dumka Exhibition Ground',
      coordinates: [24.2676, 87.2497],
      date: '2024-12-05',
      time: '10:00 AM',
      duration: '7 days',
      category: 'Art & Craft',
      ticketPrice: '₹50',
      organizer: 'Tribal Welfare Department',
      expectedAttendees: 15000,
      rating: 4.5,
      highlights: ['Dokra Art', 'Bamboo Crafts', 'Tribal Paintings', 'Live Demonstrations']
    },
    {
      id: 5,
      name: 'Jharkhand Food Festival',
      description: 'Celebration of local cuisine featuring traditional dishes, cooking competitions, and food stalls.',
      image: 'https://source.unsplash.com/featured/400x300/?food%20festival%20India',
      images: [
        'https://source.unsplash.com/featured/400x300/?traditional%20food%20India',
        'https://source.unsplash.com/featured/400x300/?cooking%20competition',
        'https://source.unsplash.com/featured/400x300/?food%20stalls%20India'
      ],
      location: 'Morabadi Ground, Ranchi',
      coordinates: [23.3441, 85.3096],
      date: '2024-01-20',
      time: '5:00 PM',
      duration: '4 days',
      category: 'Food & Culture',
      ticketPrice: '₹200',
      organizer: 'Culinary Association of Jharkhand',
      expectedAttendees: 30000,
      rating: 4.4,
      highlights: ['Traditional Recipes', 'Cooking Contests', 'Food Stalls', 'Cultural Shows']
    },
    {
      id: 6,
      name: 'Wildlife Photography Workshop',
      description: 'Professional photography workshop in Betla National Park with wildlife experts.',
      image: 'https://source.unsplash.com/featured/400x300/?wildlife%20photography%20India',
      images: [
        'https://source.unsplash.com/featured/400x300/?wildlife%20photography',
        'https://source.unsplash.com/featured/400x300/?nature%20workshop',
        'https://source.unsplash.com/featured/400x300/?photography%20session'
      ],
      location: 'Betla National Park',
      coordinates: [23.8833, 84.1833],
      date: '2024-02-15',
      time: '6:00 AM',
      duration: '3 days',
      category: 'Nature & Wildlife',
      ticketPrice: '₹3000',
      organizer: 'Wildlife Conservation Society',
      expectedAttendees: 500,
      rating: 4.9,
      highlights: ['Expert Guidance', 'Wildlife Spotting', 'Photography Tips', 'Nature Walks']
    }
  ]

  const categories = ['all', 'Cultural', 'Adventure', 'Art & Craft', 'Food & Culture', 'Nature & Wildlife']
  const months = ['all', 'January', 'February', 'March', 'April', 'September', 'November', 'December']

  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory
    const monthMatch = selectedMonth === 'all' || new Date(event.date).toLocaleString('default', { month: 'long' }) === selectedMonth
    return categoryMatch && monthMatch
  })

  const handleGetDirections = (coordinates: [number, number], name: string, location: string) => {
    const mapUrl = `/map?name=${encodeURIComponent(name)}&lat=${coordinates[0]}&lng=${coordinates[1]}&address=${encodeURIComponent(location)}`
    window.location.href = mapUrl
  }

  const handleBookTickets = (event: Event) => {
    setSelectedEvent(event)
    setShowTicketModal(true)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Jharkhand Events & Festivals</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Experience the vibrant culture and traditions of Jharkhand through festivals, events, and celebrations throughout the year.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Event Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Month</label>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedMonth === month
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {month === 'all' ? 'All Months' : month}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <Image
                src={event.image}
                alt={event.name}
                width={400}
                height={192}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">{event.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.time} • {event.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.expectedAttendees.toLocaleString()} expected attendees</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {event.description}
              </p>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Event Highlights:</h4>
                <div className="flex flex-wrap gap-2">
                  {event.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm text-gray-500">Ticket Price:</span>
                  <p className="font-semibold text-green-600">{event.ticketPrice}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Organized by:</span>
                  <p className="font-medium text-gray-900 text-sm">{event.organizer}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGetDirections(event.coordinates, event.name, event.location)}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Get Directions</span>
                </button>
                <button 
                  onClick={() => handleBookTickets(event)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  title="Book Tickets"
                >
                  <Ticket className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => alert(`Event Details:\n${event.name}\nOrganizer: ${event.organizer}\nMore info coming soon!`)}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  title="More Info"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Calendar Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Annual Event Calendar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-600 mb-2">Spring (Mar-May)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Sarhul Festival (April)</li>
              <li>• Spring Cultural Meet</li>
              <li>• Nature Photography Tours</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">Monsoon (Jun-Sep)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Karma Festival (September)</li>
              <li>• Monsoon Music Festival</li>
              <li>• Traditional Dance Competitions</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-orange-600 mb-2">Winter (Oct-Feb)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Adventure Sports Meet (November)</li>
              <li>• Handicrafts Fair (December)</li>
              <li>• Food Festival (January)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Event Ticket Modal */}
      {selectedEvent && (
        <EventTicketModal
          event={selectedEvent}
          isOpen={showTicketModal}
          onClose={() => {
            setShowTicketModal(false)
            setSelectedEvent(null)
          }}
        />
      )}
    </div>
  )
}
