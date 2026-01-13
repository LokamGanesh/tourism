# PostgreSQL Architecture for Jharkhand Tourism Platform

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Application                          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Frontend   │  │  API Routes  │  │   Server     │          │
│  │  Components  │→ │  (Next.js)   │→ │  Functions   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                            ↓                                      │
│                    ┌──────────────┐                              │
│                    │    Prisma    │                              │
│                    │    Client    │                              │
│                    └──────────────┘                              │
└─────────────────────────┼───────────────────────────────────────┘
                          ↓
                 ┌────────────────┐
                 │   PostgreSQL   │
                 │    Database    │
                 │  (Render.com)  │
                 └────────────────┘
```

## Database Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PostgreSQL Database                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User Management                Tourism Content                  │
│  ┌──────────┐                  ┌──────────┐                     │
│  │   User   │                  │  Place   │                     │
│  ├──────────┤                  ├──────────┤                     │
│  │ id       │                  │ id       │                     │
│  │ email    │                  │ name     │                     │
│  │ role     │                  │ location │                     │
│  │ ...      │                  │ images[] │                     │
│  └────┬─────┘                  └──────────┘                     │
│       │                                                           │
│       ├─────────┐              ┌──────────┐                     │
│       │         │              │  Event   │                     │
│  ┌────▼────┐   │              ├──────────┤                     │
│  │   OTP   │   │              │ id       │                     │
│  ├─────────┤   │              │ name     │                     │
│  │ email   │   │              │ date     │                     │
│  │ otp     │   │              │ images[] │                     │
│  └─────────┘   │              └──────────┘                     │
│                 │                                                 │
│  ┌──────────────▼──┐           ┌──────────┐                     │
│  │  Certificate    │           │  Hotel   │                     │
│  ├─────────────────┤           ├──────────┤                     │
│  │ userId (FK)     │           │ id       │                     │
│  │ name            │           │ name     │                     │
│  │ url             │           │ images[] │                     │
│  └─────────────────┘           └────┬─────┘                     │
│                                      │                            │
│  Bookings                       ┌────▼────┐                     │
│  ┌──────────┐                  │  Room   │                     │
│  │ Booking  │                  ├─────────┤                     │
│  ├──────────┤                  │ hotelId │                     │
│  │ userId   │                  │ type    │                     │
│  │ travelId │                  │ price   │                     │
│  │ status   │                  └─────────┘                     │
│  └──────────┘                                                    │
│                                 ┌──────────────┐                │
│  ┌────────────────┐            │ Restaurant   │                │
│  │ HotelBooking   │            ├──────────────┤                │
│  ├────────────────┤            │ id           │                │
│  │ userId         │            │ name         │                │
│  │ hotelId        │            │ images[]     │                │
│  │ checkIn        │            └──────┬───────┘                │
│  └────────────────┘                   │                         │
│                                  ┌─────▼──────┐                 │
│  ┌──────────────────────┐       │ MenuItem   │                 │
│  │ RestaurantBooking    │       ├────────────┤                 │
│  ├──────────────────────┤       │ restaurantId│                │
│  │ userId               │       │ name        │                │
│  │ restaurantId         │       │ price       │                │
│  │ date                 │       └─────────────┘                │
│  └──────────────────────┘                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User Input (Email/OTP)
        ↓
API Route (/api/auth/verify-otp-prisma)
        ↓
Prisma Client
        ↓
PostgreSQL Query
        ↓
Validate OTP
        ↓
Create/Update User
        ↓
Generate JWT Token
        ↓
Return to Client
```

### 2. Image Management Flow

```
Image Upload
        ↓
Cloud Storage (S3/Cloudinary)
        ↓
Get Image URL
        ↓
Store URL in PostgreSQL
        ↓
┌─────────────────┐
│ Place.images[]  │
│ Hotel.images[]  │
│ Restaurant.images[] │
└─────────────────┘
        ↓
Retrieve & Display
```

### 3. Booking Flow

```
User Selects Service
        ↓
API Route (/api/bookings)
        ↓
Prisma Transaction
        ↓
┌──────────────────┐
│ Create Booking   │
│ Update User      │
│ Process Payment  │
└──────────────────┘
        ↓
Commit Transaction
        ↓
Return Confirmation
```

## Connection Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Multiple API Routes                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │
│  │ Auth │  │Places│  │Hotels│  │ Book │                   │
│  └───┬──┘  └───┬──┘  └───┬──┘  └───┬──┘                   │
│      │         │         │         │                         │
│      └─────────┴─────────┴─────────┘                         │
│                    ↓                                          │
│            ┌──────────────┐                                  │
│            │ Prisma Client│                                  │
│            │  (Singleton) │                                  │
│            └──────┬───────┘                                  │
│                   ↓                                           │
│         ┌──────────────────┐                                 │
│         │ Connection Pool  │                                 │
│         │  (Max 20 conns)  │                                 │
│         └──────┬───────────┘                                 │
└────────────────┼─────────────────────────────────────────────┘
                 ↓
         ┌──────────────┐
         │  PostgreSQL  │
         │   Database   │
         └──────────────┘
```

## File Structure

```
jharkhand-tourism/
│
├── prisma/
│   └── schema.prisma          # Database schema definition
│
├── lib/
│   ├── prisma.ts              # Prisma client singleton
│   ├── postgres.ts            # Raw PostgreSQL utilities
│   ├── image-storage.ts       # Image management
│   ├── mongodb.ts             # Legacy (can be removed)
│   └── models/                # Legacy Mongoose models
│
├── app/
│   └── api/
│       ├── auth/
│       │   ├── verify-otp-simple/     # Old (Mongoose)
│       │   └── verify-otp-prisma/     # New (Prisma)
│       ├── places/
│       ├── hotels/
│       ├── bookings/
│       └── images/
│           └── stats/
│
├── scripts/
│   ├── migrate-mongo-to-postgres.js   # Data migration
│   ├── test-postgres.js               # Connection test
│   ├── setup-postgres.bat             # Windows setup
│   └── setup-postgres.sh              # Mac/Linux setup
│
├── docs/
│   └── MONGOOSE_TO_PRISMA_CHEATSHEET.md
│
├── .env                        # Environment variables
├── package.json                # Dependencies
├── QUICKSTART.md              # Quick start guide
├── README_POSTGRES.md         # PostgreSQL guide
├── MIGRATION_GUIDE.md         # Migration instructions
└── ARCHITECTURE.md            # This file
```

## Technology Stack

### Database Layer
- **PostgreSQL 16+** - Primary database
- **Render.com** - Database hosting
- **SSL/TLS** - Encrypted connections

### ORM Layer
- **Prisma 6.x** - Type-safe ORM
- **Prisma Client** - Query builder
- **Prisma Studio** - Database GUI

### Application Layer
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Node.js** - Runtime

### Connection Layer
- **pg** - PostgreSQL driver
- **Connection Pooling** - Max 20 connections
- **SSL** - Secure connections

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Application Layer                                        │
│     ┌──────────────────────────────────────┐               │
│     │ • JWT Authentication                  │               │
│     │ • Password Hashing (bcryptjs)        │               │
│     │ • Input Validation                    │               │
│     │ • Rate Limiting                       │               │
│     └──────────────────────────────────────┘               │
│                      ↓                                        │
│  2. ORM Layer                                                │
│     ┌──────────────────────────────────────┐               │
│     │ • Prepared Statements (Prisma)       │               │
│     │ • SQL Injection Prevention           │               │
│     │ • Type Safety                         │               │
│     └──────────────────────────────────────┘               │
│                      ↓                                        │
│  3. Connection Layer                                         │
│     ┌──────────────────────────────────────┐               │
│     │ • SSL/TLS Encryption                 │               │
│     │ • Connection Pooling                  │               │
│     │ • Timeout Management                  │               │
│     └──────────────────────────────────────┘               │
│                      ↓                                        │
│  4. Database Layer                                           │
│     ┌──────────────────────────────────────┐               │
│     │ • User Authentication                 │               │
│     │ • Role-Based Access Control          │               │
│     │ • Encrypted Storage                   │               │
│     │ • Audit Logging                       │               │
│     └──────────────────────────────────────┘               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

### 1. Indexing Strategy
```sql
-- Automatically created by Prisma schema
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_role ON "User"(role);
CREATE INDEX idx_place_category ON "Place"(category);
CREATE INDEX idx_booking_status ON "Booking"(status);
```

### 2. Connection Pooling
```typescript
// lib/postgres.ts
const pool = new Pool({
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Close idle connections
  connectionTimeoutMillis: 10000  // Connection timeout
})
```

### 3. Query Optimization
```typescript
// Select only needed fields
const user = await prisma.user.findUnique({
  where: { email },
  select: { id: true, name: true, role: true }
})

// Use pagination
const places = await prisma.place.findMany({
  take: 20,
  skip: page * 20
})
```

## Scalability Considerations

### Horizontal Scaling
- Connection pooling supports multiple app instances
- Stateless API design
- JWT tokens (no session storage)

### Vertical Scaling
- PostgreSQL can scale to large datasets
- Efficient indexing
- Query optimization

### Caching Strategy
- Redis for session caching (future)
- CDN for images
- Query result caching (future)

## Monitoring & Maintenance

### Database Monitoring
- Render.com dashboard
- Connection pool metrics
- Query performance
- Storage usage

### Application Monitoring
- API response times
- Error rates
- User activity
- Booking statistics

### Backup Strategy
- Render.com automatic backups
- Point-in-time recovery
- Export capabilities

## Migration Strategy

### Phase 1: Parallel Running
```
MongoDB (Read/Write) ←→ Application ←→ PostgreSQL (Write only)
```

### Phase 2: Transition
```
MongoDB (Read only) ←→ Application ←→ PostgreSQL (Read/Write)
```

### Phase 3: Complete
```
MongoDB (Archived) ←→ Application ←→ PostgreSQL (Primary)
```

## Future Enhancements

### Short Term
- [ ] Full-text search implementation
- [ ] Image optimization pipeline
- [ ] Advanced analytics queries
- [ ] Real-time notifications

### Long Term
- [ ] Read replicas for scaling
- [ ] Caching layer (Redis)
- [ ] GraphQL API
- [ ] Microservices architecture

## Conclusion

This architecture provides:
- ✅ Scalable image management
- ✅ Type-safe database operations
- ✅ Efficient connection handling
- ✅ Production-ready security
- ✅ Easy maintenance and monitoring
- ✅ Clear migration path

The PostgreSQL setup is optimized for the Jharkhand Tourism platform's needs, especially for managing large image databases efficiently.
