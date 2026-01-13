'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, ChevronDown, Globe, User } from 'lucide-react'

interface NavbarProps {
  user?: any
}

export default function Navbar({ user: propUser }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exploreDropdown, setExploreDropdown] = useState(false)
  const [servicesDropdown, setServicesDropdown] = useState(false)
  const [user, setUser] = useState<any>(propUser)

  // Auto-detect user from localStorage if not provided as prop
  useEffect(() => {
    if (!propUser) {
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (userData && token) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing user data:', error)
          // Clear invalid data
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    } else {
      setUser(propUser)
    }
  }, [propUser])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    window.location.href = '/welcome'
  }

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 w-full z-[9998] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Jharkhand</span>
                <span className="text-sm text-primary-600 block leading-none">Tourism</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2">
              Home
            </Link>
            
            {/* Explore Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setExploreDropdown(!exploreDropdown)}
                onMouseEnter={() => setExploreDropdown(true)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                <span>Explore</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${exploreDropdown ? 'rotate-180' : ''}`} />
              </button>
              {exploreDropdown && (
                <div
                  onMouseLeave={() => setExploreDropdown(false)}
                  className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-[9999]"
                >
                  <Link 
                    href="/places" 
                    onClick={() => setExploreDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Tourist Places
                  </Link>
                  <Link 
                    href="/handicrafts" 
                    onClick={() => setExploreDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Handicrafts
                  </Link>
                  <Link 
                    href="/events" 
                    onClick={() => setExploreDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Events & Festivals
                  </Link>
                </div>
              )}
            </div>
            
            {/* Services Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setServicesDropdown(!servicesDropdown)}
                onMouseEnter={() => setServicesDropdown(true)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
              >
                <span>Services</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${servicesDropdown ? 'rotate-180' : ''}`} />
              </button>
              {servicesDropdown && (
                <div
                  onMouseLeave={() => setServicesDropdown(false)}
                  className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-[9999]"
                >
                  <Link 
                    href="/budget-planner" 
                    onClick={() => setServicesDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Trip Planner
                  </Link>
                  <Link 
                    href="/hotels" 
                    onClick={() => setServicesDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Hotels & Restaurants
                  </Link>
                  <Link 
                    href="/verified-travels" 
                    onClick={() => setServicesDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Verified Travels
                  </Link>
                </div>
              )}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 ml-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">EN</span>
              </button>
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Welcome, {user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/auth" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <div className="px-4 pt-4 pb-6 space-y-3 bg-white">
              <Link href="/" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
                Home
              </Link>
              
              {/* Mobile Explore Section */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Explore</div>
                <Link href="/places" className="block py-2 pl-4 text-gray-700 hover:text-primary-600">
                  Tourist Places
                </Link>
                <Link href="/handicrafts" className="block py-2 pl-4 text-gray-700 hover:text-primary-600">
                  Handicrafts
                </Link>
                <Link href="/events" className="block py-2 pl-4 text-gray-700 hover:text-primary-600">
                  Events & Festivals
                </Link>
              </div>
              
              {/* Mobile Services Section */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Services</div>
                <Link href="/budget-planner" className="block py-2 pl-4 text-gray-700 hover:text-primary-600">
                  Trip Planner
                </Link>
                <Link href="/hotels" className="block py-2 pl-4 text-gray-700 hover:text-primary-600">
                  Hotels & Restaurants
                </Link>
                <Link href="/verified-travels" className="block py-2 pl-4 text-gray-700 hover:text-primary-600">
                  Verified Travels
                </Link>
              </div>
              
              {/* Mobile Actions */}
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Welcome, {user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Language</span>
                    </button>
                    <Link href="/auth" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
