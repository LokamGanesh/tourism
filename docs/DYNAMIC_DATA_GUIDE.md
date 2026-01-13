# Dynamic Data & Image Upload Guide

This guide explains how the dynamic data system works and how to use it in your application.

## Overview

The website now supports:
- ✅ Real-time data updates from admin dashboard
- ✅ Image upload functionality for all resources
- ✅ Public API endpoints for users to fetch data
- ✅ React hooks for easy data fetching
- ✅ Automatic synchronization between admin and user views

## Admin Features

### Image Upload

When adding or editing places, hotels, restaurants, or events in the admin dashboard:

1. **Upload Multiple Images**: Click the "Click to upload images" button
2. **Preview**: See thumbnails of selected images before saving
3. **Remove Images**: Hover over any image and click the X button to remove it
4. **Save**: Images are automatically uploaded when you save the form

**Supported formats**: JPG, PNG, WebP

### Managing Resources

All changes made in the admin dashboard are immediately available to users:
- Create new items → Users see them instantly
- Update existing items → Changes reflect immediately
- Delete items → Removed from user views
- Toggle featured status → Updates featured sections
- Toggle active status → Controls visibility

## User Dashboard Integration

### Using React Hooks

Import and use the provided hooks to fetch dynamic data:

```typescript
import { usePlaces, useHotels, useRestaurants, useEvents } from '@/lib/hooks/useDynamicData'

// Fetch all places
const { places, loading, error } = usePlaces()

// Fetch featured places only
const { places, loading, error } = usePlaces({ featured: true })

// Fetch places by category
const { places, loading, error } = usePlaces({ category: 'Temple' })

// Fetch hotels by type
const { hotels, loading, error } = useHotels({ type: 'resort' })

// Fetch hotels by location
const { hotels, loading, error } = useHotels({ location: 'Ranchi' })

// Fetch restaurants by cuisine
const { restaurants, loading, error } = useRestaurants({ cuisineType: 'Indian' })

// Fetch upcoming events
const { events, loading, error } = useEvents({ upcoming: true })
```

### Using Pre-built Components

Use the ready-made components for quick integration:

```typescript
import DynamicPlacesList from '@/app/components/DynamicPlacesList'
import DynamicHotelsList from '@/app/components/DynamicHotelsList'

// Show all featured places
<DynamicPlacesList featured={true} />

// Show places by category
<DynamicPlacesList category="Temple" />

// Show featured hotels
<DynamicHotelsList featured={true} />

// Show hotels by type
<DynamicHotelsList type="resort" />
```

### Direct API Calls

You can also fetch data directly from the API:

```typescript
// Fetch places
const response = await fetch('/api/public/places?featured=true')
const data = await response.json()
console.log(data.places)

// Fetch hotels
const response = await fetch('/api/public/hotels?type=resort&location=Ranchi')
const data = await response.json()
console.log(data.hotels)

// Fetch restaurants
const response = await fetch('/api/public/restaurants?cuisineType=Indian')
const data = await response.json()
console.log(data.restaurants)

// Fetch events
const response = await fetch('/api/public/events?upcoming=true')
const data = await response.json()
console.log(data.events)
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Places
- `GET /api/public/places` - Get all places
- Query params: `featured`, `category`

#### Hotels
- `GET /api/public/hotels` - Get all active hotels
- Query params: `featured`, `type`, `location`

#### Restaurants
- `GET /api/public/restaurants` - Get all active restaurants
- Query params: `featured`, `cuisineType`, `location`

#### Events
- `GET /api/public/events` - Get all active events
- Query params: `featured`, `category`, `upcoming`

### Admin Endpoints (Authentication Required)

#### Places
- `GET /api/admin/places` - Get all places
- `POST /api/admin/places` - Create new place
- `PUT /api/admin/places` - Update place
- `DELETE /api/admin/places?id={id}` - Delete place

#### Hotels
- `GET /api/admin/hotels` - Get all hotels
- `POST /api/admin/hotels` - Create new hotel
- `PUT /api/admin/hotels` - Update hotel
- `DELETE /api/admin/hotels?id={id}` - Delete hotel

#### Restaurants
- `GET /api/admin/restaurants` - Get all restaurants
- `POST /api/admin/restaurants` - Create new restaurant
- `PUT /api/admin/restaurants` - Update restaurant
- `DELETE /api/admin/restaurants?id={id}` - Delete restaurant

#### Events
- `GET /api/admin/events` - Get all events
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events` - Update event
- `DELETE /api/admin/events?id={id}` - Delete event

#### Upload
- `POST /api/upload` - Upload images (Admin only)
- Body: FormData with `images` field containing files
- Returns: Array of uploaded image URLs

## Example: Creating a Dynamic Page

```typescript
'use client'

import { usePlaces } from '@/lib/hooks/useDynamicData'
import Image from 'next/image'

export default function PlacesPage() {
  const { places, loading, error, refetch } = usePlaces({ featured: true })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Featured Places</h1>
      <button onClick={refetch}>Refresh</button>
      
      <div className="grid grid-cols-3 gap-4">
        {places.map(place => (
          <div key={place._id} className="card">
            {place.images?.[0] && (
              <Image 
                src={place.images[0]} 
                alt={place.name}
                width={300}
                height={200}
              />
            )}
            <h2>{place.name}</h2>
            <p>{place.location}</p>
            <p>{place.description}</p>
            <span>Rating: {place.rating}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Image Storage

- Images are stored in `/public/uploads/`
- Filenames are automatically generated with timestamps
- Images are accessible via `/uploads/{filename}`
- Supported formats: JPG, PNG, WebP

## Best Practices

1. **Always check loading state** before rendering data
2. **Handle errors gracefully** with user-friendly messages
3. **Use featured flag** to highlight important content
4. **Optimize images** before uploading (recommended max 2MB per image)
5. **Refresh data** when needed using the `refetch` function
6. **Filter data** using query parameters for better performance

## Troubleshooting

### Images not uploading
- Check file size (should be < 10MB)
- Verify file format (JPG, PNG, WebP only)
- Ensure admin authentication token is valid

### Data not updating
- Check if item is marked as "Active" in admin dashboard
- Verify API endpoint is correct
- Check browser console for errors

### Empty results
- Verify filters/query parameters
- Check if any items exist in the database
- Ensure items are marked as active (for hotels, restaurants, events)

## Security

- Image uploads require admin authentication
- Public APIs only return active items
- Admin APIs require valid JWT token
- File uploads are validated for type and size
