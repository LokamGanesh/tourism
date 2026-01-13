import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

// GET all places
export async function GET(request: NextRequest) {
  try {
    const places = await prisma.place.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ places }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST create new place
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
    
    // Map MongoDB fields to Prisma schema
    const placeData = {
      name: body.name,
      location: body.location,
      description: body.description,
      category: body.category,
      images: body.images || [],
      coordinates: body.coordinates || {},
      rating: body.rating || 0,
      reviews: body.reviews || 0,
      entryFee: body.entryFee ? parseFloat(body.entryFee) : null,
      timings: body.timings || null,
      bestSeason: body.bestTime || null
    }
    
    const place = await prisma.place.create({
      data: placeData
    })

    return NextResponse.json({ place, message: 'Place created successfully' }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT update place
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
    const placeId = _id || id
    
    // Map MongoDB fields to Prisma schema
    const updateData: any = {
      name: rest.name,
      location: rest.location,
      description: rest.description,
      category: rest.category,
      images: rest.images || [],
      coordinates: rest.coordinates || {},
      rating: rest.rating || 0,
      reviews: rest.reviews || 0,
      timings: rest.timings || null,
      bestSeason: rest.bestTime || null
    }
    
    if (rest.entryFee !== undefined) {
      updateData.entryFee = rest.entryFee ? parseFloat(rest.entryFee) : null
    }
    
    const place = await prisma.place.update({
      where: { id: placeId },
      data: updateData
    })

    return NextResponse.json({ place, message: 'Place updated successfully' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE place
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
      return NextResponse.json({ error: 'Place ID is required' }, { status: 400 })
    }
    
    const place = await prisma.place.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Place deleted successfully' }, { status: 200 })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
