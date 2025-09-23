'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Star, Plus, Trash2, Edit } from 'lucide-react'

export default function ItineraryPlanner() {
  const [duration, setDuration] = useState(5)
  const [interests, setInterests] = useState(['wildlife', 'waterfalls'])
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [customPlace, setCustomPlace] = useState('')

  const interestOptions = [
    { id: 'wildlife', label: 'Wildlife & Nature', icon: '🦁' },
    { id: 'waterfalls', label: 'Waterfalls', icon: '💧' },
    { id: 'temples', label: 'Temples & Heritage', icon: '🛕' },
    { id: 'hills', label: 'Hill Stations', icon: '⛰️' },
    { id: 'adventure', label: 'Adventure Sports', icon: '🏃' },
    { id: 'culture', label: 'Local Culture', icon: '🎭' }
  ]

  const sampleItinerary = {
    5: {
      wildlife: [
        {
          day: 1,
          title: 'Arrival in Ranchi',
          places: [
            { name: 'Ranchi Airport/Station', time: '10:00 AM', activity: 'Arrival', duration: '1 hour' },
            { name: 'Hotel Check-in', time: '12:00 PM', activity: 'Rest & Lunch', duration: '2 hours' },
            { name: 'Jagannath Temple', time: '3:00 PM', activity: 'Temple Visit', duration: '2 hours' },
            { name: 'Local Market', time: '6:00 PM', activity: 'Shopping & Dinner', duration: '2 hours' }
          ]
        },
        {
          day: 2,
          title: 'Hundru Falls & Jonha Falls',
          places: [
            { name: 'Hotel', time: '7:00 AM', activity: 'Breakfast & Departure', duration: '1 hour' },
            { name: 'Hundru Falls', time: '9:00 AM', activity: 'Sightseeing & Photography', duration: '3 hours' },
            { name: 'Local Restaurant', time: '1:00 PM', activity: 'Lunch', duration: '1 hour' },
            { name: 'Jonha Falls', time: '3:00 PM', activity: 'Waterfall Visit', duration: '3 hours' },
            { name: 'Return to Hotel', time: '7:00 PM', activity: 'Rest', duration: '1 hour' }
          ]
        },
        {
          day: 3,
          title: 'Journey to Betla National Park',
          places: [
            { name: 'Hotel', time: '6:00 AM', activity: 'Check-out & Departure', duration: '1 hour' },
            { name: 'Drive to Betla', time: '7:00 AM', activity: 'Road Journey', duration: '4 hours' },
            { name: 'Forest Rest House', time: '12:00 PM', activity: 'Check-in & Lunch', duration: '2 hours' },
            { name: 'Betla National Park', time: '3:00 PM', activity: 'Evening Safari', duration: '3 hours' },
            { name: 'Rest House', time: '7:00 PM', activity: 'Dinner & Rest', duration: '2 hours' }
          ]
        },
        {
          day: 4,
          title: 'Full Day at Betla',
          places: [
            { name: 'Rest House', time: '5:30 AM', activity: 'Early Morning Safari', duration: '4 hours' },
            { name: 'Rest House', time: '10:00 AM', activity: 'Breakfast & Rest', duration: '2 hours' },
            { name: 'Palamau Fort', time: '1:00 PM', activity: 'Historical Site Visit', duration: '3 hours' },
            { name: 'Local Village', time: '5:00 PM', activity: 'Cultural Experience', duration: '2 hours' },
            { name: 'Rest House', time: '8:00 PM', activity: 'Dinner', duration: '1 hour' }
          ]
        },
        {
          day: 5,
          title: 'Return Journey',
          places: [
            { name: 'Rest House', time: '7:00 AM', activity: 'Check-out & Breakfast', duration: '1 hour' },
            { name: 'Netarhat', time: '9:00 AM', activity: 'Sunrise Point Visit', duration: '2 hours' },
            { name: 'Drive to Ranchi', time: '12:00 PM', activity: 'Return Journey', duration: '4 hours' },
            { name: 'Ranchi Airport/Station', time: '6:00 PM', activity: 'Departure', duration: '1 hour' }
          ]
        }
      ]
    }
  }

  const generateItinerary = () => {
    setLoading(true)
    setTimeout(() => {
      const baseItinerary = sampleItinerary[duration]?.wildlife || sampleItinerary[5].wildlife
      setItinerary(baseItinerary)
      setLoading(false)
    }, 1500)
  }

  useEffect(() => {
    generateItinerary()
  }, [duration, interests])

  const handleInterestToggle = (interestId) => {
    setInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const addCustomPlace = (dayIndex) => {
    if (!customPlace.trim()) return
    
    const newPlace = {
      name: customPlace,
      time: '12:00 PM',
      activity: 'Custom Activity',
      duration: '2 hours'
    }
    
    setItinerary(prev => {
      const updated = [...prev]
      updated[dayIndex].places.push(newPlace)
      return updated
    })
    setCustomPlace('')
  }

  const removePlace = (dayIndex, placeIndex) => {
    setItinerary(prev => {
      const updated = [...prev]
      updated[dayIndex].places.splice(placeIndex, 1)
      return updated
    })
  }

  return (
    <div className="space-y-8">
      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Trip Duration</h3>
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="range"
              min="3"
              max="10"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-primary-600 min-w-[4rem]">
              {duration} days
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Interests</h3>
          <div className="grid grid-cols-2 gap-3">
            {interestOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleInterestToggle(option.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  interests.includes(option.id)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Itinerary */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-6"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-6">
                <div className="h-5 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : itinerary && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
            <h3 className="text-2xl font-bold mb-2">Your {duration}-Day Jharkhand Itinerary</h3>
            <p className="text-green-100">
              Personalized based on your interests: {interests.map(i => 
                interestOptions.find(opt => opt.id === i)?.label
              ).join(', ')}
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-8">
              {itinerary.map((day, dayIndex) => (
                <div key={day.day} className="relative">
                  {/* Day Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">Day {day.day}</h4>
                      <p className="text-gray-600">{day.title}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="ml-5 border-l-2 border-gray-200 pl-8 space-y-6">
                    {day.places.map((place, placeIndex) => (
                      <div key={placeIndex} className="relative group">
                        <div className="absolute -left-10 w-4 h-4 bg-primary-600 rounded-full border-4 border-white"></div>
                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">{place.time}</span>
                                <span className="text-sm text-gray-500">({place.duration})</span>
                              </div>
                              <h5 className="font-semibold text-gray-900 mb-1">{place.name}</h5>
                              <p className="text-gray-600 text-sm">{place.activity}</p>
                            </div>
                            <button
                              onClick={() => removePlace(dayIndex, placeIndex)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Custom Place */}
                    <div className="relative">
                      <div className="absolute -left-10 w-4 h-4 bg-gray-300 rounded-full border-4 border-white"></div>
                      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            placeholder="Add a custom place or activity..."
                            value={customPlace}
                            onChange={(e) => setCustomPlace(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <button
                            onClick={() => addCustomPlace(dayIndex)}
                            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={generateItinerary}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Regenerate Itinerary</span>
              </button>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Download PDF
              </button>
              <button className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                Share Itinerary
              </button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h5 className="font-semibold text-yellow-900 mb-2">📝 Travel Tips</h5>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Book forest rest houses and safari permits in advance</li>
                <li>• Carry warm clothes for early morning safaris</li>
                <li>• Keep your camera ready for wildlife photography</li>
                <li>• Respect local customs and wildlife guidelines</li>
                <li>• Stay hydrated and carry snacks for long journeys</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
