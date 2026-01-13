# Admin Management Guide

## Overview
The admin dashboard now includes comprehensive management capabilities for tourist places, hotels, restaurants, and events.

## Features

### 1. Tourist Places Management
- Add new tourist destinations
- Edit existing places
- Delete places
- Fields include:
  - Name, location, description
  - Category, best time to visit
  - Entry fee, timings
  - Images, coordinates
  - Highlights, facilities
  - Weather information

### 2. Hotels Management
- Add new hotels, resorts, guesthouses, and lodges
- Edit hotel information
- Delete hotels
- Fields include:
  - Name, type, location, address
  - Description, rating
  - Price range (min/max)
  - Amenities, images
  - Room types and availability
  - Contact details (phone, email, website)

### 3. Restaurants Management
- Add new restaurants
- Edit restaurant information
- Delete restaurants
- Fields include:
  - Name, cuisine types
  - Location, address, description
  - Price range, specialties
  - Seating capacity
  - Operating hours
  - Contact details

### 4. Events Management
- Add new events
- Edit event information
- Delete events
- Fields include:
  - Title, description, category
  - Location, address
  - Start/end dates and times
  - Organizer details
  - Ticket pricing
  - Capacity and registration count

## Access

### Admin Login Credentials
- **Email:** admin@test.com
- **Password:** admin789

### Navigation
1. Login to admin dashboard at `/admin-login`
2. Click "Manage Places, Hotels, Restaurants & Events" button
3. Select the resource type from tabs
4. Use "Add New" button to create entries
5. Use Edit/Delete icons to modify existing entries

## API Endpoints

All endpoints require admin authentication via Bearer token.

### Places
- `GET /api/admin/places` - Get all places
- `POST /api/admin/places` - Create new place
- `PUT /api/admin/places` - Update place
- `DELETE /api/admin/places?id={id}` - Delete place

### Hotels
- `GET /api/admin/hotels` - Get all hotels
- `POST /api/admin/hotels` - Create new hotel
- `PUT /api/admin/hotels` - Update hotel
- `DELETE /api/admin/hotels?id={id}` - Delete hotel

### Restaurants
- `GET /api/admin/restaurants` - Get all restaurants
- `POST /api/admin/restaurants` - Create new restaurant
- `PUT /api/admin/restaurants` - Update restaurant
- `DELETE /api/admin/restaurants?id={id}` - Delete restaurant

### Events
- `GET /api/admin/events` - Get all events
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events` - Update event
- `DELETE /api/admin/events?id={id}` - Delete event

## Database Models

### Place Model
Located at `lib/models/Place.ts`

### Hotel Model
Located at `lib/models/Hotel.ts`

### Restaurant Model
Located at `lib/models/Restaurant.ts`

### Event Model
Located at `lib/models/Event.ts`

## Security
- All admin endpoints are protected with JWT authentication
- Only users with 'admin' role can access these endpoints
- All operations are logged with the admin user ID

## Future Enhancements
- Image upload functionality
- Bulk import/export
- Advanced filtering and search
- Analytics and reporting
- Approval workflow for user-submitted content
