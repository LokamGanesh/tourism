'use client'

import { MapPin, MessageCircle, Calendar, TrendingUp, Hotel, Navigation } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Interactive Maps',
      description: 'Explore destinations with detailed maps and get real-time directions to any location.',
      color: 'bg-blue-500'
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'Multilingual Chatbot',
      description: 'Get instant assistance in your preferred language for travel queries and recommendations.',
      color: 'bg-green-500'
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Trip Planning',
      description: 'Plan your perfect itinerary with budget estimation and duration-based recommendations.',
      color: 'bg-purple-500'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Smart Analytics',
      description: 'View ratings and reviews with beautiful statistical visualizations and insights.',
      color: 'bg-orange-500'
    },
    {
      icon: <Hotel className="h-8 w-8" />,
      title: 'Accommodation Finder',
      description: 'Discover nearby hotels and restaurants with ratings, prices, and booking options.',
      color: 'bg-red-500'
    },
    {
      icon: <Navigation className="h-8 w-8" />,
      title: 'Smart Recommendations',
      description: 'Get personalized suggestions based on your preferences and travel history.',
      color: 'bg-indigo-500'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of travel planning with our comprehensive suite of intelligent features designed to make your Jharkhand journey unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`${feature.color} text-white p-3 rounded-xl w-fit mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Explore Jharkhand?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Start planning your adventure today with our intelligent travel companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Planning
            </button>
            <button className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-800 transition-colors border border-primary-500">
              Chat with Assistant
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
