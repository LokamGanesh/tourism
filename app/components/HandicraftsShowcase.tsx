'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Star, ShoppingBag, Filter, Heart, Phone } from 'lucide-react'

interface Handicraft {
  id: number
  name: string
  description: string
  image: string
  images: string[]
  location: string
  coordinates: [number, number]
  price: string
  artisan: string
  rating: number
  specialty: string
}

export default function HandicraftsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handicrafts: Handicraft[] = [
    {
      id: 1,
      name: 'Dokra Metal Craft',
      description: 'Traditional bronze casting art using lost-wax technique, famous for figurines and decorative items.',
      image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&h=300&fit=crop', // Pottery/crafts
      images: [
        'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&h=300&fit=crop', // Pottery making
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', // Traditional craft
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'  // Handmade items
      ],
      location: 'Khunti District',
      coordinates: [23.0617, 85.2784],
      price: '₹500 - ₹5,000',
      artisan: 'Tribal Artisan Cooperative',
      rating: 4.7,
      specialty: 'Metal Work'
    },
    {
      id: 2,
      name: 'Bamboo Crafts',
      description: 'Eco-friendly bamboo products including baskets, furniture, and decorative items.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', // Woven baskets
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', // Woven baskets
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', // Natural materials
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'  // Handcraft work
      ],
      location: 'Ranchi',
      coordinates: [23.3441, 85.3096],
      price: '₹200 - ₹2,000',
      artisan: 'Bamboo Craft Center',
      rating: 4.5,
      specialty: 'Bamboo Work'
    },
    {
      id: 3,
      name: 'Tribal Paintings',
      description: 'Vibrant tribal art depicting nature, festivals, and daily life of indigenous communities.',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop', // Tribal art
      images: [
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop', // Traditional paintings
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', // Artistic work
        'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&h=300&fit=crop'  // Cultural art
      ],
      location: 'Dumka',
      coordinates: [24.2676, 87.2497],
      price: '₹300 - ₹3,000',
      artisan: 'Santal Artists Guild',
      rating: 4.8,
      specialty: 'Painting'
    },
    {
      id: 4,
      name: 'Handwoven Textiles',
      description: 'Traditional handloom textiles with intricate patterns and natural dyes.',
      image: 'https://source.unsplash.com/featured/400x300/?Tussar%20silk%20Jharkhand',
      images: [
        'https://source.unsplash.com/featured/400x300/?Tussar%20silk',
        'https://source.unsplash.com/featured/400x300/?handloom%20saree',
        'https://source.unsplash.com/featured/400x300/?tribal%20textile'
      ],
      location: 'Deoghar',
      coordinates: [24.4833, 86.7000],
      price: '₹800 - ₹8,000',
      artisan: 'Weaver Women Collective',
      rating: 4.6,
      specialty: 'Textiles'
    },
    {
      id: 5,
      name: 'Stone Carving',
      description: 'Intricate stone sculptures and architectural elements carved by skilled craftsmen.',
      image: 'https://source.unsplash.com/featured/400x300/?stone%20carving%20India',
      images: [
        'https://source.unsplash.com/featured/400x300/?stone%20sculpture',
        'https://source.unsplash.com/featured/400x300/?temple%20carving',
        'https://source.unsplash.com/featured/400x300/?architectural%20stone'
      ],
      location: 'Hazaribagh',
      coordinates: [23.9929, 85.3548],
      price: '₹1,000 - ₹15,000',
      artisan: 'Stone Craft Artisans',
      rating: 4.4,
      specialty: 'Stone Work'
    },
    {
      id: 6,
      name: 'Lac Bangles',
      description: 'Colorful lac bangles and jewelry, a traditional craft of Jharkhand women.',
      image: 'https://source.unsplash.com/featured/400x300/?lac%20bangles',
      images: [
        'https://source.unsplash.com/featured/400x300/?lac%20bangle',
        'https://source.unsplash.com/featured/400x300/?handmade%20jewelry%20india',
        'https://source.unsplash.com/featured/400x300/?tribal%20jewelry'
      ],
      location: 'Jamshedpur',
      coordinates: [22.8046, 86.2029],
      price: '₹100 - ₹1,500',
      artisan: 'Lac Craft Women Group',
      rating: 4.3,
      specialty: 'Jewelry'
    }
  ]

  const categories = ['all', 'Metal Work', 'Bamboo Work', 'Painting', 'Textiles', 'Stone Work', 'Jewelry']

  const filteredHandicrafts = selectedCategory === 'all' 
    ? handicrafts 
    : handicrafts.filter(item => item.specialty === selectedCategory)

  const handleGetDirections = (coordinates: [number, number], name: string, location: string) => {
    const mapUrl = `/map?name=${encodeURIComponent(name)}&lat=${coordinates[0]}&lng=${coordinates[1]}&address=${encodeURIComponent(location)}`
    window.location.href = mapUrl
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Jharkhand Handicrafts</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the rich artistic heritage of Jharkhand through traditional handicrafts created by skilled tribal artisans.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>

      {/* Handicrafts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHandicrafts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="relative">
              <Image
                src={item.image}
                alt={item.name}
                width={400}
                height={256}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {item.specialty}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">{item.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{item.location}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {item.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Price Range:</span>
                  <span className="font-semibold text-green-600">{item.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Artisan:</span>
                  <span className="font-medium">{item.artisan}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGetDirections(item.coordinates, item.name, item.location)}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Visit</span>
                </button>
                <button 
                  onClick={() => alert(`Shopping feature coming soon! Contact ${item.artisan} for purchases.`)}
                  className="bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center"
                  title="Shop"
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => alert(`Contact: ${item.artisan}\nLocation: ${item.location}\nFor inquiries about ${item.name}`)}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  title="Contact"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Support Local Artisans</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you purchase Jharkhand handicrafts, you directly support tribal communities and help preserve centuries-old traditions. Each piece tells a story of cultural heritage and skilled craftsmanship.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Authentic handmade products</li>
              <li>✓ Fair trade practices</li>
              <li>✓ Sustainable materials</li>
              <li>✓ Cultural preservation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Where to Buy</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">Jharkhand State Handicrafts Emporium</h4>
                <p className="text-sm text-gray-600">Main Road, Ranchi</p>
                <p className="text-sm text-primary-600">Open: 10 AM - 8 PM</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">Tribal Museum Shop</h4>
                <p className="text-sm text-gray-600">Morabadi, Ranchi</p>
                <p className="text-sm text-primary-600">Open: 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
