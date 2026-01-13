/**
 * MongoDB to PostgreSQL Data Migration Script
 * 
 * This script migrates data from MongoDB to PostgreSQL
 * Run with: node scripts/migrate-mongo-to-postgres.js
 */

const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

async function migrateUsers() {
  console.log('Migrating users...');
  
  // Define MongoDB User schema
  const UserSchema = new mongoose.Schema({}, { strict: false });
  const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);
  
  const mongoUsers = await MongoUser.find({});
  console.log(`Found ${mongoUsers.length} users in MongoDB`);
  
  let migrated = 0;
  let skipped = 0;
  
  for (const mongoUser of mongoUsers) {
    try {
      // Check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email: mongoUser.email }
      });
      
      if (existing) {
        console.log(`Skipping existing user: ${mongoUser.email}`);
        skipped++;
        continue;
      }
      
      // Map MongoDB document to Prisma schema
      const userData = {
        email: mongoUser.email,
        mobile: mongoUser.mobile || null,
        password: mongoUser.password,
        name: mongoUser.name,
        role: mongoUser.role,
        isVerified: mongoUser.isVerified || false,
        otp: mongoUser.otp || null,
        otpExpiry: mongoUser.otpExpiry || null,
        
        // Tourist fields
        interests: mongoUser.preferences?.interests || [],
        budget: mongoUser.preferences?.budget || null,
        travelStyle: mongoUser.preferences?.travelStyle || null,
        
        // Travel Guide fields
        licenseNumber: mongoUser.licenseNumber || null,
        experience: mongoUser.experience || null,
        languages: mongoUser.languages || [],
        specializations: mongoUser.specializations || [],
        rating: mongoUser.rating || 0,
        totalReviews: mongoUser.totalReviews || 0,
        totalTrips: mongoUser.totalTrips || 0,
        isApproved: mongoUser.isApproved || false,
        location: mongoUser.location || null,
        bio: mongoUser.bio || null,
        profileImage: mongoUser.profileImage || null,
        
        // Admin fields
        permissions: mongoUser.permissions || [],
        department: mongoUser.department || null,
        position: mongoUser.position || null,
        accessLevel: mongoUser.accessLevel || null,
        
        // Provider fields
        businessName: mongoUser.businessName || null,
        businessType: mongoUser.businessType || null,
        hotelName: mongoUser.hotelName || null,
        hotelType: mongoUser.hotelType || null,
        restaurantName: mongoUser.restaurantName || null,
        cuisineType: mongoUser.cuisineType || [],
        address: mongoUser.address || null,
        description: mongoUser.description || null,
        services: mongoUser.services || [],
        amenities: mongoUser.amenities || [],
        specialties: mongoUser.specialties || [],
        images: mongoUser.images || [],
        priceRangeMin: mongoUser.priceRange?.min || null,
        priceRangeMax: mongoUser.priceRange?.max || null,
      };
      
      await prisma.user.create({ data: userData });
      migrated++;
      console.log(`✓ Migrated user: ${mongoUser.email}`);
      
    } catch (error) {
      console.error(`✗ Error migrating user ${mongoUser.email}:`, error.message);
    }
  }
  
  console.log(`\nUsers migration complete: ${migrated} migrated, ${skipped} skipped`);
}

async function migrateOTPs() {
  console.log('\nMigrating OTPs...');
  
  const OTPSchema = new mongoose.Schema({}, { strict: false });
  const MongoOTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
  
  const mongoOTPs = await MongoOTP.find({});
  console.log(`Found ${mongoOTPs.length} OTPs in MongoDB`);
  
  let migrated = 0;
  
  for (const mongoOTP of mongoOTPs) {
    try {
      await prisma.oTP.create({
        data: {
          email: mongoOTP.email,
          otp: mongoOTP.otp,
          type: mongoOTP.type,
          expiresAt: mongoOTP.expiresAt,
          createdAt: mongoOTP.createdAt || new Date(),
        }
      });
      migrated++;
    } catch (error) {
      console.error(`✗ Error migrating OTP:`, error.message);
    }
  }
  
  console.log(`OTPs migration complete: ${migrated} migrated`);
}

async function migratePlaces() {
  console.log('\nMigrating places...');
  
  const PlaceSchema = new mongoose.Schema({}, { strict: false });
  const MongoPlace = mongoose.models.Place || mongoose.model('Place', PlaceSchema);
  
  const mongoPlaces = await MongoPlace.find({});
  console.log(`Found ${mongoPlaces.length} places in MongoDB`);
  
  let migrated = 0;
  
  for (const mongoPlace of mongoPlaces) {
    try {
      await prisma.place.create({
        data: {
          name: mongoPlace.name,
          location: mongoPlace.location,
          description: mongoPlace.description || '',
          category: mongoPlace.category || 'general',
          images: mongoPlace.images || [],
          coordinates: mongoPlace.coordinates || { lat: 0, lng: 0 },
          rating: mongoPlace.rating || 0,
          reviews: mongoPlace.reviews || 0,
          entryFee: mongoPlace.entryFee || null,
          timings: mongoPlace.timings || null,
          bestSeason: mongoPlace.bestSeason || null,
        }
      });
      migrated++;
      console.log(`✓ Migrated place: ${mongoPlace.name}`);
    } catch (error) {
      console.error(`✗ Error migrating place ${mongoPlace.name}:`, error.message);
    }
  }
  
  console.log(`Places migration complete: ${migrated} migrated`);
}

async function migrateEvents() {
  console.log('\nMigrating events...');
  
  const EventSchema = new mongoose.Schema({}, { strict: false });
  const MongoEvent = mongoose.models.Event || mongoose.model('Event', EventSchema);
  
  const mongoEvents = await MongoEvent.find({});
  console.log(`Found ${mongoEvents.length} events in MongoDB`);
  
  let migrated = 0;
  
  for (const mongoEvent of mongoEvents) {
    try {
      await prisma.event.create({
        data: {
          name: mongoEvent.name,
          description: mongoEvent.description || '',
          location: mongoEvent.location,
          startDate: mongoEvent.startDate,
          endDate: mongoEvent.endDate,
          category: mongoEvent.category || 'general',
          images: mongoEvent.images || [],
          ticketPrice: mongoEvent.ticketPrice || null,
          maxCapacity: mongoEvent.maxCapacity || null,
          organizer: mongoEvent.organizer || 'Unknown',
          contactInfo: mongoEvent.contactInfo || null,
          isActive: mongoEvent.isActive !== false,
        }
      });
      migrated++;
      console.log(`✓ Migrated event: ${mongoEvent.name}`);
    } catch (error) {
      console.error(`✗ Error migrating event ${mongoEvent.name}:`, error.message);
    }
  }
  
  console.log(`Events migration complete: ${migrated} migrated`);
}

async function main() {
  console.log('Starting MongoDB to PostgreSQL migration...\n');
  console.log('MongoDB URI:', MONGODB_URI ? '✓ Set' : '✗ Not set');
  console.log('PostgreSQL URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Not set');
  console.log('');
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in .env file');
    process.exit(1);
  }
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in .env file');
    process.exit(1);
  }
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
    
    // Test PostgreSQL connection
    console.log('Testing PostgreSQL connection...');
    await prisma.$connect();
    console.log('✓ Connected to PostgreSQL\n');
    
    // Run migrations
    await migrateUsers();
    await migrateOTPs();
    await migratePlaces();
    await migrateEvents();
    
    // Add more migration functions as needed:
    // await migrateHotels();
    // await migrateRestaurants();
    // await migrateBookings();
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    await prisma.$disconnect();
    console.log('\nDisconnected from databases');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
