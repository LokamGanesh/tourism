# 🔐 Admin & Government Access Guide

## Hidden Access URLs

Since admin and government options are not visible in the public UI, use these direct URLs:

### 🛡️ Admin Access
- **URL**: `http://localhost:3000/admin-login`
- **Email**: `admin@jharkhand-tourism.gov.in`
- **Password**: `Admin@2024`
- **Dashboard**: Automatically redirects to `/dashboard/admin`

### 🏛️ Government Access
- **URL**: `http://localhost:3000/admin-login`
- **Email**: `gov@jharkhand.gov.in`
- **Password**: `Gov@2024`
- **Dashboard**: Automatically redirects to `/dashboard/government`

## 📱 Public User Access

### Tourist & Travel Guide
- **URL**: `http://localhost:3000/auth`
- **Roles Available**: Tourist, Travel Guide only
- **Registration**: Open signup for both roles

## 🔒 Security Features

1. **Hidden Admin Access**: No visible links to admin areas
2. **Direct URL Access**: Admin login only accessible via direct URL
3. **Role-Based Redirects**: Automatic dashboard routing based on user role
4. **Secure Authentication**: JWT tokens with role verification

## 🚀 Quick Access Commands

```bash
# Start the application
npm run dev

# Initialize database (if MongoDB is running)
npm run init-db

# Check setup status
npm run check-setup
```

## 📊 Dashboard Features

### Admin Dashboard (`/dashboard/admin`)
- Review pending travel guide applications
- Verify certificates and documents
- Approve/reject travel packages
- Manage user accounts
- View system statistics

### Government Dashboard (`/dashboard/government`)
- Comprehensive tourism analytics
- Revenue reports and statistics
- Popular destination insights
- Monthly visitor trends
- Export detailed reports
- Statistical data visualization

### Tourist Dashboard (`/dashboard/tourist`)
- Browse verified travel packages
- Filter by category, price, difficulty
- View travel guide ratings
- Book travel experiences

### Travel Guide Dashboard (`/dashboard/travel-guide`)
- Add and manage travel packages
- Manage vehicle fleet
- Add and verify drivers
- Track bookings and ratings
- Upload certificates for verification

## 🔧 Development Notes

- Admin/Government accounts are created automatically via `npm run init-db`
- All passwords are hashed with bcryptjs
- JWT tokens expire in 7 days
- Role-based access control prevents unauthorized access
- MongoDB connection required for full functionality

## 🆘 Troubleshooting

If you can't access admin areas:
1. Ensure the development server is running
2. Use the exact URLs provided above
3. Check that default users were created with `npm run init-db`
4. Verify MongoDB is running if using database features

---

**Security Note**: Keep these credentials secure and change them in production environments.

nodemodules/
.env.local