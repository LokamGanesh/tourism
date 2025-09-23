'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Users, Calendar, MapPin, Plane, Hotel, Utensils, Car, Camera, ShoppingBag } from 'lucide-react'

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
        perPersonTotal: finalTotal / formData.people
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
        </div>
      )}
    </div>
  )
}
