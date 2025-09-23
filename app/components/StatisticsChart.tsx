'use client'

import { useState, useEffect } from 'react'
import { Star, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react'

interface StatisticsChartProps {
  placeId: number
}

export default function StatisticsChart({ placeId }: StatisticsChartProps) {
  const [stats, setStats] = useState(null)
  const [activeChart, setActiveChart] = useState('ratings')

  // Sample statistics data
  const statisticsData = {
    overall: {
      averageRating: 4.6,
      totalReviews: 1234,
      totalVisitors: 15678,
      recommendationRate: 92
    },
    ratingDistribution: [
      { stars: 5, count: 678, percentage: 55 },
      { stars: 4, count: 345, percentage: 28 },
      { stars: 3, count: 123, percentage: 10 },
      { stars: 2, count: 62, percentage: 5 },
      { stars: 1, count: 26, percentage: 2 }
    ],
    monthlyVisitors: [
      { month: 'Jan', visitors: 890 },
      { month: 'Feb', visitors: 1200 },
      { month: 'Mar', visitors: 1450 },
      { month: 'Apr', visitors: 1100 },
      { month: 'May', visitors: 800 },
      { month: 'Jun', visitors: 600 },
      { month: 'Jul', visitors: 950 },
      { month: 'Aug', visitors: 1300 },
      { month: 'Sep', visitors: 1600 },
      { month: 'Oct', visitors: 2100 },
      { month: 'Nov', visitors: 2400 },
      { month: 'Dec', visitors: 1800 }
    ],
    categories: [
      { category: 'Wildlife Experience', rating: 4.8, reviews: 456 },
      { category: 'Accessibility', rating: 4.2, reviews: 234 },
      { category: 'Facilities', rating: 4.4, reviews: 345 },
      { category: 'Value for Money', rating: 4.7, reviews: 567 },
      { category: 'Safety', rating: 4.5, reviews: 432 }
    ]
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(statisticsData)
    }, 500)
  }, [placeId])

  if (!stats) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Statistics & Analytics</h4>
        
        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-yellow-400 mr-2" />
              <span className="text-2xl font-bold text-gray-900">{stats.overall.averageRating}</span>
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">{stats.overall.totalReviews}</span>
            </div>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveChart('ratings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeChart === 'ratings'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Rating Distribution
          </button>
          <button
            onClick={() => setActiveChart('visitors')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeChart === 'visitors'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Monthly Visitors
          </button>
          <button
            onClick={() => setActiveChart('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeChart === 'categories'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Category Ratings
          </button>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        {activeChart === 'ratings' && (
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-900 mb-4">Rating Distribution</h5>
            {stats.ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium">{item.stars}</span>
                  <Star className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 w-16 text-right">
                  {item.count} ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        )}

        {activeChart === 'visitors' && (
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-900 mb-4">Monthly Visitor Trends</h5>
            <div className="relative">
              {/* Simple bar chart */}
              <div className="flex items-end justify-between h-48 space-x-1">
                {stats.monthlyVisitors.map((item, index) => {
                  const maxVisitors = Math.max(...stats.monthlyVisitors.map(m => m.visitors))
                  const height = (item.visitors / maxVisitors) * 100
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-primary-600 rounded-t transition-all duration-500 w-full"
                        style={{ height: `${height}%` }}
                        title={`${item.month}: ${item.visitors} visitors`}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              Peak season: October - December
            </div>
          </div>
        )}

        {activeChart === 'categories' && (
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-900 mb-4">Category-wise Ratings</h5>
            {stats.categories.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">{item.rating}</span>
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs text-gray-500">({item.reviews})</span>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(item.rating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">{stats.overall.recommendationRate}% recommend</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">{stats.overall.totalVisitors.toLocaleString()} total visitors</span>
            </div>
          </div>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            View Detailed Report
          </button>
        </div>
      </div>
    </div>
  )
}
