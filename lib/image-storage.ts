/**
 * Image Storage Utilities for PostgreSQL
 * 
 * This module provides utilities for managing images with PostgreSQL.
 * Supports both URL-based storage (recommended) and metadata management.
 */

import prisma from './prisma'

export interface ImageMetadata {
  url: string
  thumbnail?: string
  width?: number
  height?: number
  size?: number
  format?: string
  alt?: string
  tags?: string[]
}

/**
 * Store image URLs in database
 * Recommended approach: Upload to cloud storage (S3, Cloudinary) and store URLs
 */
export async function addImagesToPlace(placeId: string, imageUrls: string[]) {
  const place = await prisma.place.findUnique({
    where: { id: placeId }
  })

  if (!place) {
    throw new Error('Place not found')
  }

  const updatedImages = [...place.images, ...imageUrls]

  return await prisma.place.update({
    where: { id: placeId },
    data: { images: updatedImages }
  })
}

/**
 * Remove images from a place
 */
export async function removeImagesFromPlace(placeId: string, imageUrls: string[]) {
  const place = await prisma.place.findUnique({
    where: { id: placeId }
  })

  if (!place) {
    throw new Error('Place not found')
  }

  const updatedImages = place.images.filter(img => !imageUrls.includes(img))

  return await prisma.place.update({
    where: { id: placeId },
    data: { images: updatedImages }
  })
}

/**
 * Get all images for a specific category
 */
export async function getImagesByCategory(category: string) {
  const places = await prisma.place.findMany({
    where: { category },
    select: {
      id: true,
      name: true,
      images: true
    }
  })

  return places.flatMap(place => 
    place.images.map(url => ({
      placeId: place.id,
      placeName: place.name,
      url
    }))
  )
}

/**
 * Search places by image tags or description
 * Uses PostgreSQL full-text search
 */
export async function searchPlacesByImageContent(searchTerm: string) {
  // For now, search by name and description
  // Can be enhanced with dedicated image tags table
  const places = await prisma.place.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { category: { contains: searchTerm, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
      category: true
    }
  })

  return places
}

/**
 * Get image statistics
 */
export async function getImageStats() {
  const places = await prisma.place.findMany({
    select: { images: true }
  })

  const hotels = await prisma.hotel.findMany({
    select: { images: true }
  })

  const restaurants = await prisma.restaurant.findMany({
    select: { images: true }
  })

  const totalPlaceImages = places.reduce((sum, p) => sum + p.images.length, 0)
  const totalHotelImages = hotels.reduce((sum, h) => sum + h.images.length, 0)
  const totalRestaurantImages = restaurants.reduce((sum, r) => sum + r.images.length, 0)

  return {
    places: {
      count: places.length,
      totalImages: totalPlaceImages,
      avgImagesPerPlace: places.length > 0 ? totalPlaceImages / places.length : 0
    },
    hotels: {
      count: hotels.length,
      totalImages: totalHotelImages,
      avgImagesPerHotel: hotels.length > 0 ? totalHotelImages / hotels.length : 0
    },
    restaurants: {
      count: restaurants.length,
      totalImages: totalRestaurantImages,
      avgImagesPerRestaurant: restaurants.length > 0 ? totalRestaurantImages / restaurants.length : 0
    },
    total: totalPlaceImages + totalHotelImages + totalRestaurantImages
  }
}

/**
 * Bulk update images for multiple places
 */
export async function bulkUpdatePlaceImages(updates: Array<{ placeId: string, images: string[] }>) {
  const results = await Promise.allSettled(
    updates.map(({ placeId, images }) =>
      prisma.place.update({
        where: { id: placeId },
        data: { images }
      })
    )
  )

  const successful = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return { successful, failed, total: updates.length }
}

/**
 * Example: Cloud storage integration helper
 * This would integrate with services like Cloudinary, AWS S3, etc.
 */
export interface CloudUploadResult {
  url: string
  publicId: string
  format: string
  width: number
  height: number
  bytes: number
}

/**
 * Process and store uploaded image
 * This is a template - implement based on your cloud storage provider
 */
export async function processAndStoreImage(
  file: File | Buffer,
  entityType: 'place' | 'hotel' | 'restaurant' | 'user',
  entityId: string
): Promise<string> {
  // TODO: Implement actual cloud upload
  // Example with Cloudinary:
  // const result = await cloudinary.uploader.upload(file)
  // const imageUrl = result.secure_url
  
  // For now, return a placeholder
  const imageUrl = `https://placeholder.com/${entityType}/${entityId}/${Date.now()}.jpg`
  
  // Store URL in database based on entity type
  switch (entityType) {
    case 'place':
      await addImagesToPlace(entityId, [imageUrl])
      break
    case 'hotel':
      const hotel = await prisma.hotel.findUnique({ where: { id: entityId } })
      if (hotel) {
        await prisma.hotel.update({
          where: { id: entityId },
          data: { images: [...hotel.images, imageUrl] }
        })
      }
      break
    case 'restaurant':
      const restaurant = await prisma.restaurant.findUnique({ where: { id: entityId } })
      if (restaurant) {
        await prisma.restaurant.update({
          where: { id: entityId },
          data: { images: [...restaurant.images, imageUrl] }
        })
      }
      break
    case 'user':
      await prisma.user.update({
        where: { id: entityId },
        data: { profileImage: imageUrl }
      })
      break
  }
  
  return imageUrl
}

/**
 * Get paginated images
 */
export async function getPaginatedImages(
  entityType: 'place' | 'hotel' | 'restaurant',
  page: number = 1,
  pageSize: number = 20
) {
  const skip = (page - 1) * pageSize

  let entities: any[] = []
  let total = 0

  switch (entityType) {
    case 'place':
      [entities, total] = await Promise.all([
        prisma.place.findMany({
          skip,
          take: pageSize,
          select: { id: true, name: true, images: true, category: true }
        }),
        prisma.place.count()
      ])
      break
    case 'hotel':
      [entities, total] = await Promise.all([
        prisma.hotel.findMany({
          skip,
          take: pageSize,
          select: { id: true, name: true, images: true, type: true }
        }),
        prisma.hotel.count()
      ])
      break
    case 'restaurant':
      [entities, total] = await Promise.all([
        prisma.restaurant.findMany({
          skip,
          take: pageSize,
          select: { id: true, name: true, images: true, cuisineType: true }
        }),
        prisma.restaurant.count()
      ])
      break
  }

  return {
    data: entities,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  }
}

export default {
  addImagesToPlace,
  removeImagesFromPlace,
  getImagesByCategory,
  searchPlacesByImageContent,
  getImageStats,
  bulkUpdatePlaceImages,
  processAndStoreImage,
  getPaginatedImages
}
