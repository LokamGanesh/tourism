/**
 * PostgreSQL Connection Test Script
 * Run with: node scripts/test-postgres.js
 */

const { Pool } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

async function testPostgreSQL() {
  console.log('Testing PostgreSQL connection...\n');
  
  console.log('Database URL:', DATABASE_URL ? '✓ Set' : '✗ Not set');
  console.log('');
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not configured!');
    console.log('Please set DATABASE_URL in your .env file');
    console.log('Format: postgresql://user:password@host:port/database');
    return;
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Attempting to connect...');
    const client = await pool.connect();
    
    console.log('✓ PostgreSQL connection successful!\n');
    
    // Get database info
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('Database:', result.rows[0].current_database);
    console.log('User:', result.rows[0].current_user);
    console.log('Version:', result.rows[0].version.split(',')[0]);
    
    // Test table creation
    console.log('\nTesting table operations...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✓ Test table created');
    
    // Insert test data
    await client.query(`
      INSERT INTO test_connection (message) VALUES ('Connection test successful')
    `);
    console.log('✓ Test data inserted');
    
    // Query test data
    const testResult = await client.query('SELECT * FROM test_connection ORDER BY id DESC LIMIT 1');
    console.log('✓ Test data retrieved:', testResult.rows[0].message);
    
    // Clean up
    await client.query('DROP TABLE test_connection');
    console.log('✓ Test table cleaned up');
    
    client.release();
    await pool.end();
    
    console.log('\n✅ All tests passed! PostgreSQL is ready to use.');
    
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:');
    console.error(error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Connection refused. This usually means:');
      console.log('1. PostgreSQL server is not running');
      console.log('2. Wrong host or port in connection string');
      console.log('3. Firewall blocking the connection');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication failed. Check your username and password.');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Connection timeout. Check:');
      console.log('1. Your internet connection');
      console.log('2. Database server is accessible');
      console.log('3. Firewall settings');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Database does not exist. Create it first or check the database name.');
    }
    
    await pool.end();
  }
}

testPostgreSQL();
