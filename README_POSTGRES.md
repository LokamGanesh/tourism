# PostgreSQL Migration for Jharkhand Tourism Platform

## Quick Start

Your PostgreSQL database is already configured and ready to use!

**Database URL:** 
```
postgresql://jharkhandtourism_user:a6XDleRfRgnfKFUxx7byBE0P0ymJSTWn@dpg-d5j7htu3jp1c73fahdt0-a.frankfurt-postgres.render.com/jharkhandtourism
```

## Setup Instructions

### Windows Users:
```bash
# Run the automated setup script
scripts\setup-postgres.bat
```

### Mac/Linux Users:
```bash
# Make script executable
chmod +x scripts/setup-postgres.sh

# Run the automated setup script
./scripts/setup-postgres.sh
```

### Manual Setup:

1. **Install Dependencies**
   ```bash
   npm install @prisma/client pg
   npm install -D prisma @types/pg
   ```

2. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

3. **Test Connection**
   ```bash
   node scripts/test-postgres.js
   ```

4. **Create Database Schema**
   ```bash
   npm run prisma:push
   ```

5. **Migrate Data (Optional)**
   ```bash
   node scripts/migrate-mongo-to-postgres.js
   ```

## What's Changed

### New Files Created:
- `prisma/schema.prisma` - Database schema definition
- `lib/prisma.ts` - Prisma client instance
- `lib/postgres.ts` - Raw PostgreSQL connection utilities
- `scripts/migrate-mongo-to-postgres.js` - Data migration script
- `scripts/test-postgres.js` - Connection test script
- `MIGRATION_GUIDE.md` - Detailed migration instructions

### Updated Files:
- `.env` - Added DATABASE_URL for PostgreSQL
- `package.json` - Added Prisma dependencies and scripts

## Using Prisma in Your Code

### Import Prisma Client:
```typescript
import prisma from '@/lib/prisma'
```

### Common Operations:

#### Create a User:
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
    name: 'John Doe',
    role: 'tourist',
    isVerified: true
  }
})
```

#### Find a User:
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})
```

#### Find Many with Filters:
```typescript
const guides = await prisma.user.findMany({
  where: {
    role: 'travel_guide',
    isApproved: true
  },
  include: {
    vehicles: true,
    travels: true
  }
})
```

#### Update a User:
```typescript
await prisma.user.update({
  where: { id: userId },
  data: { isVerified: true }
})
```

#### Delete a Record:
```typescript
await prisma.oTP.delete({
  where: { id: otpId }
})
```

## Image Storage Best Practices

PostgreSQL is excellent for managing large image databases. Here are recommended approaches:

### 1. Store Image URLs (Recommended)
Store images in cloud storage (AWS S3, Cloudinary, etc.) and save URLs in PostgreSQL:

```typescript
const place = await prisma.place.create({
  data: {
    name: 'Hundru Falls',
    images: [
      'https://cloudinary.com/images/hundru-1.jpg',
      'https://cloudinary.com/images/hundru-2.jpg'
    ]
  }
})
```

**Benefits:**
- Fast database queries
- Scalable storage
- CDN delivery
- Easy backups

### 2. Store Image Metadata
Store detailed metadata about images:

```typescript
const imageMetadata = {
  url: 'https://cdn.example.com/image.jpg',
  thumbnail: 'https://cdn.example.com/thumb.jpg',
  width: 1920,
  height: 1080,
  size: 245678,
  format: 'jpeg',
  uploadedAt: new Date(),
  tags: ['waterfall', 'nature', 'jharkhand']
}
```

### 3. Full-Text Search on Images
PostgreSQL supports full-text search for image descriptions:

```sql
-- Add full-text search index
CREATE INDEX place_search_idx ON "Place" 
USING GIN (to_tsvector('english', name || ' ' || description));

-- Search places
SELECT * FROM "Place" 
WHERE to_tsvector('english', name || ' ' || description) 
@@ to_tsquery('english', 'waterfall & nature');
```

## Useful Commands

```bash
# View database in browser
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format Prisma schema
npx prisma format

# Validate schema
npx prisma validate
```

## Database Management

### Render.com Dashboard:
- View your database at: https://dashboard.render.com
- Monitor connections, queries, and performance
- Create backups
- Scale resources

### Connection Pooling:
The PostgreSQL connection is configured with:
- Max 20 connections
- 30s idle timeout
- 10s connection timeout
- SSL enabled

## Troubleshooting

### Connection Issues:
```bash
# Test connection
node scripts/test-postgres.js

# Check if DATABASE_URL is set
echo $DATABASE_URL  # Mac/Linux
echo %DATABASE_URL%  # Windows
```

### Schema Issues:
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Push schema changes
npm run prisma:push
```

### Migration Issues:
```bash
# Check migration status
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve
```

## Performance Tips

1. **Use Indexes**: Already configured in schema for common queries
2. **Use Pagination**: Limit results with `take` and `skip`
3. **Select Specific Fields**: Use `select` to fetch only needed data
4. **Use Transactions**: For operations that must succeed together
5. **Connection Pooling**: Already configured in `lib/postgres.ts`

## Security

- ✅ SSL enabled for database connections
- ✅ Environment variables for credentials
- ✅ Password hashing with bcryptjs
- ✅ JWT tokens for authentication
- ✅ Prepared statements (Prisma default)

## Next Steps

1. ✅ PostgreSQL configured
2. ✅ Schema created
3. ⏳ Update API routes to use Prisma
4. ⏳ Test all functionality
5. ⏳ Deploy to production

See `MIGRATION_GUIDE.md` for detailed migration instructions.

## Support

- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Render Docs: https://render.com/docs/databases
