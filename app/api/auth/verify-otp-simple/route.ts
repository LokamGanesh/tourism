import { NextRequest, NextResponse } from 'next/server'

// Simple OTP verification without database (for testing)
export async function POST(request: NextRequest) {
  console.log('Simple Verify OTP API called')
  try {
    const { mobile, otp, type, userData } = await request.json()
    console.log('Request data:', { mobile, otp: otp ? '***' : null, type })
    
    if (!mobile || !otp) {
      return NextResponse.json(
        { error: 'Mobile number and OTP are required' },
        { status: 400 }
      )
    }

    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`
    
    // Check stored OTP (from memory - testing only)
    const storedOTP = global.testOTP
    
    if (!storedOTP || storedOTP.mobile !== formattedMobile) {
      return NextResponse.json(
        { error: 'No OTP found for this mobile number' },
        { status: 400 }
      )
    }

    if (storedOTP.expiry < Date.now()) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      )
    }

    if (storedOTP.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Clear the OTP
    delete global.testOTP

    // Create user response with actual form data
    const testUser = {
      id: 'user-' + Date.now(),
      name: userData?.name || 'User',
      mobile: formattedMobile,
      email: userData?.email || undefined,
      role: userData?.role || 'tourist',
      isVerified: true,
      // Provider-specific fields
      ...(userData?.role === 'travel_provider' && {
        businessName: userData.businessName,
        businessType: userData.businessType,
        licenseNumber: userData.licenseNumber,
        address: userData.address,
        description: userData.description,
        services: userData.services
      }),
      ...(userData?.role === 'hotel_provider' && {
        hotelName: userData.hotelName,
        hotelType: userData.hotelType,
        address: userData.address,
        description: userData.description,
        amenities: userData.amenities
      }),
      ...(userData?.role === 'restaurant_provider' && {
        restaurantName: userData.restaurantName,
        cuisineType: userData.cuisineType,
        address: userData.address,
        description: userData.description,
        specialties: userData.specialties
      })
    }

    // Store user data for future login attempts (testing only)
    if (type === 'signup') {
      if (!global.signupUsers) {
        global.signupUsers = []
      }
      global.signupUsers.push(testUser)
      console.log('User stored for future login:', testUser.name)
    }

    // Initialize test provider accounts if they don't exist
    if (!global.testProviderAccounts) {
      global.testProviderAccounts = [
        {
          id: 'hotel-provider-1',
          name: 'Sunita Devi',
          mobile: '+919876543210',
          email: 'sunita@greenvalley.com',
          role: 'hotel_provider',
          isVerified: true,
          hotelName: 'Green Valley Resort',
          hotelType: 'resort',
          address: 'Netarhat Hill Station, Jharkhand',
          description: 'Luxury eco-resort with stunning valley views',
          amenities: 'WiFi, AC, Restaurant, Pool, Spa, Room Service'
        },
        {
          id: 'restaurant-provider-1',
          name: 'Manoj Singh',
          mobile: '+919876543211',
          email: 'manoj@tribalflavors.com',
          role: 'restaurant_provider',
          isVerified: true,
          restaurantName: 'Tribal Flavors Restaurant',
          cuisineType: ['Indian', 'Tribal', 'North Indian'],
          address: 'Main Market, Ranchi, Jharkhand',
          description: 'Authentic tribal cuisine with traditional cooking methods',
          specialties: ['Bamboo Shoot Curry', 'Tribal Thali', 'Handia']
        },
        {
          id: 'travel-provider-1',
          name: 'Vikash Kumar',
          mobile: '+919876543212',
          email: 'vikash@jhadventures.com',
          role: 'travel_provider',
          isVerified: true,
          businessName: 'Jharkhand Adventures',
          businessType: 'travel_agency',
          licenseNumber: 'JH-TA-2024-001',
          address: 'Tourism Complex, Ranchi, Jharkhand',
          description: 'Premium travel services for Jharkhand tourism',
          services: 'Tour Packages, Transportation, Guide Services, Accommodation'
        }
      ]
    }

    // Create a simple token (not secure - for testing only)
    const testToken = 'test-jwt-token-' + Date.now()

    return NextResponse.json({
      success: true,
      message: type === 'login' ? 'Login successful' : 'Account created successfully',
      user: testUser,
      token: testToken
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
