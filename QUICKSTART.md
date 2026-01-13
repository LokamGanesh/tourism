# 🚀 Quick Start - PostgreSQL Migration

## TL;DR - Get Started in 5 Minutes

Your Jharkhand Tourism platform is ready to migrate from MongoDB to PostgreSQL!

### Step 1: Install Dependencies (1 minute)

```bash
npm install
```

### Step 2: Setup Database (2 minutes)

**Windows:**
```bash
scripts\setup-postgres.bat
```

**Mac/Linux:**
```bash
chmod +x scripts/setup-postgres.sh
./scripts/setup-postgres.sh
```

### Step 3: Start Development (1 minute)

```bash
npm run dev
```

### Step 4: View Database (Optional)

```bash
npm run prisma:studio
```

Opens at http://localhost:5555

---

## ✅ What's Already Done

- ✅ PostgreSQL database configured on Render.com
- ✅ Complete Prisma schema with all models
- ✅ Connection utilities created
- ✅ Migration scripts ready
- ✅ Example code provided
- ✅ Full documentation written

## 📋 What You Need to Do

1. **Install dependencies** - `npm install`
2. **Setup database** - Run setup script
3. **Update API routes** - Convert Mongoose to Prisma
4. **Test everything** - Verify all features work

## 🔗 Your Database

**Connection String:**
```
postgresql://jharkhandtourism_user:a6XDleRfRgnfKFUxx7byBE0P0ymJSTWn@dpg-d5j7htu3jp1c73fahdt0-a.frankfurt-postgres.render.com/jharkhandtourism
```

Already configured in `.env` file!

## 📚 Documentation

- **Quick Start:** `README_POSTGRES.md`
- **Migration Guide:** `MIGRATION_GUIDE.md`
- **Cheatsheet:** `docs/MONGOOSE_TO_PRISMA_CHEATSHEET.md`
- **Complete Setup:** `POSTGRES_SETUP_COMPLETE.md`

## 🔄 Converting API Routes

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

See `docs/MONGOOSE_TO_PRISMA_CHEATSHEET.md` for complete conversion guide.

## 🖼️ Image Management

PostgreSQL is perfect for large image databases!

```typescript
import { addImagesToPlace, getImageStats } from '@/lib/image-storage'

// Add images
await addImagesToPlace(placeId, [url1, url2, url3])

// Get statistics
const stats = await getImageStats()
```

## 🛠️ Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run prisma:studio          # Database GUI

# Database
npm run prisma:generate        # Generate client
npm run prisma:push            # Push schema
npm run prisma:migrate         # Create migration

# Testing
node scripts/test-postgres.js  # Test connection
```

## 🆘 Need Help?

1. **Connection issues?** Run `node scripts/test-postgres.js`
2. **Schema issues?** Run `npm run prisma:generate`
3. **Migration help?** See `MIGRATION_GUIDE.md`
4. **Code examples?** See `docs/MONGOOSE_TO_PRISMA_CHEATSHEET.md`

## 🎯 Next Steps

1. ✅ Read this file (you're here!)
2. ⏳ Install dependencies
3. ⏳ Run setup script
4. ⏳ Update API routes
5. ⏳ Test application
6. ⏳ Deploy to production

## 💡 Why PostgreSQL?

- ✅ Better performance for large datasets
- ✅ ACID compliance for data integrity
- ✅ Advanced querying capabilities
- ✅ Built-in full-text search
- ✅ Better for image metadata
- ✅ Industry standard for production apps

## 🎉 Ready?

Run this command to get started:

```bash
npm install && scripts\setup-postgres.bat
```

Or on Mac/Linux:

```bash
npm install && ./scripts/setup-postgres.sh
```

That's it! Your PostgreSQL database will be ready in minutes.

---

**Questions?** Check the documentation files or the example code in `app/api/auth/verify-otp-prisma/route.ts`
