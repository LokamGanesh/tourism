'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BudgetCalculator from '../components/BudgetCalculator'
import ItineraryPlanner from '../components/ItineraryPlanner'
import { Calendar, DollarSign, MapPin, Users } from 'lucide-react'

export default function BudgetPlannerPage() {
  const [activeTab, setActiveTab] = useState('calculator')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-12 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Plan Your Perfect Trip
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create a personalized itinerary and budget for your Jharkhand adventure. 
              Get recommendations based on your preferences and duration of stay.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">50+</h3>
            <p className="text-gray-600">Tourist Places</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹2,000</h3>
            <p className="text-gray-600">Avg. Daily Budget</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">5-7</h3>
            <p className="text-gray-600">Recommended Days</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">10K+</h3>
            <p className="text-gray-600">Happy Travelers</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'calculator'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Budget Calculator
              </button>
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'itinerary'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Itinerary Planner
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'calculator' && <BudgetCalculator />}
            {activeTab === 'itinerary' && <ItineraryPlanner />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
