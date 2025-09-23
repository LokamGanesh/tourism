'use client'

import { useState } from 'react'
import Link from 'next/link'
// Using native img to avoid Next/Image domain restrictions for varied external sources
import { MapPin, Star, Clock, Camera } from 'lucide-react'

export default function FeaturedPlaces() {
  const IMG_VERSION = '2025-09-22a'
  const featuredPlaces = [
    {
      id: 1,
      name: 'Betla National Park',
      location: 'Latehar District',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1000&h=600&fit=crop',
      images: [
        'https://source.unsplash.com/featured/1000x600/?Betla%20National%20Park',
        'https://source.unsplash.com/featured/1000x600/?Jharkhand%20wildlife',
        'https://source.unsplash.com/featured/1000x600/?elephants%20India'
      ],
      rating: 4.6,
      reviews: 1234,
      category: 'Wildlife',
      description: 'Famous for tigers, elephants and diverse wildlife in natural habitat.',
      coordinates: [23.8859, 84.1917]
    },
    {
      id: 2,
      name: 'Hundru Falls',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1000&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1000&h=600&fit=crop',
        'https://source.unsplash.com/featured/1000x600/?waterfall%20Ranchi',
        'https://source.unsplash.com/featured/1000x600/?Jharkhand%20waterfall'
      ],
      rating: 4.4,
      reviews: 856,
      category: 'Waterfall',
      description: 'Spectacular 98-meter high waterfall, perfect for nature lovers.',
      coordinates: [23.4315, 85.4578]
    },
    {
      id: 3,
      name: 'Jagannath Temple',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1000&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1000&h=600&fit=crop',
        'https://source.unsplash.com/featured/1000x600/?temple%20Ranchi',
        'https://source.unsplash.com/featured/1000x600/?Hindu%20temple%20India'
      ],
      rating: 4.7,
      reviews: 2341,
      category: 'Religious',
      description: 'Ancient temple with stunning architecture and spiritual significance.',
      coordinates: [23.3441, 85.3096]
    },
    {
      id: 4,
      name: 'Netarhat',
      location: 'Latehar District',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&h=600&fit=crop',
        'https://source.unsplash.com/featured/1000x600/?Netarhat%20view',
        'https://source.unsplash.com/featured/1000x600/?Jharkhand%20hills'
      ],
      rating: 4.5,
      reviews: 967,
      category: 'Hill Station',
      description: 'Queen of Chotanagpur, famous for sunrise and sunset views.',
      coordinates: [23.4667, 84.2667]
    },
    {
      id: 5,
      name: 'Dassam Falls',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&h=600&fit=crop',
        'https://source.unsplash.com/featured/1000x600/?waterfall%20Ranchi',
        'https://source.unsplash.com/featured/1000x600/?cascade%20waterfall'
      ],
      rating: 4.3,
      reviews: 743,
      category: 'Waterfall',
      description: 'Beautiful cascade waterfall surrounded by dense forests.',
      coordinates: [23.2167, 85.5167]
    },
    {
      id: 6,
      name: 'Palamau Tiger Reserve',
      location: 'Latehar District',
      image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1000&h=600&fit=crop',
      images: [
        'https://source.unsplash.com/featured/1000x600/?Betla%20forest',
        'https://source.unsplash.com/featured/1000x600/?tiger%20reserve%20India',
        'https://source.unsplash.com/featured/1000x600/?Jharkhand%20forest'
      ],
      rating: 4.4,
      reviews: 612,
      category: 'Wildlife',
      description: 'First tiger reserve in India, rich biodiversity and scenic beauty.',
      coordinates: [24.0167, 84.0500]
    },
    {
      id: 7,
      name: 'Jonha Falls',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1000&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1000&h=600&fit=crop',
        'https://source.unsplash.com/featured/1000x600/?waterfall%20India',
        'https://source.unsplash.com/featured/1000x600/?Jharkhand%20waterfall'
      ],
      rating: 4.2,
      reviews: 534,
      category: 'Waterfall',
      description: 'Scenic waterfall also known as Gautamdhara, perfect for picnics.',
      coordinates: [23.2833, 85.4167]
    },
    {
      id: 8,
      name: 'Deoghar Temple',
      location: 'Deoghar',
      image: 'https://images.unsplash.com/photo-1549649036-9802b06cc5a8?w=1000&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1549649036-9802b06cc5a8?w=1000&h=600&fit=crop',
        'https://source.unsplash.com/featured/1000x600/?Deoghar%20Temple',
        'https://source.unsplash.com/featured/1000x600/?Jyotirlinga'
      ],
      rating: 4.8,
      reviews: 3456,
      category: 'Religious',
      description: 'Sacred Baidyanath Jyotirlinga temple, one of the 12 Jyotirlingas.',
      coordinates: [24.4833, 86.7000]
    },
    {
      id: 9,
      name: 'Parasnath Hill',
      location: 'Giridih',
      image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1000&h=600&fit=crop',
      images: [
        'https://source.unsplash.com/featured/1000x600/?Parasnath%20Hill',
        'https://source.unsplash.com/featured/1000x600/?Jain%20temple%20hill',
        'https://source.unsplash.com/featured/1000x600/?Jharkhand%20hills'
      ],
      rating: 4.3,
      reviews: 789,
      category: 'Hill Station',
      description: 'Highest peak in Jharkhand, sacred to Jains with ancient temples.',
      coordinates: [23.9667, 86.1667]
    },
    {
      id: 10,
      name: 'Hazaribagh Wildlife Sanctuary',
      location: 'Hazaribagh',
      image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1000&h=600&fit=crop',
      images: [
        'https://source.unsplash.com/featured/1000x600/?Hazaribagh%20wildlife',
        'https://source.unsplash.com/featured/1000x600/?forest%20Jharkhand',
        'https://source.unsplash.com/featured/1000x600/?wildlife%20India'
      ],
      rating: 4.1,
      reviews: 445,
      category: 'Wildlife',
      description: 'Rich wildlife sanctuary with leopards, sambars and various bird species.',
      coordinates: [23.9833, 85.3667]
    },
    {
      id: 11,
      name: 'Ranchi Lake',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=600&fit=crop',
        'https://source.unsplash.com/featured/1000x600/?Ranchi%20city%20lake',
        'https://source.unsplash.com/featured/1000x600/?boating%20lake'
      ],
      rating: 4.0,
      reviews: 623,
      category: 'Lake',
      description: 'Artificial lake in the heart of Ranchi city, perfect for boating.',
      coordinates: [23.3441, 85.3096]
    },
    {
      id: 12,
      name: 'Maithon Dam',
      location: 'Dhanbad',
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&h=600&fit=crop',
        'https://source.unsplash.com/featured/1000x600/?dam%20India',
        'https://source.unsplash.com/featured/1000x600/?water%20sports%20dam'
      ],
      rating: 4.2,
      reviews: 567,
      category: 'Dam',
      description: 'Beautiful dam on Barakar river, popular for water sports and picnics.',
      coordinates: [23.8667, 86.8333]
    }
  ]

  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Wildlife', 'Waterfall', 'Religious', 'Hill Station', 'Lake', 'Dam']

  const filteredPlaces = selectedCategory === 'All' 
    ? featuredPlaces 
    : featuredPlaces.filter(place => place.category === selectedCategory)

  // Cache-busting for stubborn image caches
  const withVersion = (url: string) => `${url}${url.includes('?') ? '&' : '?'}v=${IMG_VERSION}`

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most popular tourist attractions in Jharkhand, each offering unique experiences and breathtaking beauty.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map((place) => (
            <div
              key={`${place.id}-${IMG_VERSION}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={withVersion(place.image)}
                  alt={place.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', place.image);
                    (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x256/cccccc/666666?text=Image+Not+Available'
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {place.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{place.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{place.location}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {place.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {place.reviews} reviews
                  </span>
                  <Link
                    href={`/places/${place.id}`}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/places"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            View All Places
            <MapPin className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
