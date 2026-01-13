# MongoDB Setup Instructions

## Current Issue
Your application is trying to connect to a local MongoDB instance, but MongoDB is not installed or running on your system. This is causing the 500 error when trying to send OTP.

## Solution 1: Use MongoDB Atlas (Cloud - Recommended)

### Steps:

1. **Create a MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Select "FREE" tier (M0)
   - Choose a cloud provider and region (closest to you)
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Your Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add your database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jharkhand-tourism`

6. **Update Your .env File**
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/jharkhand-tourism?retryWrites=true&w=majority
   ```

7. **Restart Your Development Server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

## Solution 2: Install MongoDB Locally

### For Windows:

1. **Download MongoDB**
   - Go to https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Run the installer

2. **Install MongoDB**
   - Choose "Complete" installation
   - Install MongoDB as a Service
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service**
   ```bash
   net start MongoDB
   ```

5. **Your .env is already configured for local MongoDB**
   ```
   MONGODB_URI=mongodb://localhost:27017/jharkhand-tourism
   ```

## Recommended: Use MongoDB Atlas

MongoDB Atlas is recommended because:
- ✓ No local installation required
- ✓ Free tier available
- ✓ Automatic backups
- ✓ Better for deployment
- ✓ Works from anywhere

## After Setup

Once MongoDB is configured, your OTP authentication will work correctly!

Test the connection by running:
```bash
npm run dev
```

Then try to sign up or log in with email OTP.
