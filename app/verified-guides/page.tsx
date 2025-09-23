'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifiedGuidesPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new verified travels page
    router.push('/verified-travels')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to verified travels...</p>
      </div>
    </div>
  )
}
