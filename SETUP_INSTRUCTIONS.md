# 🚀 Jharkhand Tourism Platform - Setup Instructions

## Quick Start Guide

### 1. **Install MongoDB** (Required)

#### Option A: Install MongoDB Community Edition
1. Download from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Default connection: `mongodb://localhost:27017`

#### Option B: Use MongoDB Atlas (Cloud)
1. Create free account at: https://www.mongodb.com/atlas
2. Create a cluster and get connection string
3. Update `.env.local` with your Atlas connection string

### 2. **Start MongoDB Service**

#### Windows:
```bash
# Start MongoDB service
net start MongoDB

# Or run manually
mongod --dbpath "C:\data\db"
```

#### macOS/Linux:
```bash
# Start MongoDB
brew services start mongodb/brew/mongodb-community
# or
sudo systemctl start mongod
```

### 3. **Initialize Database**
```bash
# Make sure MongoDB is running first, then:
npm run init-db
```

### 4. **Start Development Server**
```bash
npm run dev
```

## 🔍 **Verification Steps**

1. **Check if MongoDB is running:**
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Should connect successfully

2. **Test the application:**
   - Visit: http://localhost:3000
   - Click "Sign In" button
   - Try creating a tourist account
   - Try logging in with admin credentials

## 🔑 **Default Login Credentials**

### Admin Account:
- **Email:** `admin@jharkhand-tourism.gov.in`
- **Password:** `Admin@2024`

### Government Account:
- **Email:** `gov@jharkhand.gov.in`
- **Password:** `Gov@2024`

## 🛠️ **Troubleshooting**

### MongoDB Connection Issues:
1. **Error: "MongooseServerSelectionError"**
   - MongoDB is not running
   - Start MongoDB service (see step 2 above)

2. **Port 27017 in use:**
   ```bash
   # Kill existing MongoDB processes
   pkill mongod
   # Then restart
   ```

3. **Permission Issues:**
   ```bash
   # Create data directory
   sudo mkdir -p /data/db
   sudo chown -R $USER /data/db
   ```

### Application Issues:
1. **Port 3000 in use:**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **Dependencies Issues:**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📱 **Testing the Platform**

### Test Tourist Flow:
1. Go to http://localhost:3000
2. Click "Sign In" → "Sign Up"
3. Select "Tourist" role
4. Create account and login
5. Browse travel packages

### Test Travel Guide Flow:
1. Sign up as "Travel Guide"
2. Fill in license details
3. Login (will show pending verification)
4. Access dashboard to add travels/vehicles

### Test Admin Flow:
1. Login with admin credentials
2. Go to "Pending Reviews" tab
3. Approve/reject travel guide applications
4. Verify certificates

### Test Government Flow:
1. Login with government credentials
2. View comprehensive analytics
3. Export reports
4. Check tourism statistics

## 🗄️ **Database Structure**

After initialization, your MongoDB will have:
- **Database:** `jharkhand-tourism`
- **Collections:**
  - `users` (all user accounts)
  - `travels` (travel packages)
  - `vehicles` (transport options)
  - `drivers` (driver information)

## 🔧 **Development Notes**

- The application uses JWT tokens for authentication
- All passwords are hashed with bcryptjs
- Role-based access control is implemented
- Responsive design works on all devices
- Mock data is used for travel listings (can be replaced with real data)

## 🚀 **Production Deployment**

Before deploying to production:
1. Change default passwords in `/lib/auth.ts`
2. Use strong JWT secrets in environment variables
3. Set up MongoDB with authentication
4. Configure HTTPS
5. Set up proper backup systems
6. Add rate limiting and security headers

---

**Need Help?** Check the console logs for detailed error messages or refer to the main README.md file.
