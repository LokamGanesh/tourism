#!/bin/bash

# PostgreSQL Setup Script for Jharkhand Tourism Platform
# This script sets up PostgreSQL and migrates from MongoDB

echo "🚀 Setting up PostgreSQL for Jharkhand Tourism Platform"
echo "========================================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with DATABASE_URL"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ DATABASE_URL not found in .env file!"
    echo "Please add: DATABASE_URL=postgresql://..."
    exit 1
fi

echo "✓ Environment configuration found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install @prisma/client pg
npm install -D prisma @types/pg

echo "✓ Dependencies installed"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "✓ Prisma Client generated"
echo ""

# Test PostgreSQL connection
echo "🔌 Testing PostgreSQL connection..."
node scripts/test-postgres.js

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ PostgreSQL connection test failed!"
    echo "Please check your DATABASE_URL and try again"
    exit 1
fi

echo ""
echo "📊 Pushing schema to database..."
npx prisma db push --accept-data-loss

echo "✓ Database schema created"
echo ""

# Ask about data migration
echo "📋 Do you want to migrate data from MongoDB? (y/n)"
read -r migrate_data

if [ "$migrate_data" = "y" ] || [ "$migrate_data" = "Y" ]; then
    echo ""
    echo "🔄 Starting data migration..."
    node scripts/migrate-mongo-to-postgres.js
    
    if [ $? -eq 0 ]; then
        echo "✓ Data migration completed"
    else
        echo "⚠️  Data migration had some errors. Check the logs above."
    fi
fi

echo ""
echo "✅ PostgreSQL setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your API routes to use Prisma (see MIGRATION_GUIDE.md)"
echo "2. Test your application thoroughly"
echo "3. Run 'npm run prisma:studio' to view your database"
echo ""
