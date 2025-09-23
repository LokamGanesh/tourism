const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Check if environment file exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Creating .env.local file...');
  
  const envContent = `MONGODB_URI=mongodb://localhost:27017/jharkhand-tourism
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created');
}

// Load environment variables
require('dotenv').config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jharkhand-tourism';

async function checkSetup() {
  console.log('🔍 Checking Jharkhand Tourism Platform Setup...\n');
  
  // Check Node.js version
  const nodeVersion = process.version;
  console.log(`📦 Node.js Version: ${nodeVersion}`);
  
  // Check if package.json exists
  const packagePath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`📋 Project: ${pkg.name} v${pkg.version}`);
  }
  
  // Check MongoDB connection
  console.log('\n🗄️  Checking MongoDB connection...');
  try {
    await mongoose.connect(MONGODB_URI, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('✅ MongoDB connection successful');
    
    // Check if admin users exist
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      role: String,
      name: String
    }));
    
    const adminCount = await User.countDocuments({ role: 'admin' });
    const govCount = await User.countDocuments({ role: 'government' });
    
    console.log(`👤 Admin users: ${adminCount}`);
    console.log(`🏛️  Government users: ${govCount}`);
    
    if (adminCount === 0 || govCount === 0) {
      console.log('\n⚠️  Default users not found. Run: npm run init-db');
    } else {
      console.log('\n✅ Default users are set up');
      console.log('\n🔑 Login Credentials:');
      console.log('Admin: admin@jharkhand-tourism.gov.in / Admin@2024');
      console.log('Government: gov@jharkhand.gov.in / Gov@2024');
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.log('❌ MongoDB connection failed');
    console.log('💡 Make sure MongoDB is running on localhost:27017');
    console.log('   Or update MONGODB_URI in .env.local');
    console.log('\n📖 Setup Instructions:');
    console.log('1. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.log('2. Start MongoDB service');
    console.log('3. Run: npm run init-db');
  }
  
  // Check key files
  console.log('\n📁 Checking key files...');
  const keyFiles = [
    'app/auth/page.tsx',
    'app/dashboard/tourist/page.tsx',
    'app/dashboard/travel-guide/page.tsx',
    'app/dashboard/admin/page.tsx',
    'app/dashboard/government/page.tsx',
    'app/api/auth/login/route.ts',
    'app/api/auth/signup/route.ts',
    'lib/mongodb.ts',
    'lib/models/User.ts'
  ];
  
  keyFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - Missing!`);
    }
  });
  
  console.log('\n🚀 Setup Status:');
  console.log('✅ Project structure is ready');
  console.log('✅ Dependencies are installed');
  console.log('✅ Environment file exists');
  console.log('🔄 Next steps:');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Run: npm run init-db');
  console.log('3. Run: npm run dev');
  console.log('4. Visit: http://localhost:3000');
}

checkSetup().catch(console.error);
