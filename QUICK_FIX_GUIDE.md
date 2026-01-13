# Quick Fix Guide - 500 Error Resolution

## The Problem
Your app is getting a 500 error because **MongoDB is not running**.

## The Solution (5 minutes)

### Option 1: MongoDB Atlas (Cloud - Easiest) ⭐

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (free account)
3. **Create a free cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0)
   - Click "Create"
4. **Create database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `jharkhand_admin`
   - Password: (create a strong password)
   - Click "Add User"
5. **Allow network access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"
6. **Get connection string:**
   - Go to "Database"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
7. **Update your .env file:**
   ```
   MONGODB_URI=mongodb+srv://jharkhand_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/jharkhand-tourism?retryWrites=true&w=majority
   ```
8. **Restart your server:**
   - Press Ctrl+C in the terminal
   - Run: `npm run dev`

### Option 2: Local MongoDB (If you prefer local)

1. **Download:** https://www.mongodb.com/try/download/community
2. **Install** MongoDB Community Server
3. **Start MongoDB service:**
   ```bash
   net start MongoDB
   ```
4. **Your .env is already configured** - no changes needed!

## Verify It's Working

After setting up MongoDB, test your connection:

```bash
node scripts/test-mongodb.js
```

You should see: `✓ MongoDB connection successful!`

## Test the Full Flow

1. Go to: http://localhost:3000/auth
2. Enter your email
3. Click "Send OTP"
4. Check your email for the OTP code
5. Enter the OTP
6. Complete registration

## Need Help?

- **Email working?** Run: `node scripts/test-email-simple.js`
- **MongoDB working?** Run: `node scripts/test-mongodb.js`
- **Full details:** See `ERROR_RESOLUTION_SUMMARY.md`

## Why MongoDB Atlas?

✅ No installation required
✅ Free forever (M0 tier)
✅ Automatic backups
✅ Works from anywhere
✅ Production-ready

That's it! Your authentication will work once MongoDB is set up.
