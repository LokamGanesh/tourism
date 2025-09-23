'use client'

import { Camera } from 'lucide-react'

interface SimpleARButtonProps {
  placeName: string
  placeImage: string
  coordinates: [number, number]
}

export default function SimpleARButton({ placeName, placeImage, coordinates }: SimpleARButtonProps) {
  console.log('🔍 SimpleARButton rendering for:', placeName)
  
  const handleClick = () => {
    console.log('🎯 Simple AR button clicked for:', placeName)
    alert(`AR View for ${placeName} - This is a test button`)
  }

  return (
    <button 
      onClick={handleClick}
      className="bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 w-full"
    >
      <Camera className="h-5 w-5" />
      <span>Try AR View</span>
    </button>
  )
}
