import { useState, useEffect } from 'react'

interface FetchOptions {
  featured?: boolean
  category?: string
  type?: string
  location?: string
  cuisineType?: string
  upcoming?: boolean
}

export function usePlaces(options: FetchOptions = {}) {
  const [places, setPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (options.featured) params.append('featured', 'true')
        if (options.category) params.append('category', options.category)
        
        const response = await fetch(`/api/public/places?${params.toString()}`)
        const data = await response.json()
        
        if (data.success) {
          setPlaces(data.places)
        } else {
          setError(data.error || 'Failed to fetch places')
        }
      } catch (err) {
        setError('Failed to fetch places')
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [options.featured, options.category])

  return { places, loading, error, refetch: () => setLoading(true) }
}

export function useHotels(options: FetchOptions = {}) {
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (options.featured) params.append('featured', 'true')
        if (options.type) params.append('type', options.type)
        if (options.location) params.append('location', options.location)
        
        const response = await fetch(`/api/public/hotels?${params.toString()}`)
        const data = await response.json()
        
        if (data.success) {
          setHotels(data.hotels)
        } else {
          setError(data.error || 'Failed to fetch hotels')
        }
      } catch (err) {
        setError('Failed to fetch hotels')
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [options.featured, options.type, options.location])

  return { hotels, loading, error, refetch: () => setLoading(true) }
}

export function useRestaurants(options: FetchOptions = {}) {
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (options.featured) params.append('featured', 'true')
        if (options.cuisineType) params.append('cuisineType', options.cuisineType)
        if (options.location) params.append('location', options.location)
        
        const response = await fetch(`/api/public/restaurants?${params.toString()}`)
        const data = await response.json()
        
        if (data.success) {
          setRestaurants(data.restaurants)
        } else {
          setError(data.error || 'Failed to fetch restaurants')
        }
      } catch (err) {
        setError('Failed to fetch restaurants')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [options.featured, options.cuisineType, options.location])

  return { restaurants, loading, error, refetch: () => setLoading(true) }
}

export function useEvents(options: FetchOptions = {}) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (options.featured) params.append('featured', 'true')
        if (options.category) params.append('category', options.category)
        if (options.upcoming) params.append('upcoming', 'true')
        
        const response = await fetch(`/api/public/events?${params.toString()}`)
        const data = await response.json()
        
        if (data.success) {
          setEvents(data.events)
        } else {
          setError(data.error || 'Failed to fetch events')
        }
      } catch (err) {
        setError('Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [options.featured, options.category, options.upcoming])

  return { events, loading, error, refetch: () => setLoading(true) }
}
