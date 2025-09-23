'use client'

import { useState } from 'react'
import { Play, Square, Volume2, VolumeX, MapPin, Navigation } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function TestMapPage() {
  const [isNavigating, setIsNavigating] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [currentInstruction, setCurrentInstruction] = useState('')

  const startNavigation = () => {
    setIsNavigating(true)
    setCurrentInstruction('Starting navigation... Getting your location.')
    
    // Simulate voice instruction
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Starting navigation. Getting your current location.')
      window.speechSynthesis.speak(utterance)
    }

    // Simulate navigation updates
    setTimeout(() => {
      setCurrentInstruction('Head North for 2.5 kilometers towards your destination.')
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Head North for 2.5 kilometers towards your destination.')
        window.speechSynthesis.speak(utterance)
      }
    }, 3000)
  }

  const stopNavigation = () => {
    setIsNavigating(false)
    setCurrentInstruction('')
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (!voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Test Navigation</h1>
                <p className="text-gray-600">Testing voice assistant functionality</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleVoice}
                  className={`p-3 rounded-lg transition-colors ${
                    voiceEnabled 
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                  title={voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
                >
                  {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-[60vh] bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-md mx-4">
              <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Navigation Test</h3>
              <p className="text-gray-600 mb-4">
                Test the voice assistant navigation system
              </p>
              <p className="text-sm text-gray-500">
                Click the start button below to test voice navigation.
              </p>
              
              {/* Status Display */}
              {isNavigating && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">Navigating</span>
                  </div>
                  {currentInstruction && (
                    <p className="text-sm text-blue-800">{currentInstruction}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {!isNavigating ? (
                <button
                  onClick={startNavigation}
                  className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Voice Navigation</span>
                </button>
              ) : (
                <button
                  onClick={stopNavigation}
                  className="flex-1 bg-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-3"
                >
                  <Square className="h-5 w-5" />
                  <span>Stop Navigation</span>
                </button>
              )}
              
              <button
                onClick={() => alert('This would open Google Maps')}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-3"
              >
                <Navigation className="h-5 w-5" />
                <span>Open in Google Maps</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Test Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click "Start Voice Navigation" to test the voice assistant</li>
                <li>• The system will speak instructions if voice is enabled</li>
                <li>• Toggle voice on/off using the speaker icon</li>
                <li>• Click "Stop Navigation" to end the test</li>
                <li>• This is a test page - no actual GPS tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
