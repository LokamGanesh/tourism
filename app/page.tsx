'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (userData && token) {
      const user = JSON.parse(userData)
      // Redirect based on role
      switch (user.role) {
        case 'tourist':
          router.push('/main')
          break
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
    } else {
      // If not logged in, go to welcome page
      router.push('/welcome')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
