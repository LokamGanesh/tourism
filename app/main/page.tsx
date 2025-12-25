'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedPlaces from '../components/FeaturedPlaces'
import Features from '../components/Features'
import Footer from '../components/Footer'
import ChatBot from '../components/ChatBot'
import LocationServicesButton from '../components/LocationServicesButton'

export default function MainPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      // If not logged in, redirect to welcome page
      router.push('/welcome')
      return
    }

    const parsedUser = JSON.parse(userData)

    // Only allow tourists to access this page
    if (parsedUser.role !== 'tourist') {
      // Redirect other roles to their respective dashboards
      switch (parsedUser.role) {
        case 'travel_guide':
          router.push('/dashboard/travel-guide')
          break
        case 'admin':
          router.push('/dashboard/admin')
          break
        case 'government':
          router.push('/dashboard/government')
          break
        default:
          router.push('/welcome')
      }
      return
    }

    setUser(parsedUser)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-16">
      <Navbar user={user} />
      <Hero />
      <FeaturedPlaces />
      <Features />
      <Footer />
      <ChatBot />
      <LocationServicesButton />
    </main>
  )
}
