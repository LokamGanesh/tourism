'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Filter, ChevronDown, MoreHorizontal } from 'lucide-react'

interface ReviewsSectionProps {
  placeId: number
}

interface Review {
  id: number
  userName: string
  userAvatar: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  notHelpful: number
  images?: string[]
}

export default function ReviewsSection({ placeId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent')
  const [filterRating, setFilterRating] = useState(0)

  // Sample reviews data
  const sampleReviews: Review[] = [
    {
      id: 1,
      userName: 'Priya Sharma',
      userAvatar: 'https://source.unsplash.com/featured/150x150/?profile%20avatar',
      rating: 5,
      date: '2024-01-15',
      title: 'Amazing wildlife experience!',
      content: 'Betla National Park exceeded all my expectations. We spotted tigers, elephants, and numerous bird species. The safari guides were knowledgeable and the park is well-maintained. Perfect for nature lovers and photographers.',
      helpful: 24,
      notHelpful: 2,
      images: ['https://source.unsplash.com/featured/300x200/?Jharkhand%20tourism']
    },
    {
      id: 2,
      userName: 'Rajesh Kumar',
      userAvatar: 'https://source.unsplash.com/featured/150x150/?user%20avatar',
      rating: 4,
      date: '2024-01-10',
      title: 'Great place for family trip',
      content: 'Visited with family during winter holidays. Kids loved the jeep safari and we were lucky to see a tiger family. The forest rest house accommodation was decent. Only downside was the long queue for entry tickets.',
      helpful: 18,
      notHelpful: 1
    },
    {
      id: 3,
      userName: 'Anjali Patel',
      userAvatar: 'https://source.unsplash.com/featured/150x150/?portrait',
      rating: 5,
      date: '2024-01-05',
      title: 'Photographer\'s paradise',
      content: 'As a wildlife photographer, this place is a dream come true. The diversity of flora and fauna is incredible. Early morning safaris offer the best opportunities for wildlife sighting. Highly recommended for serious photographers.',
      helpful: 31,
      notHelpful: 0,
      images: [
        'https://source.unsplash.com/featured/300x200/?Hundru%20Falls',
        'https://source.unsplash.com/featured/300x200/?Jagannath%20Temple%20Ranchi'
      ]
    },
    {
      id: 4,
      userName: 'Vikram Singh',
      userAvatar: 'https://source.unsplash.com/featured/150x150/?female%20portrait',
      rating: 3,
      date: '2023-12-28',
      title: 'Good but crowded',
      content: 'The park itself is beautiful and well-preserved. However, during peak season it gets quite crowded which affects the wildlife experience. The facilities could be improved. Better to visit during off-season.',
      helpful: 12,
      notHelpful: 5
    },
    {
      id: 5,
      userName: 'Meera Joshi',
      userAvatar: 'https://source.unsplash.com/featured/150x150/?male%20portrait',
      rating: 4,
      date: '2023-12-20',
      title: 'Peaceful and serene',
      content: 'Perfect escape from city life. The natural beauty is breathtaking and the silence of the forest is therapeutic. Saw several deer and peacocks. The sunset point near the park is absolutely stunning.',
      helpful: 22,
      notHelpful: 1
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(sampleReviews)
      setLoading(false)
    }, 800)
  }, [placeId])

  const filteredReviews = reviews
    .filter(review => filterRating === 0 || review.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === 'helpful') {
        return b.helpful - a.helpful
      } else if (sortBy === 'rating') {
        return b.rating - a.rating
      }
      return 0
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Reviews ({reviews.length})</h4>
        
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Rating</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredReviews.map((review) => (
          <div key={review.id} className="p-6 border-b border-gray-100 last:border-b-0">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={review.userAvatar}
                  alt={review.userName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    console.error('Review avatar failed to load:', review.userAvatar);
                  }}
                />
                <div>
                  <h5 className="font-semibold text-gray-900">{review.userName}</h5>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <h6 className="font-semibold text-gray-900 mb-2">{review.title}</h6>
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex space-x-2 mb-4">
                {review.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}

            {/* Review Actions */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm">Helpful ({review.helpful})</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                <ThumbsDown className="h-4 w-4" />
                <span className="text-sm">Not Helpful ({review.notHelpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Button */}
      <div className="p-6 bg-gray-50">
        <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
          Write a Review
        </button>
      </div>
    </div>
  )
}
