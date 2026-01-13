@echo off
REM PostgreSQL Setup Script for Jharkhand Tourism Platform (Windows)
REM This script sets up PostgreSQL and migrates from MongoDB

echo.
echo Setting up PostgreSQL for Jharkhand Tourism Platform
echo ========================================================
echo.

REM Check if .env file exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create a .env file with DATABASE_URL
    exit /b 1
)

REM Check if DATABASE_URL is set
findstr /C:"DATABASE_URL" .env >nul
if errorlevel 1 (
    echo ERROR: DATABASE_URL not found in .env file!
    echo Please add: DATABASE_URL=postgresql://...
    exit /b 1
)

echo Environment configuration found
echo.

REM Install dependencies
echo Installing dependencies...
call npm install @prisma/client pg
call npm install -D prisma @types/pg

echo Dependencies installed
echo.

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate

echo Prisma Client generated
echo.

REM Test PostgreSQL connection
echo Testing PostgreSQL connection...
call node scripts/test-postgres.js

if errorlevel 1 (
    echo.
    echo ERROR: PostgreSQL connection test failed!
    echo Please check your DATABASE_URL and try again
    exit /b 1
)

echo.
echo Pushing schema to database...
call npx prisma db push --accept-data-loss

echo Database schema created
echo.

REM Ask about data migration
set /p migrate_data="Do you want to migrate data from MongoDB? (y/n): "

if /i "%migrate_data%"=="y" (
    echo.
    echo Starting data migration...
    call node scripts/migrate-mongo-to-postgres.js
    
    if errorlevel 1 (
        echo WARNING: Data migration had some errors. Check the logs above.
    ) else (
        echo Data migration completed
    )
)

echo.
echo PostgreSQL setup complete!
echo.
echo Next steps:
echo 1. Update your API routes to use Prisma (see MIGRATION_GUIDE.md)
echo 2. Test your application thoroughly
echo 3. Run 'npm run prisma:studio' to view your database
echo.

pause
