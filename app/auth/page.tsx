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
    const { name, value } = e.target
    
    // Handle mobile number input - only allow digits and limit to 10 digits
    if (name === 'mobile') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
      setFormData({
        ...formData,
        [name]: digitsOnly
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSendOTP = async () => {
    // Validate email
    if (!formData.email) {
      setError('Please enter your email address')
      return
    }

    // Validate if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate mobile number for signup
    if (!isLogin) {
      if (!formData.mobile) {
        setError('Please enter your mobile number')
        return
      }
      if (formData.mobile.length !== 10) {
        setError('Mobile number must be exactly 10 digits')
        return
      }
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
          email: formData.email.toLowerCase().trim(),
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
      if (!formData.email) {
        setError('Email is required')
        setLoading(false)
        return
      }

      console.log('Verifying OTP with email:', formData.email)
      
      const payload: any = {
        email: formData.email.toLowerCase().trim(),
        otp: otp,
        type: isLogin ? 'login' : 'signup'
      }

      if (!isLogin) {
        const actualRole = selectedRole === 'others' ? selectedSubRole : selectedRole;
        payload.userData = {
          name: formData.name,
          email: formData.email.toLowerCase().trim(), // Use the same email
          mobile: formData.mobile, // Send mobile without +91, backend will add it
          password: formData.password,
          role: actualRole,
          ...(actualRole === 'travel_provider' && {
            businessName: formData.businessName,
            businessType: formData.businessType,
            licenseNumber: formData.licenseNumber,
            address: formData.address,
            description: formData.description,
            services: formData.services ? formData.services.split(',').map(service => service.trim()).filter(service => service) : []
          }),
          ...(actualRole === 'hotel_provider' && {
            hotelName: formData.hotelName,
            hotelType: formData.hotelType,
            address: formData.address,
            description: formData.description,
            amenities: formData.amenities ? formData.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity) : []
          }),
          ...(actualRole === 'restaurant_provider' && {
            restaurantName: formData.restaurantName,
            cuisineType: formData.cuisineType ? formData.cuisineType.split(',').map(cuisine => cuisine.trim()).filter(cuisine => cuisine) : [],
            address: formData.address,
            description: formData.description,
            specialties: formData.specialties ? formData.specialties.split(',').map(specialty => specialty.trim()).filter(specialty => specialty) : []
          })
        }
      }

      console.log('Sending payload:', { ...payload, otp: '***' })

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Jharkhand Tourism
              </h1>
              <p className="text-sm text-gray-600 font-medium">Explore the Heart of India</p>
            </div>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          {/* Toggle Login/Signup */}
          {!forgotPasswordMode && !resetPasswordMode && (
            <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1.5 mb-6 shadow-inner">
              <button
                onClick={() => {
                  setIsLogin(true)
                  setOtpStep(false)
                  setError('')
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isLogin 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900'
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
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Forgot Password Header */}
          {forgotPasswordMode && (
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Forgot Password
              </h3>
              <p className="text-sm text-gray-600">Enter your email or mobile number to reset your password</p>
            </div>
          )}

          {/* Reset Password Header */}
          {resetPasswordMode && (
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Reset Password
              </h3>
              <p className="text-sm text-gray-600">Enter the OTP sent to your mobile and your new password</p>
            </div>
          )}

          {/* Role Selection (only for signup) */}
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose your role
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(roleIcons).map(([role, Icon]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role as any)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedRole === role
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md transform scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`h-7 w-7 mx-auto mb-2 transition-colors ${
                      selectedRole === role ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <div className={`text-sm font-semibold capitalize ${
                      selectedRole === role ? 'text-blue-700' : 'text-gray-700'
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
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose your service type
              </label>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(subRoleOptions).map(([subRole, label]) => (
                  <button
                    key={subRole}
                    type="button"
                    onClick={() => setSelectedSubRole(subRole as any)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedSubRole === subRole
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md transform scale-102'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`text-sm font-semibold ${
                      selectedSubRole === subRole ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Email/Mobile Input for Login and Forgot Password */}
            {(isLogin || forgotPasswordMode) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder="Enter your email or mobile number"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            )}

            {/* Email Address for Signup */}
            {!isLogin && !forgotPasswordMode && !resetPasswordMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your-email@example.com"
                  required
                  disabled={otpStep}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 placeholder-gray-400"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-600 font-medium">+91</span>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    required
                    disabled={otpStep}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 placeholder-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number without country code</p>
              </div>
            )}

            {otpStep && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center text-2xl tracking-widest font-semibold text-gray-900 placeholder-gray-400"
                />
                <p className="text-sm text-gray-600 mt-2 text-center">
                  OTP sent to <span className="font-semibold text-blue-600">{formData.email || formData.mobile}</span>
                </p>
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Resend OTP in <span className="font-semibold text-blue-600">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 block mx-auto hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}

            {/* Password for Login */}
            {isLogin && !forgotPasswordMode && !resetPasswordMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Password for Signup */}
            {!isLogin && !forgotPasswordMode && !resetPasswordMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest text-gray-900 placeholder-gray-400"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </>
                )}
              </>
            )}


            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 animate-shake">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Please wait...
                </span>
              ) : (
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
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
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
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors inline-flex items-center gap-1 hover:gap-2"
                >
                  <span>←</span> Back to Login
                </button>
              </div>
            )}
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors inline-flex items-center gap-1 hover:gap-2"
            >
              <span>←</span> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
