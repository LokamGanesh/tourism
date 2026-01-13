import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ restaurants }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    const restaurantData = {
      name: body.name,
      cuisineType: body.cuisineType || [],
      address: body.address || body.location,
      description: body.description,
      specialties: body.specialties || [],
      images: body.images || [],
      coordinates: body.coordinates || {},
      rating: body.rating || 0,
      totalReviews: body.reviews || 0,
      priceRangeMin: body.priceRange?.min || 0,
      priceRangeMax: body.priceRange?.max || 0,
      isActive: body.isActive !== false
    }
    
    const restaurant = await prisma.restaurant.create({
      data: restaurantData
    })

    return NextResponse.json({ restaurant, message: 'Restaurant created successfully' }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { _id, id, ...rest } = body
    const restaurantId = _id || id
    
    const updateData: any = {
      name: rest.name,
      cuisineType: rest.cuisineType || [],
      address: rest.address || rest.location,
      description: rest.description,
      specialties: rest.specialties || [],
      images: rest.images || [],
      coordinates: rest.coordinates || {},
      rating: rest.rating || 0,
      totalReviews: rest.reviews || 0,
      priceRangeMin: rest.priceRange?.min || 0,
      priceRangeMax: rest.priceRange?.max || 0,
      isActive: rest.isActive !== false
    }
    
    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: updateData
    })

    return NextResponse.json({ restaurant, message: 'Restaurant updated successfully' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 })
    }
    
    await prisma.restaurant.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Restaurant deleted successfully' }, { status: 200 })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
