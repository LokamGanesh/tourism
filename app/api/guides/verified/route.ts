import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

// Fallback verified guides data (for when database is not available)
const FALLBACK_VERIFIED_GUIDES = [
  {
    _id: 'guide_001',
    name: 'Meera Gupta',
    email: 'meera.gupta@example.com',
    mobile: '+919876543211',
    licenseNumber: 'JH-GUIDE-2024-001',
    experience: 6,
    languages: ['English', 'Hindi', 'Odia'],
    specializations: ['Nature Tours', 'Tribal Culture', 'Waterfall Expeditions'],
    rating: 4.8,
    totalTrips: 127,
    isVerified: true,
    location: 'Ranchi, Jharkhand',
    bio: 'Passionate nature enthusiast with 6+ years of experience guiding tourists through Jharkhand\'s pristine forests and tribal villages. Specialized in eco-tourism and cultural immersion experiences.',
    profileImage: 'https://source.unsplash.com/featured/400x400/?tour%20guide%20India',
    achievements: ['Best Nature Guide 2023', 'Eco-Tourism Ambassador', 'Tribal Culture Expert'],
    pricePerDay: 2500,
    availability: 'Available 7 days a week',
    certifications: ['Wilderness First Aid', 'Eco-Tourism Certified', 'Cultural Heritage Guide'],
    gallery: [
      'https://source.unsplash.com/featured/300x200/?Jharkhand%20tour',
      'https://source.unsplash.com/featured/300x200/?Netarhat%20view',
      'https://picsum.photos/300/200?random=904'
    ]
  },
  {
    _id: 'guide_002',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    mobile: '+919876543212',
    licenseNumber: 'JH-GUIDE-2024-002',
    experience: 8,
    languages: ['Hindi', 'English', 'Bengali'],
    specializations: ['Adventure Tours', 'Wildlife Safari', 'Trekking'],
    rating: 4.9,
    totalTrips: 203,
    isVerified: true,
    location: 'Jamshedpur, Jharkhand',
    bio: 'Adventure specialist and wildlife expert with 8+ years of experience leading thrilling expeditions through Jharkhand\'s national parks and rugged terrains. Expert in rock climbing and jungle survival.',
    profileImage: 'https://picsum.photos/400/400?random=905',
    achievements: ['Adventure Guide of the Year 2022', 'Wildlife Photography Expert', 'Mountain Rescue Certified'],
    pricePerDay: 3000,
    availability: 'Available weekends and holidays',
    certifications: ['Advanced Wilderness Training', 'Wildlife Safari Guide', 'Rock Climbing Instructor'],
    gallery: [
      'https://picsum.photos/300/200?random=906',
      'https://picsum.photos/300/200?random=907',
      'https://picsum.photos/300/200?random=908'
    ]
  },
  {
    _id: 'guide_003',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    mobile: '+919876543213',
    licenseNumber: 'JH-GUIDE-2024-003',
    experience: 4,
    languages: ['English', 'Hindi'],
    specializations: ['Cultural Tours', 'Historical Sites', 'Photography'],
    rating: 4.7,
    totalTrips: 89,
    isVerified: true,
    location: 'Dhanbad, Jharkhand',
    bio: 'Cultural heritage enthusiast and professional photographer with deep knowledge of Jharkhand\'s historical monuments and architectural marvels. Specializes in heritage walks and photo tours.',
    profileImage: 'https://picsum.photos/400/400?random=909',
    achievements: ['Heritage Photography Award', 'Cultural Ambassador', 'Historical Research Contributor'],
    pricePerDay: 2200,
    availability: 'Available Tuesday to Sunday',
    certifications: ['Heritage Site Guide', 'Professional Photography', 'Cultural Tourism Specialist'],
    gallery: [
      'https://picsum.photos/300/200?random=910',
      'https://picsum.photos/300/200?random=911',
      'https://picsum.photos/300/200?random=912'
    ]
  },
  {
    _id: 'guide_004',
    name: 'Amit Singh',
    email: 'amit.singh@example.com',
    mobile: '+919876543214',
    licenseNumber: 'JH-GUIDE-2024-004',
    experience: 10,
    languages: ['Hindi', 'English', 'Santali'],
    specializations: ['Tribal Culture', 'Village Tours', 'Handicrafts'],
    rating: 4.9,
    totalTrips: 245,
    isVerified: true,
    location: 'Dumka, Jharkhand',
    bio: 'Veteran guide with 10+ years of experience in tribal tourism and traditional handicrafts. Native Santali speaker with deep connections to local tribal communities and authentic cultural experiences.',
    profileImage: 'https://picsum.photos/400/400?random=913',
    achievements: ['Tribal Tourism Pioneer', 'Handicraft Preservation Award', 'Community Development Leader'],
    pricePerDay: 2800,
    availability: 'Available Monday to Saturday',
    certifications: ['Tribal Culture Expert', 'Handicraft Artisan', 'Community Tourism Leader'],
    gallery: [
      'https://picsum.photos/300/200?random=914',
      'https://picsum.photos/300/200?random=915',
      'https://picsum.photos/300/200?random=916'
    ]
  },
  {
    _id: 'guide_005',
    name: 'Sunita Devi',
    email: 'sunita.devi@example.com',
    mobile: '+919876543215',
    licenseNumber: 'JH-GUIDE-2024-005',
    experience: 5,
    languages: ['Hindi', 'English', 'Odia'],
    specializations: ['Nature Tours', 'Bird Watching', 'Eco Tourism'],
    rating: 4.6,
    totalTrips: 112,
    isVerified: true,
    location: 'Bokaro, Jharkhand',
    bio: 'Dedicated ornithologist and eco-tourism advocate with 5+ years of experience in bird watching tours and nature conservation. Expert in identifying over 200 bird species native to Jharkhand.',
    profileImage: 'https://picsum.photos/400/400?random=917',
    achievements: ['Bird Conservation Award', 'Eco-Tourism Advocate', 'Nature Photography Enthusiast'],
    pricePerDay: 2300,
    availability: 'Available early mornings and evenings',
    certifications: ['Ornithology Certified', 'Eco-Tourism Guide', 'Nature Conservation Specialist'],
    gallery: [
      'https://picsum.photos/300/200?random=918',
      'https://picsum.photos/300/200?random=919',
      'https://picsum.photos/300/200?random=920'
    ]
  },
  {
    _id: 'guide_006',
    name: 'Vikash Mahato',
    email: 'vikash.mahato@example.com',
    mobile: '+919876543216',
    licenseNumber: 'JH-GUIDE-2024-006',
    experience: 7,
    languages: ['Hindi', 'English', 'Bengali'],
    specializations: ['Adventure Tours', 'Rock Climbing', 'Cave Exploration'],
    rating: 4.8,
    totalTrips: 156,
    isVerified: true,
    location: 'Hazaribagh, Jharkhand',
    bio: 'Extreme adventure specialist with 7+ years of experience in rock climbing, rappelling, and cave exploration. Certified rescue expert with extensive knowledge of Jharkhand\'s hidden caves and climbing spots.',
    profileImage: 'https://picsum.photos/400/400?random=921',
    achievements: ['Extreme Sports Champion', 'Cave Exploration Pioneer', 'Adventure Safety Expert'],
    pricePerDay: 3200,
    availability: 'Available weekends and adventure seasons',
    certifications: ['Rock Climbing Instructor', 'Cave Rescue Certified', 'Adventure Sports Safety'],
    gallery: [
      'https://picsum.photos/300/200?random=922',
      'https://picsum.photos/300/200?random=923',
      'https://picsum.photos/300/200?random=924'
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    let verifiedGuides = []

    // Try to fetch from database first
    try {
      await dbConnect()
      
      // Fetch verified travel guides from database
      const dbGuides = await User.find({
        role: 'travel_guide',
        isVerified: true
      }).select('-password').lean()

      if (dbGuides && dbGuides.length > 0) {
        verifiedGuides = dbGuides.map(guide => ({
          _id: guide._id.toString(),
          name: guide.name,
          email: guide.email,
          mobile: guide.mobile,
          licenseNumber: guide.licenseNumber || 'N/A',
          experience: guide.experience || 0,
          languages: guide.languages || ['Hindi', 'English'],
          specializations: guide.specializations || ['General Tours'],
          rating: guide.rating || 4.5,
          totalTrips: guide.totalTrips || 0,
          isVerified: guide.isVerified,
          location: guide.location || 'Jharkhand',
          bio: guide.bio || 'Experienced tourist guide in Jharkhand.'
        }))
      }
    } catch (dbError) {
      console.log('Database not available, using fallback data')
    }

    // If no database guides found, use fallback data
    if (verifiedGuides.length === 0) {
      verifiedGuides = FALLBACK_VERIFIED_GUIDES
    }

    return NextResponse.json({
      success: true,
      message: 'Verified guides fetched successfully',
      guides: verifiedGuides,
      total: verifiedGuides.length
    })

  } catch (error) {
    console.error('Error fetching verified guides:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch verified guides',
        guides: FALLBACK_VERIFIED_GUIDES,
        total: FALLBACK_VERIFIED_GUIDES.length
      },
      { status: 500 }
    )
  }
}
