'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, User, Shield, Building, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<'tourist' | 'others'>('tourist')
  const [selectedSubRole, setSelectedSubRole] = useState<'travel_provider' | 'hotel_provider' | 'restaurant_provider'>('travel_provider')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [resetPasswordMode, setResetPasswordMode] = useState(false)
  const [resetIdentifier, setResetIdentifier] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    identifier: '', // Can be email or mobile
    mobile: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    name: '',
    email: '',
    licenseNumber: '',
    experience: '',
    languages: '',
    specializations: '',
    department: '',
    position: '',
    // Provider specific fields
    businessName: '',
    businessType: '',
    hotelName: '',
    hotelType: '',
    restaurantName: '',
    cuisineType: '',
    address: '',
    description: '',
    services: '',
    amenities: '',
    specialties: ''
  })

  // Handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')

    if (mode === 'login') {
      setIsLogin(true)
    } else if (mode === 'signup') {
      setIsLogin(false)
    }
  }, [])

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSendOTP = async () => {
    if (!formData.mobile) {
      setError('Please enter your mobile number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-otp-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobile: formData.mobile,
          type: isLogin ? 'login' : 'signup'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      setOtpSent(true)
      setOtpStep(true)
      setResendTimer(60) // 60 seconds countdown
      setError('')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload: any = {
        mobile: formData.mobile,
        otp: otp,
        type: isLogin ? 'login' : 'signup'
      }

      if (!isLogin) {
        const actualRole = selectedRole === 'others' ? selectedSubRole : selectedRole;
        payload.userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: actualRole,
          ...(actualRole === 'travel_provider' && {
            businessName: formData.businessName,
            businessType: formData.businessType,
            licenseNumber: formData.licenseNumber,
            address: formData.address,
            description: formData.description,
            services: formData.services.split(',').map(service => service.trim()).filter(service => service)
          }),
          ...(actualRole === 'hotel_provider' && {
            hotelName: formData.hotelName,
            hotelType: formData.hotelType,
            address: formData.address,
            description: formData.description,
            amenities: formData.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity)
          }),
          ...(actualRole === 'restaurant_provider' && {
            restaurantName: formData.restaurantName,
            cuisineType: formData.cuisineType.split(',').map(cuisine => cuisine.trim()).filter(cuisine => cuisine),
            address: formData.address,
            description: formData.description,
            specialties: formData.specialties.split(',').map(specialty => specialty.trim()).filter(specialty => specialty)
          })
        }
      }

      const response = await fetch('/api/auth/verify-otp-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed')
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)

      // Redirect based on role
      switch (data.user.role) {
        case 'tourist':
          router.push('/main')
          break
        case 'travel_guide':
          router.push('/dashboard/travel-guide')
          break
        case 'travel_provider':
          router.push('/dashboard/travel-provider')
          break
        case 'hotel_provider':
          router.push('/dashboard/hotel-provider')
          break
        case 'restaurant_provider':
          router.push('/dashboard/restaurant-provider')
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

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginWithPassword = async () => {
    if (!formData.identifier || !formData.password) {
      setError('Please enter email/mobile and password')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)

      // Redirect based on role
      switch (data.user.role) {
        case 'tourist':
          router.push('/main')
          break
        case 'travel_guide':
          router.push('/dashboard/travel-guide')
          break
        case 'travel_provider':
          router.push('/dashboard/travel-provider')
          break
        case 'hotel_provider':
          router.push('/dashboard/hotel-provider')
          break
        case 'restaurant_provider':
          router.push('/dashboard/restaurant-provider')
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

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.identifier) {
      setError('Please enter your email or mobile number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: formData.identifier
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset OTP')
      }

      setResetIdentifier(formData.identifier)
      setForgotPasswordMode(false)
      setResetPasswordMode(true)
      setError('')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!otp || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill all fields')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: resetIdentifier,
          otp: otp,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed')
      }

      // Reset form and go back to login
      setResetPasswordMode(false)
      setForgotPasswordMode(false)
      setOtp('')
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }))
      setError('')
      alert('Password reset successful! You can now login with your new password.')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (forgotPasswordMode) {
      await handleForgotPassword()
    } else if (resetPasswordMode) {
      await handleResetPassword()
    } else if (isLogin) {
      await handleLoginWithPassword()
    } else {
      // Signup flow - keep OTP verification for signup
      if (!otpStep) {
        await handleSendOTP()
      } else {
        await handleVerifyOTP()
      }
    }
  }

  const roleIcons = {
    tourist: User,
    others: Building
  }

  const roleDescriptions = {
    tourist: 'Explore amazing destinations and book your perfect trip',
    others: 'Provide travel, hotel, or restaurant services to tourists'
  }

  const subRoleOptions = {
    travel_provider: 'Travel Services',
    hotel_provider: 'Hotel Services',
    restaurant_provider: 'Restaurant Services'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Jharkhand Tourism</h1>
              <p className="text-sm text-gray-800">Explore the Heart of India</p>
            </div>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Toggle Login/Signup */}
          {!forgotPasswordMode && !resetPasswordMode && (
            <div className="flex bg-gray-100 rounded-md p-1 mb-4">
              <button
                onClick={() => {
                  setIsLogin(true)
                  setOtpStep(false)
                  setError('')
                }}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${isLogin ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-800'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false)
                  setOtpStep(false)
                  setError('')
                }}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${!isLogin ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-800'
                  }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Forgot Password Header */}
          {forgotPasswordMode && (
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Forgot Password</h3>
              <p className="text-sm text-gray-800">Enter your email or mobile number to reset your password</p>
            </div>
          )}

          {/* Reset Password Header */}
          {resetPasswordMode && (
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
              <p className="text-sm text-gray-800">Enter the OTP sent to your mobile and your new password</p>
            </div>
          )}

          {/* Role Selection (only for signup) */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Choose your role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(roleIcons).map(([role, Icon]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role as any)}
                    className={`p-3 rounded-md border transition-all ${selectedRole === role
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${selectedRole === role ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    <div className={`text-sm font-bold capitalize ${selectedRole === role ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                      {role.replace('_', ' ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sub-role Selection (only when "others" is selected) */}
          {!isLogin && selectedRole === 'others' && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Choose your service type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(subRoleOptions).map(([subRole, label]) => (
                  <button
                    key={subRole}
                    type="button"
                    onClick={() => setSelectedSubRole(subRole as any)}
                    className={`p-3 rounded-md border transition-all text-left ${selectedSubRole === subRole
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-800'
                      }`}
                  >
                    <div className="text-sm font-bold">{label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Email/Mobile Input for Login and Forgot Password */}
            {(isLogin || forgotPasswordMode) && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder="Enter your email or mobile number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Mobile Number for Signup */}
            {!isLogin && !forgotPasswordMode && !resetPasswordMode && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  required
                  disabled={otpStep}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={otpStep}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            )}

            {otpStep && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                />
                <p className="text-sm text-gray-600 mt-1">
                  OTP sent to {formData.mobile}
                </p>
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500 mt-1">
                    Resend OTP in {resendTimer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}

            {/* Password for Login */}
            {isLogin && !forgotPasswordMode && !resetPasswordMode && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Password for Signup */}
            {!isLogin && !forgotPasswordMode && !resetPasswordMode && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={otpStep}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Reset Password Fields */}
            {resetPasswordMode && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Provider-specific fields */}
            {!isLogin && selectedRole === 'others' && (
              <>
                {/* Common fields for all providers */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={otpStep}
                    placeholder="Complete business address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={otpStep}
                    placeholder="Describe your business and services"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                {/* Travel Provider specific fields */}
                {selectedSubRole === 'travel_provider' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        required
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">Select business type</option>
                        <option value="travel_agency">Travel Agency</option>
                        <option value="tour_operator">Tour Operator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        required
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        Services (comma separated)
                      </label>
                      <input
                        type="text"
                        name="services"
                        value={formData.services}
                        onChange={handleInputChange}
                        placeholder="Tour packages, Transportation, Guide services"
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </>
                )}

                {/* Hotel Provider specific fields */}
                {selectedSubRole === 'hotel_provider' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        Hotel Name
                      </label>
                      <input
                        type="text"
                        name="hotelName"
                        value={formData.hotelName}
                        onChange={handleInputChange}
                        required
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        Hotel Type
                      </label>
                      <select
                        name="hotelType"
                        value={formData.hotelType}
                        onChange={handleInputChange}
                        required
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">Select hotel type</option>
                        <option value="hotel">Hotel</option>
                        <option value="resort">Resort</option>
                        <option value="guesthouse">Guest House</option>
                        <option value="lodge">Lodge</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        Amenities (comma separated)
                      </label>
                      <input
                        type="text"
                        name="amenities"
                        value={formData.amenities}
                        onChange={handleInputChange}
                        placeholder="WiFi, AC, Restaurant, Pool, Spa"
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </>
                )}

                {/* Restaurant Provider specific fields */}
                {selectedSubRole === 'restaurant_provider' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        name="restaurantName"
                        value={formData.restaurantName}
                        onChange={handleInputChange}
                        required
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        Cuisine Type (comma separated)
                      </label>
                      <input
                        type="text"
                        name="cuisineType"
                        value={formData.cuisineType}
                        onChange={handleInputChange}
                        placeholder="Indian, Chinese, Continental, Local"
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">
                        Specialties (comma separated)
                      </label>
                      <input
                        type="text"
                        name="specialties"
                        value={formData.specialties}
                        onChange={handleInputChange}
                        placeholder="Tribal cuisine, Vegetarian, Seafood"
                        disabled={otpStep}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </>
                )}
              </>
            )}


            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (
                forgotPasswordMode ? 'Send Reset OTP' :
                  resetPasswordMode ? 'Reset Password' :
                    otpStep ? 'Verify OTP' :
                      isLogin ? 'Login' : 'Send OTP & Sign Up'
              )}
            </button>

            {/* Forgot Password Link */}
            {isLogin && !forgotPasswordMode && !resetPasswordMode && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordMode(true)
                    setError('')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Back to Login Links */}
            {(forgotPasswordMode || resetPasswordMode) && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordMode(false)
                    setResetPasswordMode(false)
                    setOtp('')
                    setError('')
                  }}
                >
                  <span className="text-sm text-gray-800 hover:text-blue-800 transition-colors">
                    ← Back to Login
                  </span>
                </button>
              </div>
            )}
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-800 hover:text-blue-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
