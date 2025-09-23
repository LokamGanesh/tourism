'use client'

import { useState, useRef } from 'react'
import { Camera as CameraIcon, X } from 'lucide-react'

interface ARViewButtonProps {
  placeName: string
  placeImage: string
  coordinates: [number, number]
}

export default function ARViewButtonSimple({ placeName, placeImage, coordinates }: ARViewButtonProps) {
  console.log('🔍 ARViewButtonSimple rendering for:', placeName)
  const [isARActive, setIsARActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startARView = async () => {
    try {
      console.log('🎯 Starting AR view for:', placeName)
      setError(null)
      setIsLoading(true)
      
      if (!navigator?.mediaDevices?.getUserMedia) {
        setError('Camera API not available in this browser')
        setIsLoading(false)
        return
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      setIsARActive(true)
      
      // Wait for video element
      await new Promise(resolve => setTimeout(resolve, 150))
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        await videoRef.current.play()
      }
      
      setIsLoading(false)
      
    } catch (err: any) {
      console.error('AR Error:', err)
      setError(`Camera error: ${err.message || 'Unknown issue'}`)
      setIsLoading(false)
      setIsARActive(false)
    }
  }

  const stopARView = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsARActive(false)
    setIsLoading(false)
  }

  return (
    <div className="relative">
      {!isARActive ? (
        <div className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm font-medium mb-2">AR Error</p>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-600 text-xs underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🎯 AR button clicked - starting AR view')
              setError(null)
              startARView()
            }}
            className={`px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 w-full ${
              isLoading 
                ? 'bg-blue-500 text-white cursor-wait' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Starting Camera...</span>
              </>
            ) : (
              <>
                <CameraIcon size={20} />
                <span>AR View</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="absolute inset-0"
          />
          
          {/* AR Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-50">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                stopARView()
              }}
              className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* AR Overlay Information */}
          <div className="absolute bottom-4 left-4 right-4 z-50">
            <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 text-white">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{placeName}</h3>
                  <p className="text-sm text-gray-300 mb-2">Camera View Active</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="px-2 py-1 bg-blue-500/30 rounded-full">AR Mode</span>
                    <span className="px-2 py-1 bg-gray-500/30 rounded-full">
                      Tap X to exit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
