# MongoDB to PostgreSQL Migration Guide

## Overview
This guide will help you migrate from MongoDB to PostgreSQL for the Jharkhand Tourism platform.

## Prerequisites
- Node.js installed
- Access to the PostgreSQL database on Render.com
- Backup of existing MongoDB data (if needed)

## Step 1: Install Dependencies

```bash
npm install @prisma/client pg
npm install -D prisma @types/pg
```

## Step 2: Environment Configuration

The `.env` file has been updated with the PostgreSQL connection string:

```env
DATABASE_URL=postgresql://jharkhandtourism_user:a6XDleRfRgnfKFUxx7byBE0P0ymJSTWn@dpg-d5j7htu3jp1c73fahdt0-a.frankfurt-postgres.render.com/jharkhandtourism
```

## Step 3: Initialize Prisma and Create Database Schema

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push

# Or create a migration (recommended for production)
npm run prisma:migrate
```

## Step 4: Migration Strategy

### Option A: Fresh Start (Recommended for Development)
If you don't need to preserve existing MongoDB data:

1. Run `npm run prisma:push` to create all tables
2. Use the updated API routes that now use Prisma
3. Test the application

### Option B: Data Migration (For Production)
If you need to migrate existing data from MongoDB:

1. Create a migration script (see `scripts/migrate-mongo-to-postgres.js`)
2. Run the migration script to transfer data
3. Verify data integrity
4. Switch to PostgreSQL

## Step 5: Update API Routes

All API routes need to be updated to use Prisma instead of Mongoose. Here's the pattern:

### Before (Mongoose):
```typescript
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

await dbConnect()
const user = await User.findOne({ email })
```

### After (Prisma):
```typescript
import prisma from '@/lib/prisma'

const user = await prisma.user.findUnique({
  where: { email }
})
```

## Step 6: Key Differences

### 1. ID Fields
- MongoDB: Uses `_id` with ObjectId
- PostgreSQL: Uses `id` with UUID

### 2. Relations
- MongoDB: Uses references with `populate()`
- PostgreSQL: Uses foreign keys with `include`

### 3. Queries
- MongoDB: `findOne()`, `find()`, `create()`
- Prisma: `findUnique()`, `findMany()`, `create()`

## Step 7: Testing

1. Test user authentication (signup/login)
2. Test OTP verification
3. Test bookings and reservations
4. Test image uploads and retrieval
5. Test all CRUD operations

## Step 8: Prisma Studio (Database GUI)

View and edit your database with Prisma Studio:

```bash
npm run prisma:studio
```

This opens a web interface at http://localhost:5555

## Benefits of PostgreSQL

1. **Better for Images**: PostgreSQL handles large binary data and metadata more efficiently
2. **ACID Compliance**: Stronger data consistency guarantees
3. **Advanced Queries**: Better support for complex joins and aggregations
4. **Scalability**: Better performance for large datasets
5. **JSON Support**: Can still store JSON data when needed
6. **Full-text Search**: Built-in search capabilities

## Image Storage Strategy

For large image databases, consider:

1. **Store image URLs in PostgreSQL** (recommended)
   - Upload images to cloud storage (AWS S3, Cloudinary, etc.)
   - Store URLs in PostgreSQL
   - Fast and scalable

2. **Store images as bytea** (for smaller images)
   - Store binary data directly in PostgreSQL
   - Good for thumbnails or small images

3. **Hybrid approach**
   - Store thumbnails in PostgreSQL
   - Store full images in cloud storage

## Rollback Plan

If you need to rollback to MongoDB:

1. Keep MongoDB connection string in `.env` as backup
2. Don't delete MongoDB models immediately
3. Test thoroughly before removing MongoDB dependencies

## Support

For issues or questions:
- Check Prisma docs: https://www.prisma.io/docs
- Check PostgreSQL docs: https://www.postgresql.org/docs/
- Review the migration script: `scripts/migrate-mongo-to-postgres.js`
