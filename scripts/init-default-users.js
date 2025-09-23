const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jharkhand-tourism';

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['tourist', 'travel_guide', 'admin', 'government'], required: true },
  isVerified: { type: Boolean, default: false },
  department: String,
  position: String,
  accessLevel: Number,
  permissions: [String]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Brand New Login Credentials for All User Types
const USER_CREDENTIALS = {
  tourist: {
    email: 'tourist@test.com',
    password: 'test123',
    name: 'Arjun Patel',
    role: 'tourist'
  },
  travel_guide: {
    email: 'travelguide@test.com',
    password: 'guide456',
    name: 'Meera Gupta',
    role: 'travel_guide',
    licenseNumber: 'JH-GUIDE-2024',
    experience: 6,
    languages: ['English', 'Hindi', 'Odia'],
    specializations: ['Nature Tours', 'Tribal Culture', 'Waterfall Expeditions'],
    isVerified: true
  },
  admin: {
    email: 'admin@test.com',
    password: 'admin789',
    name: 'Vikash Kumar',
    role: 'admin',
    department: 'Tourism Administration',
    permissions: ['verify_certificates', 'approve_travels', 'manage_users']
  },
  government: {
    email: 'govt@test.com',
    password: 'govt321',
    name: 'Smt. Kavita Singh',
    role: 'government',
    department: 'State Tourism Board',
    position: 'Joint Secretary',
    accessLevel: 5
  }
};

async function hashPassword(password) {
  return await bcryptjs.hash(password, 12);
}

async function initDefaultUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔗 Connected to database');
    
    // Clear existing users first
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create all user types
    for (const [userType, credentials] of Object.entries(USER_CREDENTIALS)) {
      const userData = {
        ...credentials,
        password: await hashPassword(credentials.password),
        isVerified: true
      };
      
      const user = new User(userData);
      await user.save();
      console.log(`✅ ${userType.charAt(0).toUpperCase() + userType.slice(1)} user created: ${credentials.name}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('🔑 FRESH LOGIN CREDENTIALS FOR ALL USER TYPES');
    console.log('='.repeat(70));
    
    console.log('\n👤 TOURIST LOGIN:');
    console.log(`Email: ${USER_CREDENTIALS.tourist.email}`);
    console.log(`Password: ${USER_CREDENTIALS.tourist.password}`);
    console.log(`Name: ${USER_CREDENTIALS.tourist.name}`);
    
    console.log('\n🗺️  TRAVEL GUIDE LOGIN:');
    console.log(`Email: ${USER_CREDENTIALS.travel_guide.email}`);
    console.log(`Password: ${USER_CREDENTIALS.travel_guide.password}`);
    console.log(`Name: ${USER_CREDENTIALS.travel_guide.name}`);
    console.log(`License: ${USER_CREDENTIALS.travel_guide.licenseNumber}`);
    
    console.log('\n📋 ADMIN LOGIN:');
    console.log(`Email: ${USER_CREDENTIALS.admin.email}`);
    console.log(`Password: ${USER_CREDENTIALS.admin.password}`);
    console.log(`Name: ${USER_CREDENTIALS.admin.name}`);
    
    console.log('\n🏛️  GOVERNMENT LOGIN:');
    console.log(`Email: ${USER_CREDENTIALS.government.email}`);
    console.log(`Password: ${USER_CREDENTIALS.government.password}`);
    console.log(`Name: ${USER_CREDENTIALS.government.name}`);
    console.log(`Position: ${USER_CREDENTIALS.government.position}`);
    
    console.log('\n' + '='.repeat(70));
    console.log('✨ All users created successfully!');
    console.log('🚀 Ready to login with any of the above credentials');
    console.log('='.repeat(70));

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error initializing default users:', error);
    process.exit(1);
  }
}

// Run the initialization
initDefaultUsers();
