# Jharkhand Tourism Platform

A comprehensive tourism platform for Jharkhand with multi-role authentication and management system.

## Features

### 🏠 **Landing Page**
- Beautiful homepage showcasing Jharkhand tourism
- Information about tourist destinations
- Login/Signup options with role selection

### 👥 **Multi-Role Authentication System**
- **Tourist**: Browse and book verified travel packages
- **Travel Guide**: Manage travels, vehicles, and drivers
- **Admin**: Verify certificates and approve travel services
- **Government**: Access comprehensive tourism analytics

### 🎯 **Role-Specific Dashboards**

#### Tourist Dashboard
- Browse verified travel packages
- Filter by category, difficulty, and price
- View travel guide ratings and reviews
- Book travel experiences

#### Travel Guide Dashboard
- Add and manage travel packages
- Manage vehicle fleet
- Add and verify drivers
- Track bookings and ratings
- Certificate upload system

#### Admin Dashboard
- Review and verify travel guide certificates
- Approve/reject travel packages
- Verify vehicles and drivers
- Manage user accounts

#### Government Dashboard
- Comprehensive tourism statistics
- Revenue analytics by category
- Popular destination insights
- Monthly visitor trends
- Export detailed reports

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd planb
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/jharkhand-tourism
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup
Make sure MongoDB is running, then initialize the database with default users:
```bash
npm run init-db
```

This will create default admin and government accounts with the following credentials:

### 🔑 Default Login Credentials

#### Admin Account
- **Email**: `admin@jharkhand-tourism.gov.in`
- **Password**: `Admin@2024`
- **Role**: Admin (can verify certificates and approve travels)

#### Government Account
- **Email**: `gov@jharkhand.gov.in`
- **Password**: `Gov@2024`
- **Role**: Government (access to analytics dashboard)

### 4. Start the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📱 How to Use

### For Tourists
1. Visit the homepage
2. Click "Sign In" → "Sign Up" 
3. Select "Tourist" role
4. Fill in your details and create account
5. Login to access the tourist dashboard
6. Browse and book verified travel packages

### For Travel Guides
1. Click "Sign In" → "Sign Up"
2. Select "Travel Guide" role
3. Provide license number, experience, and other details
4. Wait for admin verification
5. Once verified, access your dashboard to:
   - Add travel packages
   - Manage vehicles and drivers
   - Track bookings

### For Admins
1. Use the default admin credentials to login
2. Access the admin dashboard to:
   - Review pending travel guide applications
   - Verify certificates
   - Approve/reject travel packages
   - Manage the platform

### For Government Officials
1. Use the default government credentials to login
2. Access comprehensive analytics including:
   - Tourism statistics
   - Revenue reports
   - Popular destinations
   - Growth metrics

## 🗄️ Database Access

### MongoDB Connection
- **Local**: `mongodb://localhost:27017/jharkhand-tourism`
- **Database Name**: `jharkhand-tourism`

### Collections Created
- `users` - All user accounts (tourists, guides, admin, government)
- `travels` - Travel packages created by guides
- `vehicles` - Vehicles registered by travel guides
- `drivers` - Drivers registered by travel guides
- `bookings` - Tourist bookings (to be implemented)

### Database Management
You can access your MongoDB database using:
- MongoDB Compass (GUI)
- MongoDB Shell
- Any MongoDB client

Connect using the URI: `mongodb://localhost:27017/jharkhand-tourism`

## 🔧 Technical Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens, bcryptjs
- **UI Components**: Lucide React icons, Headless UI
- **Styling**: Tailwind CSS with custom design system

## 📊 Key Features Implemented

✅ Multi-role authentication system
✅ Role-based access control
✅ Tourist dashboard with travel browsing
✅ Travel guide management system
✅ Admin verification panel
✅ Government analytics dashboard
✅ Database schema for all entities
✅ Responsive design
✅ Certificate upload system (UI ready)
✅ Vehicle and driver management
✅ Statistical reporting

## 🔄 Next Steps for Enhancement

- File upload functionality for certificates
- Payment integration for bookings
- Real-time notifications
- Email verification system
- Advanced search and filtering
- Mobile app development
- API documentation
- Automated testing

## 🆘 Support

If you encounter any issues:
1. Check that MongoDB is running
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the console for error messages

For additional help, refer to the code comments or create an issue in the repository.

---

**Note**: This is a development setup. For production deployment, ensure to:
- Use strong, unique passwords for default accounts
- Set up proper environment variables
- Configure MongoDB with authentication
- Enable HTTPS
- Set up proper backup systems
