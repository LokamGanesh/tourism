# Mongoose to Prisma Cheatsheet

Quick reference for converting Mongoose code to Prisma.

## Setup & Connection

### Mongoose
```typescript
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongodb'

await dbConnect()
```

### Prisma
```typescript
import prisma from '@/lib/prisma'

// No connection needed - Prisma handles it automatically
```

## Create Operations

### Mongoose
```typescript
// Single document
const user = await User.create({
  email: 'user@example.com',
  name: 'John Doe',
  role: 'tourist'
})

// Multiple documents
const users = await User.insertMany([
  { email: 'user1@example.com', name: 'User 1' },
  { email: 'user2@example.com', name: 'User 2' }
])
```

### Prisma
```typescript
// Single record
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    role: 'tourist'
  }
})

// Multiple records
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1', role: 'tourist', password: 'hash1' },
    { email: 'user2@example.com', name: 'User 2', role: 'tourist', password: 'hash2' }
  ]
})
```

## Read Operations

### Find One

#### Mongoose
```typescript
// By field
const user = await User.findOne({ email: 'user@example.com' })

// By ID
const user = await User.findById(userId)

// With select
const user = await User.findOne({ email }).select('name email role')
```

#### Prisma
```typescript
// By unique field
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})

// By ID
const user = await prisma.user.findUnique({
  where: { id: userId }
})

// With select
const user = await prisma.user.findUnique({
  where: { email },
  select: { name: true, email: true, role: true }
})
```

### Find Many

#### Mongoose
```typescript
// All documents
const users = await User.find()

// With filter
const guides = await User.find({ 
  role: 'travel_guide',
  isApproved: true 
})

// With sort
const users = await User.find().sort({ createdAt: -1 })

// With limit and skip
const users = await User.find().limit(10).skip(20)

// With multiple conditions
const users = await User.find({
  $or: [
    { role: 'tourist' },
    { role: 'travel_guide' }
  ],
  isVerified: true
})
```

#### Prisma
```typescript
// All records
const users = await prisma.user.findMany()

// With filter
const guides = await prisma.user.findMany({
  where: {
    role: 'travel_guide',
    isApproved: true
  }
})

// With sort
const users = await prisma.user.findMany({
  orderBy: { createdAt: 'desc' }
})

// With pagination
const users = await prisma.user.findMany({
  take: 10,
  skip: 20
})

// With multiple conditions
const users = await prisma.user.findMany({
  where: {
    OR: [
      { role: 'tourist' },
      { role: 'travel_guide' }
    ],
    isVerified: true
  }
})
```

### Count

#### Mongoose
```typescript
const count = await User.countDocuments({ role: 'tourist' })
```

#### Prisma
```typescript
const count = await prisma.user.count({
  where: { role: 'tourist' }
})
```

## Update Operations

### Mongoose
```typescript
// Update one
await User.findByIdAndUpdate(userId, { 
  isVerified: true 
})

// Update with $set
await User.updateOne(
  { email },
  { $set: { isVerified: true } }
)

// Update many
await User.updateMany(
  { role: 'tourist' },
  { $set: { isVerified: false } }
)

// Array operations
await User.findByIdAndUpdate(userId, {
  $push: { interests: 'hiking' }
})
```

### Prisma
```typescript
// Update one
await prisma.user.update({
  where: { id: userId },
  data: { isVerified: true }
})

// Update with where clause
await prisma.user.updateMany({
  where: { email },
  data: { isVerified: true }
})

// Update many
await prisma.user.updateMany({
  where: { role: 'tourist' },
  data: { isVerified: false }
})

// Array operations
await prisma.user.update({
  where: { id: userId },
  data: {
    interests: {
      push: 'hiking'
    }
  }
})
```

## Delete Operations

### Mongoose
```typescript
// Delete one by ID
await User.findByIdAndDelete(userId)

// Delete one by filter
await User.deleteOne({ email })

// Delete many
await User.deleteMany({ isVerified: false })
```

### Prisma
```typescript
// Delete one
await prisma.user.delete({
  where: { id: userId }
})

// Delete by unique field
await prisma.user.delete({
  where: { email }
})

// Delete many
await prisma.user.deleteMany({
  where: { isVerified: false }
})
```

## Relations & Population

### Mongoose
```typescript
// Populate single relation
const guide = await User.findById(guideId)
  .populate('vehicles')

// Populate multiple relations
const guide = await User.findById(guideId)
  .populate('vehicles')
  .populate('travels')

// Nested populate
const booking = await Booking.findById(bookingId)
  .populate({
    path: 'travel',
    populate: { path: 'user' }
  })
```

### Prisma
```typescript
// Include single relation
const guide = await prisma.user.findUnique({
  where: { id: guideId },
  include: { vehicles: true }
})

// Include multiple relations
const guide = await prisma.user.findUnique({
  where: { id: guideId },
  include: {
    vehicles: true,
    travels: true
  }
})

// Nested include
const booking = await prisma.booking.findUnique({
  where: { id: bookingId },
  include: {
    travel: {
      include: { user: true }
    }
  }
})
```

## Aggregation

### Mongoose
```typescript
// Count by group
const stats = await User.aggregate([
  { $group: { _id: '$role', count: { $sum: 1 } } }
])

// Average
const avgRating = await User.aggregate([
  { $match: { role: 'travel_guide' } },
  { $group: { _id: null, avgRating: { $avg: '$rating' } } }
])
```

### Prisma
```typescript
// Count by group
const stats = await prisma.user.groupBy({
  by: ['role'],
  _count: true
})

// Average
const avgRating = await prisma.user.aggregate({
  where: { role: 'travel_guide' },
  _avg: { rating: true }
})
```

## Transactions

### Mongoose
```typescript
const session = await mongoose.startSession()
session.startTransaction()

try {
  await User.create([{ email, name }], { session })
  await OTP.deleteMany({ email }, { session })
  
  await session.commitTransaction()
} catch (error) {
  await session.abortTransaction()
  throw error
} finally {
  session.endSession()
}
```

### Prisma
```typescript
await prisma.$transaction(async (tx) => {
  await tx.user.create({
    data: { email, name, role: 'tourist', password: 'hash' }
  })
  await tx.oTP.deleteMany({
    where: { email }
  })
})
```

## Search & Filtering

### Mongoose
```typescript
// Text search
const places = await Place.find({
  $text: { $search: 'waterfall' }
})

// Regex search
const places = await Place.find({
  name: { $regex: 'falls', $options: 'i' }
})

// Range queries
const hotels = await Hotel.find({
  'priceRange.min': { $gte: 1000, $lte: 5000 }
})

// Array contains
const users = await User.find({
  languages: { $in: ['Hindi', 'English'] }
})
```

### Prisma
```typescript
// Text search (contains)
const places = await prisma.place.findMany({
  where: {
    OR: [
      { name: { contains: 'waterfall', mode: 'insensitive' } },
      { description: { contains: 'waterfall', mode: 'insensitive' } }
    ]
  }
})

// Case-insensitive search
const places = await prisma.place.findMany({
  where: {
    name: { contains: 'falls', mode: 'insensitive' }
  }
})

// Range queries
const hotels = await prisma.hotel.findMany({
  where: {
    priceRangeMin: { gte: 1000, lte: 5000 }
  }
})

// Array contains
const users = await prisma.user.findMany({
  where: {
    languages: { hasSome: ['Hindi', 'English'] }
  }
})
```

## Sorting & Pagination

### Mongoose
```typescript
const places = await Place.find()
  .sort({ rating: -1, name: 1 })
  .limit(10)
  .skip(20)
```

### Prisma
```typescript
const places = await prisma.place.findMany({
  orderBy: [
    { rating: 'desc' },
    { name: 'asc' }
  ],
  take: 10,
  skip: 20
})
```

## Exists Check

### Mongoose
```typescript
const exists = await User.exists({ email })
// Returns { _id: ... } or null
```

### Prisma
```typescript
const user = await prisma.user.findUnique({
  where: { email },
  select: { id: true }
})
const exists = user !== null
```

## Upsert

### Mongoose
```typescript
await User.findOneAndUpdate(
  { email },
  { $set: { name, role } },
  { upsert: true, new: true }
)
```

### Prisma
```typescript
await prisma.user.upsert({
  where: { email },
  update: { name, role },
  create: { email, name, role, password: 'hash' }
})
```

## Key Differences

| Feature | Mongoose | Prisma |
|---------|----------|--------|
| Connection | Manual `dbConnect()` | Automatic |
| ID Field | `_id` (ObjectId) | `id` (UUID) |
| Relations | `populate()` | `include` |
| Transactions | Sessions | `$transaction` |
| Type Safety | Partial | Full TypeScript |
| Query Builder | Chaining | Object-based |
| Migrations | Manual | Built-in |
| GUI | MongoDB Compass | Prisma Studio |

## Common Pitfalls

### 1. ID Field Name
```typescript
// ❌ Mongoose
user._id

// ✅ Prisma
user.id
```

### 2. Create Requires All Fields
```typescript
// ❌ Prisma - Missing required fields
await prisma.user.create({
  data: { email, name }
})

// ✅ Prisma - All required fields
await prisma.user.create({
  data: { email, name, role: 'tourist', password: 'hash' }
})
```

### 3. FindOne vs FindUnique
```typescript
// ❌ Prisma - findOne doesn't exist
await prisma.user.findOne({ where: { email } })

// ✅ Prisma - Use findUnique for unique fields
await prisma.user.findUnique({ where: { email } })

// ✅ Prisma - Use findFirst for non-unique fields
await prisma.user.findFirst({ where: { name } })
```

### 4. Array Operations
```typescript
// ❌ Prisma - $push doesn't exist
data: { $push: { images: url } }

// ✅ Prisma - Use push
data: { images: { push: url } }
```

## Migration Checklist

- [ ] Install Prisma dependencies
- [ ] Create Prisma schema
- [ ] Generate Prisma Client
- [ ] Test database connection
- [ ] Update imports (mongoose → prisma)
- [ ] Replace dbConnect() calls
- [ ] Convert model imports
- [ ] Update CRUD operations
- [ ] Update relations/populate
- [ ] Update transactions
- [ ] Test all endpoints
- [ ] Update error handling
- [ ] Remove Mongoose dependencies (optional)

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma vs Mongoose](https://www.prisma.io/docs/concepts/more/comparisons/prisma-and-mongoose)
- [Migration Guide](../MIGRATION_GUIDE.md)
