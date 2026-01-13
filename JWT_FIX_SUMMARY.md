# JWT Authentication Fix Summary

## Problem
Your application was experiencing JWT authentication errors:
- "jwt malformed" errors
- "Invalid token" errors  
- 401 Unauthorized on upload endpoint
- 500 errors on admin API routes

## Root Cause
The JWT_SECRET environment variable was being loaded inconsistently across different API routes. Some routes were using inline `jwt.verify()` with potentially different secrets, causing token verification to fail.

## Solution Applied
Centralized all JWT token verification to use the `verifyToken()` function from `lib/auth.ts`. This ensures:
- Consistent JWT_SECRET usage across all routes
- Single source of truth for token verification
- Better error handling
- Warning logs when JWT_SECRET is not found in environment

## Files Updated
1. `lib/auth.ts` - Added warning log for missing JWT_SECRET
2. `app/api/admin/places/route.ts` - Updated to use `verifyToken()`
3. `app/api/admin/hotels/route.ts` - Updated to use `verifyToken()`
4. `app/api/admin/restaurants/route.ts` - Updated to use `verifyToken()`
5. `app/api/admin/events/route.ts` - Updated to use `verifyToken()`
6. `app/api/upload/route.ts` - Updated to use `verifyToken()`

## Next Steps
1. **Restart your development server** - This is critical! Environment variables are loaded at startup.
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

2. **Clear browser storage** - Old tokens might be invalid:
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Clear localStorage
   - Refresh the page

3. **Login again** - Get a fresh token with the correct secret

4. **Test the admin features** - Try creating/editing places, hotels, restaurants, and uploading images

## Verification
After restarting, check the console for:
- ✅ No "WARNING: JWT_SECRET not found" messages
- ✅ Successful API calls to `/api/admin/*` endpoints
- ✅ Successful image uploads to `/api/upload`

## If Issues Persist
1. Verify `.env` file has `JWT_SECRET` set
2. Check that `.env` is in the root directory (not in a subdirectory)
3. Ensure no typos in the environment variable name
4. Try logging out and logging in again to get a fresh token
