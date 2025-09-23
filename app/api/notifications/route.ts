import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

// GET /api/notifications - Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Mock notifications data
    const mockNotifications = [
      {
        _id: '1',
        userId: userId,
        type: 'booking',
        title: 'New Booking Received',
        message: 'You have received a new booking for Jharkhand Wildlife Adventure',
        isRead: false,
        createdAt: '2024-01-20T10:30:00Z',
        data: {
          bookingId: 'booking123',
          customerName: 'Raj Kumar'
        }
      },
      {
        _id: '2',
        userId: userId,
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of ₹60,000 has been received for booking #123',
        isRead: false,
        createdAt: '2024-01-19T15:45:00Z',
        data: {
          amount: 60000,
          bookingId: 'booking123'
        }
      },
      {
        _id: '3',
        userId: userId,
        type: 'review',
        title: 'New Review',
        message: 'You received a 5-star review from Priya Sharma',
        isRead: true,
        createdAt: '2024-01-18T09:15:00Z',
        data: {
          rating: 5,
          reviewId: 'review456'
        }
      },
      {
        _id: '4',
        userId: userId,
        type: 'system',
        title: 'Profile Verification',
        message: 'Your business profile has been approved by admin',
        isRead: true,
        createdAt: '2024-01-15T14:20:00Z',
        data: {
          status: 'approved'
        }
      }
    ]
    
    return NextResponse.json(mockNotifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const notificationData = await request.json()
    
    // In real implementation, save to database
    const newNotification = {
      _id: Date.now().toString(),
      ...notificationData,
      isRead: false,
      createdAt: new Date().toISOString()
    }
    
    // In real implementation, you might also send push notifications, emails, etc.
    console.log(`Notification created for user: ${notificationData.userId}`)
    
    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PUT /api/notifications/[id] - Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    const updateData = await request.json()
    
    // In real implementation, update in database
    const updatedNotification = {
      ...updateData,
      isRead: true,
      readAt: new Date().toISOString()
    }
    
    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications/[id] - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // In real implementation, delete from database
    console.log(`Notification deleted by user: ${decoded.userId}`)
    
    return NextResponse.json({ message: 'Notification deleted successfully' })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}
