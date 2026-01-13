import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ hotels }, { status: 200 })
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
    
    const hotelData = {
      name: body.name,
      type: body.type,
      address: body.address || body.location,
      description: body.description,
      amenities: body.amenities || [],
      images: body.images || [],
      coordinates: body.coordinates || {},
      rating: body.rating || 0,
      totalReviews: body.reviews || 0,
      priceRangeMin: body.priceRange?.min || 0,
      priceRangeMax: body.priceRange?.max || 0,
      isActive: body.isActive !== false
    }
    
    const hotel = await prisma.hotel.create({
      data: hotelData
    })

    return NextResponse.json({ hotel, message: 'Hotel created successfully' }, { status: 201 })
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
    const hotelId = _id || id
    
    const updateData: any = {
      name: rest.name,
      type: rest.type,
      address: rest.address || rest.location,
      description: rest.description,
      amenities: rest.amenities || [],
      images: rest.images || [],
      coordinates: rest.coordinates || {},
      rating: rest.rating || 0,
      totalReviews: rest.reviews || 0,
      priceRangeMin: rest.priceRange?.min || 0,
      priceRangeMax: rest.priceRange?.max || 0,
      isActive: rest.isActive !== false
    }
    
    const hotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: updateData
    })

    return NextResponse.json({ hotel, message: 'Hotel updated successfully' }, { status: 200 })
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
      return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 })
    }
    
    await prisma.hotel.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Hotel deleted successfully' }, { status: 200 })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
