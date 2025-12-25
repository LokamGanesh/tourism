'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Users, Calendar, MapPin, Plane, Hotel, Utensils, Car, Camera, ShoppingBag, Star } from 'lucide-react'

export default function BudgetCalculator() {
  const [formData, setFormData] = useState({
    days: 5,
    people: 2,
    budgetType: 'mid-range',
    accommodation: 'hotel',
    transport: 'private-car',
    meals: 'restaurant',
    activities: ['sightseeing', 'photography']
  })

  const [budget, setBudget] = useState<{
    totalCost: number;
    dailyCostPerPerson: number;
    perPersonTotal: number;
    breakdown: Record<string, number>;
    suggestions: {
      places: any[];
      hotels: any[];
      restaurants: any[];
      events: any[];
      handicrafts: any[];
      dayPlan: any[];
    };
  } | null>(null)
  const [loading, setLoading] = useState(false)

  // Budget rates per person per day (in INR)
  const budgetRates = {
    'budget': {
      accommodation: { hotel: 800, guesthouse: 500, hostel: 300 },
      meals: { restaurant: 400, local: 250, street: 150 },
      transport: { 'private-car': 1200, 'public-transport': 200, 'shared-taxi': 600 },
      activities: { sightseeing: 200, photography: 100, adventure: 500, wildlife: 300 }
    },
    'mid-range': {
      accommodation: { hotel: 2000, guesthouse: 1200, hostel: 800 },
      meals: { restaurant: 800, local: 500, street: 300 },
      transport: { 'private-car': 2000, 'public-transport': 300, 'shared-taxi': 1000 },
      activities: { sightseeing: 400, photography: 200, adventure: 800, wildlife: 600 }
    },
    'luxury': {
      accommodation: { hotel: 5000, guesthouse: 3000, hostel: 2000 },
      meals: { restaurant: 1500, local: 1000, street: 600 },
      transport: { 'private-car': 3500, 'public-transport': 500, 'shared-taxi': 1500 },
      activities: { sightseeing: 800, photography: 400, adventure: 1500, wildlife: 1200 }
    }
  }

  // Comprehensive suggestion data based on budget
  const getSuggestions = (budgetType: string, days: number) => {
    const suggestions = {
      budget: {
        places: [
          { name: 'Hundru Falls', cost: 50, description: 'Free entry, stunning 98m waterfall', rating: 4.5, image: 'https://picsum.photos/400/300?random=101' },
          { name: 'Jagannath Temple Ranchi', cost: 0, description: 'Free temple visit, spiritual experience', rating: 4.3, image: 'https://picsum.photos/400/300?random=102' },
          { name: 'Jonha Falls', cost: 30, description: 'Sacred waterfall with temple', rating: 4.2, image: 'https://picsum.photos/400/300?random=103' },
          { name: 'Ranchi Lake', cost: 20, description: 'Peaceful lake for evening walks', rating: 4.0, image: 'https://picsum.photos/400/300?random=104' }
        ],
        hotels: [
          { name: 'Budget Inn Ranchi', cost: 800, description: 'Clean rooms, basic amenities', rating: 3.8, image: 'https://picsum.photos/400/300?random=201' },
          { name: 'Forest Rest House Betla', cost: 500, description: 'Government rest house in nature', rating: 4.0, image: 'https://picsum.photos/400/300?random=202' },
          { name: 'Youth Hostel Netarhat', cost: 300, description: 'Dormitory style, hill station', rating: 3.5, image: 'https://picsum.photos/400/300?random=203' }
        ],
        restaurants: [
          { name: 'Local Dhaba Junction', cost: 150, description: 'Authentic local food, dal-rice', rating: 4.2, image: 'https://picsum.photos/400/300?random=301' },
          { name: 'Street Food Corner', cost: 100, description: 'Litti chokha, local snacks', rating: 4.0, image: 'https://picsum.photos/400/300?random=302' },
          { name: 'Tribal Kitchen', cost: 200, description: 'Traditional tribal cuisine', rating: 4.3, image: 'https://picsum.photos/400/300?random=303' }
        ],
        events: [
          { name: 'Sarhul Festival', cost: 0, description: 'Free cultural festival in spring', date: 'March-April', image: 'https://picsum.photos/400/300?random=401' },
          { name: 'Local Handicraft Fair', cost: 50, description: 'Entry fee, shopping extra', date: 'Year-round', image: 'https://picsum.photos/400/300?random=402' }
        ],
        handicrafts: [
          { name: 'Bamboo Crafts', cost: 200, description: 'Eco-friendly baskets and items', location: 'Ranchi', image: 'https://picsum.photos/400/300?random=501' },
          { name: 'Tribal Paintings', cost: 300, description: 'Sohrai and Khovar art', location: 'Dumka', image: 'https://picsum.photos/400/300?random=502' },
          { name: 'Lac Bangles', cost: 150, description: 'Colorful traditional jewelry', location: 'Jamshedpur', image: 'https://picsum.photos/400/300?random=503' }
        ]
      },
      'mid-range': {
        places: [
          { name: 'Betla National Park', cost: 300, description: 'Safari and wildlife viewing', rating: 4.6, image: 'https://picsum.photos/400/300?random=105' },
          { name: 'Netarhat Hill Station', cost: 100, description: 'Sunrise point and scenic views', rating: 4.4, image: 'https://picsum.photos/400/300?random=106' },
          { name: 'Dassam Falls', cost: 80, description: 'Multi-tiered waterfall', rating: 4.3, image: 'https://picsum.photos/400/300?random=107' },
          { name: 'Palamau Tiger Reserve', cost: 400, description: 'Tiger safari and fort ruins', rating: 4.5, image: 'https://picsum.photos/400/300?random=108' }
        ],
        hotels: [
          { name: 'Hotel Yuvraj Palace', cost: 2000, description: 'Comfortable mid-range hotel', rating: 4.2, image: 'https://picsum.photos/400/300?random=204' },
          { name: 'Eco Lodge Netarhat', cost: 1500, description: 'Eco-friendly hill station stay', rating: 4.3, image: 'https://picsum.photos/400/300?random=205' },
          { name: 'Forest Resort Betla', cost: 1800, description: 'Nature resort near national park', rating: 4.1, image: 'https://picsum.photos/400/300?random=206' }
        ],
        restaurants: [
          { name: 'Kaveri Restaurant', cost: 400, description: 'Multi-cuisine family restaurant', rating: 4.3, image: 'https://picsum.photos/400/300?random=304' },
          { name: 'Tribal Cuisine Betla', cost: 350, description: 'Authentic tribal food experience', rating: 4.4, image: 'https://picsum.photos/400/300?random=305' },
          { name: 'Cafe Coffee Day', cost: 300, description: 'Coffee and light snacks', rating: 4.0, image: 'https://picsum.photos/400/300?random=306' }
        ],
        events: [
          { name: 'Karma Festival', cost: 100, description: 'Harvest festival celebration', date: 'August-September', image: 'https://picsum.photos/400/300?random=403' },
          { name: 'Adventure Sports Meet', cost: 500, description: 'Rock climbing, paragliding', date: 'October-November', image: 'https://picsum.photos/400/300?random=404' },
          { name: 'Wildlife Photography Workshop', cost: 800, description: 'Professional photography training', date: 'December-January', image: 'https://picsum.photos/400/300?random=405' }
        ],
        handicrafts: [
          { name: 'Dokra Metal Craft', cost: 800, description: 'Traditional bronze figurines', location: 'Khunti', image: 'https://picsum.photos/400/300?random=504' },
          { name: 'Handwoven Textiles', cost: 1200, description: 'Tussar silk sarees', location: 'Deoghar', image: 'https://picsum.photos/400/300?random=505' },
          { name: 'Stone Carving', cost: 1500, description: 'Architectural sculptures', location: 'Hazaribagh', image: 'https://picsum.photos/400/300?random=506' }
        ]
      },
      luxury: {
        places: [
          { name: 'Betla National Park Premium Safari', cost: 1000, description: 'Private safari with guide', rating: 4.8, image: 'https://picsum.photos/400/300?random=109' },
          { name: 'Netarhat Luxury Experience', cost: 500, description: 'Helicopter ride and premium stay', rating: 4.7, image: 'https://picsum.photos/400/300?random=110' },
          { name: 'Deoghar Temple VIP Darshan', cost: 300, description: 'Skip queue temple visit', rating: 4.6, image: 'https://picsum.photos/400/300?random=111' },
          { name: 'Private Waterfall Tour', cost: 800, description: 'Exclusive access with photographer', rating: 4.9, image: 'https://picsum.photos/400/300?random=112' }
        ],
        hotels: [
          { name: 'Radisson Blu Hotel Ranchi', cost: 5000, description: 'Luxury 5-star accommodation', rating: 4.6, image: 'https://picsum.photos/400/300?random=207' },
          { name: 'The Oasis Resort', cost: 4000, description: 'Premium resort with spa', rating: 4.5, image: 'https://picsum.photos/400/300?random=208' },
          { name: 'Luxury Forest Lodge', cost: 6000, description: 'Exclusive wildlife lodge', rating: 4.8, image: 'https://picsum.photos/400/300?random=209' }
        ],
        restaurants: [
          { name: 'Moti Mahal Delux', cost: 800, description: 'Fine dining Indian cuisine', rating: 4.5, image: 'https://picsum.photos/400/300?random=307' },
          { name: 'Pind Balluchi', cost: 700, description: 'Premium Punjabi restaurant', rating: 4.4, image: 'https://picsum.photos/400/300?random=308' },
          { name: 'Luxury Tribal Experience', cost: 1000, description: 'Curated tribal cuisine tasting', rating: 4.7, image: 'https://picsum.photos/400/300?random=309' }
        ],
        events: [
          { name: 'VIP Cultural Festival', cost: 2000, description: 'Exclusive cultural experience', date: 'Year-round', image: 'https://picsum.photos/400/300?random=406' },
          { name: 'Luxury Food Festival', cost: 1500, description: 'Premium culinary experience', date: 'November-December', image: 'https://picsum.photos/400/300?random=407' },
          { name: 'Private Art Exhibition', cost: 1000, description: 'Exclusive handicraft showcase', date: 'Year-round', image: 'https://picsum.photos/400/300?random=408' }
        ],
        handicrafts: [
          { name: 'Premium Dokra Collection', cost: 3000, description: 'Collector edition bronze art', location: 'Khunti', image: 'https://picsum.photos/400/300?random=507' },
          { name: 'Designer Textiles', cost: 5000, description: 'Custom handwoven silk', location: 'Deoghar', image: 'https://picsum.photos/400/300?random=508' },
          { name: 'Artistic Stone Sculptures', cost: 8000, description: 'Custom carved masterpieces', location: 'Hazaribagh', image: 'https://picsum.photos/400/300?random=509' }
        ]
      }
    }

    // Generate day-by-day plan
    const generateDayPlan = (days: number, budgetType: string) => {
      const plans = []
      const places = suggestions[budgetType].places
      const restaurants = suggestions[budgetType].restaurants
      
      for (let day = 1; day <= days; day++) {
        if (day === 1) {
          plans.push({
            day,
            title: 'Arrival & City Exploration',
            activities: [
              { time: '10:00 AM', activity: 'Arrival in Ranchi', cost: 0 },
              { time: '12:00 PM', activity: 'Hotel Check-in & Lunch', cost: restaurants[0].cost },
              { time: '3:00 PM', activity: places[0].name, cost: places[0].cost },
              { time: '7:00 PM', activity: 'Dinner & Rest', cost: restaurants[0].cost }
            ],
            totalCost: places[0].cost + (restaurants[0].cost * 2)
          })
        } else if (day === 2) {
          plans.push({
            day,
            title: 'Waterfall Adventure',
            activities: [
              { time: '8:00 AM', activity: 'Breakfast', cost: restaurants[1].cost },
              { time: '10:00 AM', activity: places[1]?.name || 'Sightseeing', cost: places[1]?.cost || 100 },
              { time: '1:00 PM', activity: 'Lunch', cost: restaurants[1].cost },
              { time: '3:00 PM', activity: places[2]?.name || 'Local Exploration', cost: places[2]?.cost || 50 },
              { time: '8:00 PM', activity: 'Dinner', cost: restaurants[0].cost }
            ],
            totalCost: (places[1]?.cost || 100) + (places[2]?.cost || 50) + (restaurants[1].cost * 2) + restaurants[0].cost
          })
        } else if (day === days) {
          plans.push({
            day,
            title: 'Departure Day',
            activities: [
              { time: '8:00 AM', activity: 'Breakfast & Check-out', cost: restaurants[1].cost },
              { time: '10:00 AM', activity: 'Last minute shopping', cost: 500 },
              { time: '12:00 PM', activity: 'Lunch', cost: restaurants[0].cost },
              { time: '3:00 PM', activity: 'Departure', cost: 0 }
            ],
            totalCost: restaurants[1].cost + 500 + restaurants[0].cost
          })
        } else {
          const placeIndex = (day - 1) % places.length
          plans.push({
            day,
            title: `Explore ${places[placeIndex].name}`,
            activities: [
              { time: '8:00 AM', activity: 'Breakfast', cost: restaurants[1].cost },
              { time: '10:00 AM', activity: places[placeIndex].name, cost: places[placeIndex].cost },
              { time: '1:00 PM', activity: 'Lunch', cost: restaurants[0].cost },
              { time: '3:00 PM', activity: 'Local Culture & Shopping', cost: 300 },
              { time: '8:00 PM', activity: 'Dinner', cost: restaurants[0].cost }
            ],
            totalCost: places[placeIndex].cost + (restaurants[0].cost * 2) + restaurants[1].cost + 300
          })
        }
      }
      return plans
    }

    return {
      ...suggestions[budgetType],
      dayPlan: generateDayPlan(days, budgetType)
    }
  }

  const calculateBudget = () => {
    setLoading(true)
    
    setTimeout(() => {
      const rates = budgetRates[formData.budgetType]
      
      // Calculate daily costs per person
      const accommodationCost = rates.accommodation[formData.accommodation] || 0
      const mealsCost = rates.meals[formData.meals] || 0
      const transportCost = rates.transport[formData.transport] || 0
      const activitiesCost = formData.activities.reduce((sum, activity) => 
        sum + (rates.activities[activity] || 0), 0
      )
      
      const dailyCostPerPerson = accommodationCost + mealsCost + transportCost + activitiesCost
      const totalCost = dailyCostPerPerson * formData.days * formData.people
      
      // Add miscellaneous costs (10% of total)
      const miscCost = totalCost * 0.1
      const finalTotal = totalCost + miscCost
      
      // Get suggestions based on budget type and days
      const suggestions = getSuggestions(formData.budgetType, formData.days)
      
      setBudget({
        dailyCostPerPerson,
        breakdown: {
          accommodation: accommodationCost * formData.days * formData.people,
          meals: mealsCost * formData.days * formData.people,
          transport: transportCost * formData.days * formData.people,
          activities: activitiesCost * formData.days * formData.people,
          miscellaneous: miscCost
        },
        totalCost: finalTotal,
        perPersonTotal: finalTotal / formData.people,
        suggestions
      })
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    calculateBudget()
  }, [formData])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleActivityToggle = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }))
  }

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Trip Details</h3>
          
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Days)
            </label>
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="range"
                min="1"
                max="15"
                value={formData.days}
                onChange={(e) => handleInputChange('days', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-primary-600 min-w-[3rem]">
                {formData.days} days
              </span>
            </div>
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of People
            </label>
            <div className="flex items-center space-x-4">
              <Users className="h-5 w-5 text-gray-400" />
              <input
                type="range"
                min="1"
                max="10"
                value={formData.people}
                onChange={(e) => handleInputChange('people', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-primary-600 min-w-[3rem]">
                {formData.people} people
              </span>
            </div>
          </div>

          {/* Budget Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Budget Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['budget', 'mid-range', 'luxury'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleInputChange('budgetType', type)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.budgetType === type
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <DollarSign className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium capitalize">{type.replace('-', ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Preferences</h3>
          
          {/* Accommodation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Accommodation
            </label>
            <div className="space-y-2">
              {[
                { value: 'hotel', label: 'Hotel', icon: Hotel },
                { value: 'guesthouse', label: 'Guesthouse', icon: Hotel },
                { value: 'hostel', label: 'Hostel', icon: Hotel }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="accommodation"
                    value={option.value}
                    checked={formData.accommodation === option.value}
                    onChange={(e) => handleInputChange('accommodation', e.target.value)}
                    className="h-4 w-4 text-primary-600"
                  />
                  <option.icon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Transportation
            </label>
            <div className="space-y-2">
              {[
                { value: 'private-car', label: 'Private Car', icon: Car },
                { value: 'shared-taxi', label: 'Shared Taxi', icon: Car },
                { value: 'public-transport', label: 'Public Transport', icon: Car }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="transport"
                    value={option.value}
                    checked={formData.transport === option.value}
                    onChange={(e) => handleInputChange('transport', e.target.value)}
                    className="h-4 w-4 text-primary-600"
                  />
                  <option.icon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Meals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dining Preference
            </label>
            <div className="space-y-2">
              {[
                { value: 'restaurant', label: 'Restaurant', icon: Utensils },
                { value: 'local', label: 'Local Eateries', icon: Utensils },
                { value: 'street', label: 'Street Food', icon: Utensils }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="meals"
                    value={option.value}
                    checked={formData.meals === option.value}
                    onChange={(e) => handleInputChange('meals', e.target.value)}
                    className="h-4 w-4 text-primary-600"
                  />
                  <option.icon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Activities (Select multiple)
            </label>
            <div className="space-y-2">
              {[
                { value: 'sightseeing', label: 'Sightseeing', icon: MapPin },
                { value: 'photography', label: 'Photography', icon: Camera },
                { value: 'adventure', label: 'Adventure Sports', icon: MapPin },
                { value: 'wildlife', label: 'Wildlife Safari', icon: MapPin }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.activities.includes(option.value)}
                    onChange={() => handleActivityToggle(option.value)}
                    className="h-4 w-4 text-primary-600"
                  />
                  <option.icon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Results */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ) : budget && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6">
            <h3 className="text-2xl font-bold mb-2">Your Trip Budget</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-primary-200 text-sm">Total Budget</p>
                <p className="text-3xl font-bold">₹{budget.totalCost.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-primary-200 text-sm">Per Person</p>
                <p className="text-2xl font-semibold">₹{budget.perPersonTotal.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-primary-200 text-sm">Daily Cost/Person</p>
                <p className="text-2xl font-semibold">₹{budget.dailyCostPerPerson.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Budget Breakdown</h4>
            <div className="space-y-4">
              {Object.entries(budget.breakdown).map(([category, amount]) => {
                const percentage = (amount / budget.totalCost) * 100
                const icons = {
                  accommodation: Hotel,
                  meals: Utensils,
                  transport: Car,
                  activities: Camera,
                  miscellaneous: ShoppingBag
                }
                const Icon = icons[category]
                
                return (
                  <div key={category} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 w-32">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {category}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right w-24">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 block">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-2">💡 Money Saving Tips</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Visit during off-season (April-September) for better accommodation rates</li>
                <li>• Book forest rest houses in advance for budget-friendly stays</li>
                <li>• Try local dhabas and street food for authentic and affordable meals</li>
                <li>• Share transportation costs with other travelers</li>
                <li>• Carry your own water bottle and snacks for day trips</li>
              </ul>
            </div>
          </div>

          {/* Comprehensive Suggestions */}
          <div className="mt-8 space-y-8">
            {/* Day-by-Day Plan */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">📅 Your {formData.days}-Day Itinerary Plan</h3>
              <div className="space-y-4">
                {budget.suggestions.dayPlan.map((day, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold">Day {day.day}: {day.title}</h4>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">₹{day.totalCost}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="flex justify-between items-center text-sm">
                          <span>{activity.time} - {activity.activity}</span>
                          <span className="text-purple-200">₹{activity.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Places Suggestions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🏞️ Recommended Places</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budget.suggestions.places.map((place, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{place.name}</h4>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">₹{place.cost}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{place.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{place.rating}</span>
                        </div>
                        <button className="bg-primary-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-700 transition-colors">
                          Add to Plan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels Suggestions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🏨 Recommended Hotels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budget.suggestions.hotels.map((hotel, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">₹{hotel.cost}/night</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{hotel.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{hotel.rating}</span>
                        </div>
                        <button className="bg-primary-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-700 transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurants Suggestions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🍽️ Recommended Restaurants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budget.suggestions.restaurants.map((restaurant, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">₹{restaurant.cost}/meal</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{restaurant.rating}</span>
                        </div>
                        <button className="bg-primary-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-700 transition-colors">
                          Reserve Table
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Suggestions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🎭 Recommended Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budget.suggestions.events.map((event, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{event.name}</h4>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                          {event.cost === 0 ? 'Free' : `₹${event.cost}`}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      <p className="text-primary-600 text-sm font-medium mb-3">📅 {event.date}</p>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors w-full">
                        Get Tickets
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Handicrafts Suggestions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🎨 Recommended Handicrafts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budget.suggestions.handicrafts.map((craft, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={craft.image} alt={craft.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{craft.name}</h4>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">₹{craft.cost}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{craft.description}</p>
                      <p className="text-primary-600 text-sm font-medium mb-3">📍 {craft.location}</p>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors w-full">
                        Shop Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">💰 Budget Summary for {formData.days} Days</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-green-200 text-sm">Accommodation</p>
                  <p className="text-2xl font-bold">₹{budget.breakdown.accommodation.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-green-200 text-sm">Food & Dining</p>
                  <p className="text-2xl font-bold">₹{budget.breakdown.meals.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-green-200 text-sm">Transportation</p>
                  <p className="text-2xl font-bold">₹{budget.breakdown.transport.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-green-200 text-sm">Activities</p>
                  <p className="text-2xl font-bold">₹{budget.breakdown.activities.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-green-200 text-lg">Total Trip Cost</p>
                <p className="text-4xl font-bold">₹{budget.totalCost.toLocaleString()}</p>
                <p className="text-green-200 text-sm">For {formData.people} people × {formData.days} days</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
