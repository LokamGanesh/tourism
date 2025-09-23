'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MapPin, Users, Shield, Building, Star, Award, 
  CheckCircle, ArrowRight, Globe, Camera, Car, Hotel
} from 'lucide-react'
import BackgroundSlider from '../components/BackgroundSlider'

export default function WelcomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: MapPin,
      title: "Explore Destinations",
      description: "Discover hidden gems and popular tourist spots across Jharkhand"
    },
    {
      icon: Users,
      title: "Expert Guides",
      description: "Connect with verified travel packages for authentic experiences"
    },
    {
      icon: Shield,
      title: "Verified Services",
      description: "All travel services are verified and approved by tourism authorities"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Rated and reviewed experiences ensuring your satisfaction"
    }
  ]

  const userTypes = [
    {
      type: 'tourist',
      icon: Camera,
      title: 'Tourist',
      description: 'Explore verified travel packages and book amazing experiences',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      type: 'travel_guide',
      icon: MapPin,
      title: 'Travel Guide',
      description: 'Share your expertise and create memorable travel experiences',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Jharkhand Tourism</h1>
                <p className="text-xs text-gray-500">Official Tourism Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">English</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <BackgroundSlider className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent drop-shadow-lg">
                Welcome to
              </span>
              <span className="block text-blue-400 drop-shadow-2xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Jharkhand Tourism
              </span>
            </h1>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-3xl">
              <p className="text-xl text-white leading-relaxed font-medium drop-shadow-lg">
                Your gateway to exploring the magnificent landscapes, rich cultural heritage, 
                and unforgettable experiences that Jharkhand has to offer. Join our community 
                of travelers, guides, and tourism professionals.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/100 transition-all duration-300">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-sm text-gray-700 font-medium">Tourist Places</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/100 transition-all duration-300">
              <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
              <div className="text-sm text-gray-700 font-medium">Average Rating</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/100 transition-all duration-300">
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-sm text-gray-700 font-medium">Happy Travelers</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/100 transition-all duration-300">
              <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
              <div className="text-sm text-gray-700 font-medium">Verified Travels</div>
            </div>
          </div>
        </div>
      </BackgroundSlider>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Jharkhand Tourism?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive platform connecting tourists with verified travel packages 
              and authentic experiences across Jharkhand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    activeFeature === index ? 'bg-primary-600' : 'bg-gray-100'
                  } transition-colors duration-300`}>
                    <Icon className={`h-8 w-8 ${
                      activeFeature === index ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Your Jharkhand Adventure
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community of travelers and guides to explore the beautiful state of Jharkhand
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome Back!</h3>
              <p className="text-gray-600">Access your account or create a new one</p>
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/auth?mode=login"
                className="block w-full text-center py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Login to Your Account
              </Link>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <Link 
                href="/auth?mode=signup"
                className="block w-full text-center py-3 px-6 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                Create New Account
              </Link>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                New here? Choose to join as a <strong>Tourist</strong> to explore amazing travel packages or as a <strong>Travel Guide</strong> to share your expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About Jharkhand Tourism Platform
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">For Tourists</h4>
                    <p className="text-gray-600">Browse verified travel packages, read reviews, and book authentic experiences with transport options.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">For Travel Guides</h4>
                    <p className="text-gray-600">Register your services, manage bookings, add vehicles and drivers, and grow your tourism business.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                    <p className="text-gray-600">All travel guides and services are verified to ensure authentic and safe experiences.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                    <p className="text-gray-600">Round-the-clock assistance for travelers and guides to ensure smooth experiences.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <Car className="h-8 w-8 mb-3" />
                <h4 className="font-semibold mb-2">Transport Services</h4>
                <p className="text-sm opacity-90">Verified vehicles and drivers for safe travel</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6 text-white">
                <Hotel className="h-8 w-8 mb-3" />
                <h4 className="font-semibold mb-2">Accommodation</h4>
                <p className="text-sm opacity-90">Curated stays from budget to luxury</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-white">
                <Star className="h-8 w-8 mb-3" />
                <h4 className="font-semibold mb-2">Quality Assured</h4>
                <p className="text-sm opacity-90">All services verified and rated</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white">
                <Award className="h-8 w-8 mb-3" />
                <h4 className="font-semibold mb-2">Certified Guides</h4>
                <p className="text-sm opacity-90">Licensed and experienced professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Explore Jharkhand?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of travelers and guides who trust our platform for authentic Jharkhand experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth?mode=login" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Login
            </Link>
            <Link 
              href="/auth?mode=signup" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign Up
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Test Navigation System:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/test-map" 
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Test Voice Navigation
              </Link>
              <Link 
                href="/map?name=Betla%20National%20Park&lat=23.8859&lng=84.1917&address=Latehar%20District" 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Test Betla Park Navigation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-primary-600 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">Jharkhand Tourism</span>
          </div>
          <p className="text-gray-400 mb-4">
            Official Tourism Portal - Government of Jharkhand
          </p>
          <p className="text-sm text-gray-500">
            © 2024 Jharkhand Tourism. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
