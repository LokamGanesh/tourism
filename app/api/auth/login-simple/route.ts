import { NextRequest, NextResponse } from 'next/server'

// Simple login without database (for testing)
export async function POST(request: NextRequest) {
  console.log('Simple Login API called')
  try {
    const { identifier, password } = await request.json()
    console.log('Login attempt with identifier:', identifier)
    console.log('Password provided:', password ? '***' + password.slice(-2) : 'NO PASSWORD')
    
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Mobile and password are required' },
        { status: 400 }
      )
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

    // Check test provider accounts first
    const testProviderAccounts = global.testProviderAccounts || []
    console.log('Available provider accounts:', testProviderAccounts.map(u => ({ mobile: u.mobile, email: u.email, role: u.role })))
    
    const providerUser = testProviderAccounts.find((u: any) => {
      const isEmail = identifier.includes('@')
      if (isEmail) {
        return u.email && u.email.toLowerCase() === identifier.toLowerCase()
      } else {
        const formattedMobile = identifier.startsWith('+') ? identifier : `+91${identifier}`
        console.log('Checking mobile:', formattedMobile, 'against:', u.mobile)
        return u.mobile === formattedMobile
      }
    })
    
    console.log('Found provider user:', providerUser ? providerUser.name : 'None')

    if (providerUser && password === 'provider123') {
      // Return provider user data
      const user = {
        _id: providerUser.id,
        id: providerUser.id,
        name: providerUser.name,
        mobile: providerUser.mobile,
        email: providerUser.email,
        role: providerUser.role,
        isVerified: providerUser.isVerified,
        // Include provider-specific fields
        ...(providerUser.role === 'hotel_provider' && {
          hotelName: providerUser.hotelName,
          hotelType: providerUser.hotelType,
          address: providerUser.address,
          description: providerUser.description,
          amenities: providerUser.amenities
        }),
        ...(providerUser.role === 'restaurant_provider' && {
          restaurantName: providerUser.restaurantName,
          cuisineType: providerUser.cuisineType,
          address: providerUser.address,
          description: providerUser.description,
          specialties: providerUser.specialties
        }),
        ...(providerUser.role === 'travel_provider' && {
          businessName: providerUser.businessName,
          businessType: providerUser.businessType,
          licenseNumber: providerUser.licenseNumber,
          address: providerUser.address,
          description: providerUser.description,
          services: providerUser.services
        })
      }

      const testToken = 'test-jwt-token-' + Date.now()

      console.log('Login successful for provider:', user.name, 'Role:', user.role)

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: user,
        token: testToken
      })
    }

    // Check if this matches a previously created account from signup
    const storedUser = global.signupUsers && global.signupUsers.find((u: any) => {
      const isEmail = identifier.includes('@')
      if (isEmail) {
        return u.email && u.email.toLowerCase() === identifier.toLowerCase()
      } else {
        const formattedMobile = identifier.startsWith('+') ? identifier : `+91${identifier}`
        return u.mobile === formattedMobile
      }
    })

    if (storedUser) {
      // For simplicity in testing, accept any password for previously signed up users
      // In production, you'd verify the hashed password
      const user = {
        id: storedUser.id,
        name: storedUser.name,
        mobile: storedUser.mobile,
        email: storedUser.email,
        role: storedUser.role,
        isVerified: true
      }

      const testToken = 'test-jwt-token-' + Date.now()

      console.log('Login successful for previously signed up user:', user.name)

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: user,
        token: testToken
      })
    }

    // Simple test credentials (for testing only)
    const testUsers = [
      { 
        identifier: 'test@example.com', 
        mobile: '+919876543210',
        password: 'password123', 
        name: 'Test User', 
        role: 'tourist' 
      },
      { 
        identifier: '+919876543210', 
        mobile: '+919876543210',
        password: 'password123', 
        name: 'Test User', 
        role: 'tourist' 
      },
      { 
        identifier: 'admin@jharkhand-tourism.gov.in', 
        mobile: '+919876543210',
        password: 'Admin@2024', 
        name: 'Admin User', 
        role: 'admin' 
      },
      // Fallback credentials matching the main login API
      { 
        identifier: 'tourist@test.com', 
        mobile: '+919876543210',
        password: 'test123', 
        name: 'Arjun Patel', 
        role: 'tourist' 
      },
      { 
        identifier: 'travelguide@test.com', 
        mobile: '+919876543211',
        password: 'guide456', 
        name: 'Meera Gupta', 
        role: 'travel_guide' 
      },
      { 
        identifier: 'admin@test.com', 
        mobile: '+919876543212',
        password: 'admin789', 
        name: 'Vikash Kumar', 
        role: 'admin' 
      },
      { 
        identifier: 'govt@test.com', 
        mobile: '+919876543213',
        password: 'govt321', 
        name: 'Smt. Kavita Singh', 
        role: 'government' 
      },
      // User's specific mobile number
      { 
        identifier: '9494453388', 
        mobile: '+919494453388',
        password: 'test123', 
        name: 'Lokam Ganesh', 
        role: 'tourist' 
      },
      { 
        identifier: '+919494453388', 
        mobile: '+919494453388',
        password: 'test123', 
        name: 'Lokam Ganesh', 
        role: 'tourist' 
      }
    ]

    // Find matching user (support both email and mobile)
    console.log('Available test users:', testUsers.map(u => ({ identifier: u.identifier, mobile: u.mobile })))
    
    const user = testUsers.find(u => {
      const isEmailMatch = u.identifier.toLowerCase() === identifier.toLowerCase()
      
      // Enhanced mobile matching - handle various formats
      const normalizedIdentifier = identifier.replace(/\D/g, '') // Remove non-digits
      const normalizedUserMobile = u.mobile.replace(/\D/g, '') // Remove non-digits
      const normalizedUserIdentifier = u.identifier.replace(/\D/g, '') // Remove non-digits
      
      const isMobileMatch = u.mobile === identifier || 
                           u.mobile === `+91${identifier}` || 
                           u.mobile === `+${identifier}` ||
                           u.identifier === identifier ||
                           normalizedUserMobile === normalizedIdentifier ||
                           normalizedUserIdentifier === normalizedIdentifier
      
      const passwordMatch = u.password === password
      
      console.log(`Checking user ${u.identifier}: emailMatch=${isEmailMatch}, mobileMatch=${isMobileMatch}, passwordMatch=${passwordMatch}`)
      console.log(`  - normalizedIdentifier: ${normalizedIdentifier}`)
      console.log(`  - normalizedUserMobile: ${normalizedUserMobile}`)
      console.log(`  - normalizedUserIdentifier: ${normalizedUserIdentifier}`)
      
      return (isEmailMatch || isMobileMatch) && passwordMatch
    })

    if (!user) {
      console.log('No matching user found for identifier:', identifier)
      return NextResponse.json(
        { error: 'Invalid email/mobile or password' },
        { status: 401 }
      )
    }

    // Create test user response
    const testUser = {
      id: 'user-' + Date.now(),
      name: user.name,
      mobile: user.mobile,
      email: user.identifier.includes('@') ? user.identifier : undefined,
      role: user.role,
      isVerified: true
    }

    // Create a simple token (not secure - for testing only)
    const testToken = 'test-jwt-token-' + Date.now()

    console.log('Login successful for user:', user.name)

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: testUser,
      token: testToken
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
