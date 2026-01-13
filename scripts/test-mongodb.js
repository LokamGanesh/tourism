const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoDB() {
  console.log('Testing MongoDB connection...\n');
  
  const MONGODB_URI = process.env.MONGODB_URI;
  
  console.log('MongoDB URI:', MONGODB_URI ? '✓ Set' : '✗ Not set');
  console.log('Connection string:', MONGODB_URI);
  console.log('');
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not configured!');
    console.log('Please set MONGODB_URI in your .env file');
    return;
  }
  
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    
    console.log('✓ MongoDB connection successful!\n');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    
    await mongoose.connection.close();
    console.log('\n✓ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Connection refused. This usually means:');
      console.log('1. MongoDB is not running on your local machine');
      console.log('2. MongoDB is not installed');
      console.log('\nSolutions:');
      console.log('- Use MongoDB Atlas (cloud): See MONGODB_SETUP_INSTRUCTIONS.md');
      console.log('- Install MongoDB locally: https://www.mongodb.com/try/download/community');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication failed. Check your username and password.');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.log('\n💡 Connection timeout. Check:');
      console.log('1. Your internet connection');
      console.log('2. MongoDB Atlas IP whitelist settings');
      console.log('3. Your connection string');
    }
  }
}

testMongoDB();
