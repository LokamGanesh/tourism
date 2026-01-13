import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'desc' }
    })
    return NextResponse.json({ events }, { status: 200 })
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
    
    const eventData = {
      name: body.title || body.name,
      description: body.description,
      location: body.location,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      category: body.category,
      images: body.images || [],
      ticketPrice: body.ticketPrice?.free ? 0 : (body.ticketPrice?.min || 0),
      maxCapacity: body.capacity || null,
      organizer: body.organizer?.name || '',
      contactInfo: body.organizer?.email || body.organizer?.contact || null,
      isActive: body.isActive !== false
    }
    
    const event = await prisma.event.create({
      data: eventData
    })

    return NextResponse.json({ event, message: 'Event created successfully' }, { status: 201 })
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
    const eventId = _id || id
    
    const updateData: any = {
      name: rest.title || rest.name,
      description: rest.description,
      location: rest.location,
      startDate: new Date(rest.startDate),
      endDate: new Date(rest.endDate),
      category: rest.category,
      images: rest.images || [],
      ticketPrice: rest.ticketPrice?.free ? 0 : (rest.ticketPrice?.min || 0),
      maxCapacity: rest.capacity || null,
      organizer: rest.organizer?.name || '',
      contactInfo: rest.organizer?.email || rest.organizer?.contact || null,
      isActive: rest.isActive !== false
    }
    
    const event = await prisma.event.update({
      where: { id: eventId },
      data: updateData
    })

    return NextResponse.json({ event, message: 'Event updated successfully' }, { status: 200 })
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
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }
    
    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
