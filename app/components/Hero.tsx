'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, MapPin, Star, Users } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Discover Jharkhand',
      subtitle: 'Land of Forests and Waterfalls'
    },
    {
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Explore Nature',
      subtitle: 'Pristine Landscapes Await You'
    },
    {
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Cultural Heritage',
      subtitle: 'Rich Traditions and History'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up">
            {slides[currentSlide].subtitle}
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto animate-slide-up">
            Experience the untouched beauty of Jharkhand with our comprehensive travel guide.
            Discover hidden gems, plan your perfect trip, and create unforgettable memories.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/places"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <MapPin className="h-5 w-5" />
              <span>Explore Places</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="/budget-planner"
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-4 rounded-lg font-semibold border border-white/30 transition-all transform hover:scale-105"
            >
              Plan Your Trip
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-primary-400 mr-2" />
                <span className="text-3xl font-bold">50+</span>
              </div>
              <p className="text-sm opacity-90">Tourist Places</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-secondary-400 mr-2" />
                <span className="text-3xl font-bold">4.8</span>
              </div>
              <p className="text-sm opacity-90">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-3xl font-bold">10K+</span>
              </div>
              <p className="text-sm opacity-90">Happy Travelers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
          />
        ))}
      </div>
    </div>
  )
}
