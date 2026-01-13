import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      console.error('Upload error: No token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    
    if (!decoded) {
      console.error('Upload error: Invalid token')
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    if (decoded.role !== 'admin') {
      console.error('Upload error: User is not admin')
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    
    if (!files || files.length === 0) {
      console.error('Upload error: No files in request')
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    console.log(`Processing ${files.length} file(s)...`)

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      console.log('Creating uploads directory:', uploadsDir)
      await mkdir(uploadsDir, { recursive: true })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      if (file.size === 0) {
        console.log('Skipping empty file')
        continue
      }

      console.log(`Processing file: ${file.name}, size: ${file.size} bytes`)

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(7)
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${randomString}.${extension}`
      
      const filepath = path.join(uploadsDir, filename)
      await writeFile(filepath, buffer)
      
      console.log(`File saved: ${filename}`)
      
      // Return URL path
      uploadedUrls.push(`/uploads/${filename}`)
    }

    console.log(`Upload successful: ${uploadedUrls.length} file(s)`)

    return NextResponse.json({ 
      success: true,
      urls: uploadedUrls,
      message: `${uploadedUrls.length} file(s) uploaded successfully`
    }, { status: 200 })

  } catch (error: any) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json({ 
      error: error.message || 'Failed to upload files',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
