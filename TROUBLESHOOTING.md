# Troubleshooting Guide - PostgreSQL Migration

## Common Issues and Solutions

### 1. Connection Issues

#### Problem: "Connection refused" or "ECONNREFUSED"

**Symptoms:**
```
Error: connect ECONNREFUSED
```

**Solutions:**
1. Check if DATABASE_URL is set correctly in `.env`
   ```bash
   # Windows
   type .env | findstr DATABASE_URL
   
   # Mac/Linux
   grep DATABASE_URL .env
   ```

2. Verify the connection string format:
   ```
   postgresql://user:password@host:port/database
   ```

3. Test the connection:
   ```bash
   node scripts/test-postgres.js
   ```

4. Check if Render.com database is running:
   - Visit https://dashboard.render.com
   - Check database status

#### Problem: "SSL connection required"

**Symptoms:**
```
Error: no pg_hba.conf entry for host
```

**Solution:**
The connection is already configured with SSL in `lib/postgres.ts`:
```typescript
ssl: {
  rejectUnauthorized: false
}
```

If still failing, check your DATABASE_URL includes `?sslmode=require`

---

### 2. Prisma Issues

#### Problem: "Prisma Client not generated"

**Symptoms:**
```
Error: Cannot find module '@prisma/client'
```

**Solution:**
```bash
# Generate Prisma Client
npm run prisma:generate

# Or manually
npx prisma generate
```

#### Problem: "Schema validation failed"

**Symptoms:**
```
Error: Schema parsing failed
```

**Solution:**
1. Check `prisma/schema.prisma` for syntax errors
2. Validate the schema:
   ```bash
   npx prisma validate
   ```
3. Format the schema:
   ```bash
   npx prisma format
   ```

#### Problem: "Migration failed"

**Symptoms:**
```
Error: Migration failed to apply
```

**Solution:**
1. Check migration status:
   ```bash
   npx prisma migrate status
   ```

2. Reset database (WARNING: deletes all data):
   ```bash
   npx prisma migrate reset
   ```

3. Or use push for development:
   ```bash
   npm run prisma:push
   ```

---

### 3. Installation Issues

#### Problem: "npm install fails"

**Symptoms:**
```
Error: Cannot install dependencies
```

**Solutions:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and reinstall:
   ```bash
   # Windows
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   
   # Mac/Linux
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check Node.js version (requires 18+):
   ```bash
   node --version
   ```

#### Problem: "Prisma binary download fails"

**Symptoms:**
```
Error: Could not download Prisma binaries
```

**Solutions:**
1. Check internet connection
2. Try with different network
3. Set proxy if needed:
   ```bash
   npm config set proxy http://proxy.company.com:8080
   ```

---

### 4. Query Issues

#### Problem: "Type error in query"

**Symptoms:**
```typescript
// Error: Property 'findOne' does not exist
await prisma.user.findOne({ where: { email } })
```

**Solution:**
Use correct Prisma method:
```typescript
// ✅ Correct
await prisma.user.findUnique({ where: { email } })
```

See `docs/MONGOOSE_TO_PRISMA_CHEATSHEET.md` for all conversions.

#### Problem: "Unique constraint violation"

**Symptoms:**
```
Error: Unique constraint failed on the fields: (`email`)
```

**Solution:**
Check if record already exists before creating:
```typescript
const existing = await prisma.user.findUnique({
  where: { email }
})

if (existing) {
  // Handle existing user
  return { error: 'User already exists' }
}

// Create new user
await prisma.user.create({ data: { ... } })
```

#### Problem: "Foreign key constraint failed"

**Symptoms:**
```
Error: Foreign key constraint failed
```

**Solution:**
Ensure related record exists:
```typescript
// Check if hotel exists before creating booking
const hotel = await prisma.hotel.findUnique({
  where: { id: hotelId }
})

if (!hotel) {
  throw new Error('Hotel not found')
}

// Now create booking
await prisma.hotelBooking.create({
  data: {
    hotelId,
    userId,
    // ...
  }
})
```

---

### 5. Migration Script Issues

#### Problem: "MongoDB connection fails during migration"

**Symptoms:**
```
Error: Could not connect to MongoDB
```

**Solution:**
1. Check if MONGODB_URI is still in `.env`
2. Verify MongoDB is accessible
3. If you don't need to migrate data, skip the migration:
   ```bash
   # Just setup PostgreSQL without migration
   npm run prisma:push
   ```

#### Problem: "Data transformation errors"

**Symptoms:**
```
Error: Cannot convert MongoDB ObjectId to UUID
```

**Solution:**
The migration script handles this automatically. If you see this error:
1. Check the migration script logs
2. Some records might be skipped (this is normal)
3. Manually verify critical data after migration

---

### 6. Development Issues

#### Problem: "Hot reload not working"

**Symptoms:**
Changes to Prisma schema don't reflect in app

**Solution:**
1. Regenerate Prisma Client:
   ```bash
   npm run prisma:generate
   ```

2. Restart dev server:
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

#### Problem: "Type errors after schema changes"

**Symptoms:**
```typescript
// Error: Property 'newField' does not exist
user.newField
```

**Solution:**
1. Update schema in `prisma/schema.prisma`
2. Push changes:
   ```bash
   npm run prisma:push
   ```
3. Regenerate client:
   ```bash
   npm run prisma:generate
   ```
4. Restart TypeScript server in VS Code:
   - Press `Ctrl+Shift+P`
   - Type "TypeScript: Restart TS Server"

---

### 7. Production Issues

#### Problem: "Build fails in production"

**Symptoms:**
```
Error: Cannot find Prisma Client
```

**Solution:**
Add postinstall script to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

#### Problem: "Connection pool exhausted"

**Symptoms:**
```
Error: Connection pool timeout
```

**Solution:**
1. Increase pool size in `lib/postgres.ts`:
   ```typescript
   max: 30  // Increase from 20
   ```

2. Or optimize queries to release connections faster

3. Check for connection leaks (not releasing connections)

---

### 8. Image Management Issues

#### Problem: "Images not displaying"

**Symptoms:**
Images show broken link icon

**Solutions:**
1. Check if image URLs are valid:
   ```typescript
   const place = await prisma.place.findUnique({
     where: { id },
     select: { images: true }
   })
   console.log('Image URLs:', place.images)
   ```

2. Verify cloud storage is accessible

3. Check CORS settings if using external storage

#### Problem: "Too many images slowing queries"

**Symptoms:**
Slow response times when fetching places

**Solution:**
Use pagination and select only needed fields:
```typescript
const places = await prisma.place.findMany({
  take: 20,
  skip: page * 20,
  select: {
    id: true,
    name: true,
    images: true  // Only if needed
  }
})
```

---

### 9. Authentication Issues

#### Problem: "OTP verification fails"

**Symptoms:**
```
Error: Invalid OTP
```

**Solutions:**
1. Check if OTP exists in database:
   ```bash
   npm run prisma:studio
   # Navigate to OTP table
   ```

2. Verify OTP hasn't expired:
   ```typescript
   const otp = await prisma.oTP.findFirst({
     where: { email, otp }
   })
   
   if (new Date() > otp.expiresAt) {
     // OTP expired
   }
   ```

3. Check email service is working

#### Problem: "JWT token invalid"

**Symptoms:**
```
Error: Invalid token
```

**Solution:**
1. Check JWT_SECRET in `.env`
2. Verify token format
3. Check token expiration

---

### 10. Performance Issues

#### Problem: "Slow queries"

**Symptoms:**
API responses take too long

**Solutions:**
1. Add indexes (already done in schema)
2. Use `select` to fetch only needed fields
3. Use pagination
4. Check query in Prisma Studio

#### Problem: "High memory usage"

**Symptoms:**
Application crashes with out of memory

**Solutions:**
1. Use pagination for large datasets
2. Stream large results
3. Increase Node.js memory:
   ```bash
   node --max-old-space-size=4096 server.js
   ```

---

## Diagnostic Commands

### Check Environment
```bash
# Windows
echo %DATABASE_URL%
echo %MONGODB_URI%

# Mac/Linux
echo $DATABASE_URL
echo $MONGODB_URI
```

### Test Connections
```bash
# PostgreSQL
node scripts/test-postgres.js

# MongoDB (if still needed)
node scripts/test-mongodb.js
```

### Check Prisma Status
```bash
# Validate schema
npx prisma validate

# Check migrations
npx prisma migrate status

# View database
npm run prisma:studio
```

### Check Dependencies
```bash
# List installed packages
npm list @prisma/client
npm list pg

# Check for updates
npm outdated
```

---

## Getting Help

### 1. Check Documentation
- `QUICKSTART.md` - Quick start guide
- `README_POSTGRES.md` - PostgreSQL guide
- `MIGRATION_GUIDE.md` - Migration instructions
- `docs/MONGOOSE_TO_PRISMA_CHEATSHEET.md` - Code examples

### 2. Check Logs
```bash
# Application logs
npm run dev

# Prisma logs (in code)
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
})
```

### 3. Use Prisma Studio
```bash
npm run prisma:studio
# Opens at http://localhost:5555
```

### 4. External Resources
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Render Support](https://render.com/docs/databases)

---

## Prevention Tips

### 1. Always Test Locally First
```bash
# Test connection
node scripts/test-postgres.js

# Test queries
npm run prisma:studio
```

### 2. Use Version Control
```bash
# Commit schema changes
git add prisma/schema.prisma
git commit -m "Update database schema"
```

### 3. Keep Dependencies Updated
```bash
# Check for updates
npm outdated

# Update Prisma
npm update @prisma/client prisma
```

### 4. Monitor Database
- Check Render.com dashboard regularly
- Monitor connection pool usage
- Watch for slow queries

### 5. Backup Regularly
- Render.com provides automatic backups
- Export important data periodically
- Test restore procedures

---

## Emergency Procedures

### If Database is Corrupted
1. Check Render.com dashboard
2. Restore from backup
3. Re-run migrations if needed

### If Migration Fails
1. Don't panic - data is safe
2. Check error message
3. Use `npx prisma migrate resolve` if needed
4. Contact support if stuck

### If Production is Down
1. Check database status on Render.com
2. Check application logs
3. Rollback to previous version if needed
4. Use MongoDB temporarily if configured

---

## Still Stuck?

If you've tried everything and still have issues:

1. **Check the example code:**
   - `app/api/auth/verify-otp-prisma/route.ts`
   - `lib/image-storage.ts`

2. **Review the cheatsheet:**
   - `docs/MONGOOSE_TO_PRISMA_CHEATSHEET.md`

3. **Test with minimal code:**
   ```typescript
   import prisma from '@/lib/prisma'
   
   async function test() {
     const users = await prisma.user.findMany()
     console.log(users)
   }
   
   test()
   ```

4. **Check Prisma documentation:**
   - https://www.prisma.io/docs

Remember: Most issues are configuration-related. Double-check your `.env` file and connection settings!
