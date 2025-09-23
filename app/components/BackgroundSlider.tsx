'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface BackgroundSliderProps {
  children: React.ReactNode
  className?: string
}

export default function BackgroundSlider({ children, className = '' }: BackgroundSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Beautiful Jharkhand tourism and nature images with moving effects
  const images = [
    // Specific Jharkhand tourism themed images
    'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1920&h=1080&fit=crop&q=tiger', // Tiger for wildlife
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop&q=waterfall', // Waterfall
    'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1920&h=1080&fit=crop&q=temple', // Hindu temple
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=mountain', // Mountain landscape
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1920&h=1080&fit=crop&q=waterfall', // Another waterfall
    'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1920&h=1080&fit=crop&q=wildlife', // Wildlife sanctuary
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=forest', // Dense forest
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1920&h=1080&fit=crop&q=temple', // Temple architecture
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920&h=1080&fit=crop&q=nature', // Nature landscape
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&q=art', // Traditional art
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop&q=festival', // Cultural festival
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=handicraft', // Traditional crafts
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Images with Moving Effects */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          >
            <Image
              src={image}
              alt={`Jharkhand tourism background ${index + 1}`}
              fill
              className={`object-cover transition-transform duration-[8000ms] ease-linear ${
                index === currentSlide ? 'animate-slow-zoom' : ''
              }`}
              priority={index === 0}
              quality={90}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Animated Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/10 rounded-full animate-float-fast"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-white/15 rounded-full animate-float-medium"></div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/10 to-white/40" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                index === currentSlide
                  ? 'bg-blue-500 border-blue-400 w-10 shadow-lg'
                  : 'bg-white/60 border-white/80 hover:bg-white/80 hover:border-white shadow-md'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
