# 🔑 Fresh Login Credentials

## All User Types - Clean & Ready to Test

### 👤 **Tourist Account**
- **Email**: `tourist@jharkhand.com`
- **Password**: `tourist123`
- **Name**: Rahul Kumar
- **Access**: Tourist dashboard with travel browsing
- **Login URL**: `http://localhost:3000/auth?mode=login`

### 🗺️ **Travel Guide Account**
- **Email**: `guide@jharkhand.com`
- **Password**: `guide123`
- **Name**: Priya Sharma
- **License**: JH-TG-2024-001
- **Access**: Travel guide dashboard with service management
- **Login URL**: `http://localhost:3000/auth?mode=login`

### 📋 **Admin Account**
- **Email**: `admin@jharkhand.com`
- **Password**: `admin123`
- **Name**: Amit Singh
- **Department**: Tourism Department
- **Access**: Admin dashboard for verification and approval
- **Login URL**: `http://localhost:3000/admin-login`

### 🏛️ **Government Account**
- **Email**: `government@jharkhand.com`
- **Password**: `govt123`
- **Name**: Dr. Sunita Devi
- **Position**: Tourism Director
- **Access**: Government dashboard with analytics
- **Login URL**: `http://localhost:3000/admin-login`

## 🚀 Quick Test Flow

1. **Start Application**: Visit `http://localhost:3000`
2. **Welcome Page**: Shows website information and login options
3. **Choose User Type**: Click on any user type card
4. **Login**: Use credentials above
5. **Dashboard**: Access role-specific features

## 📱 Dashboard Features by Role

### Tourist Dashboard
- Browse verified travel packages
- Filter by category, price, difficulty
- View travel guide ratings and reviews
- Book travel experiences

### Travel Guide Dashboard
- Add and manage travel packages
- Manage vehicle fleet
- Add and verify drivers
- Track bookings and ratings
- Certificate management

### Admin Dashboard
- Review pending applications
- Verify certificates
- Approve/reject services
- User management
- System oversight

### Government Dashboard
- Tourism statistics
- Revenue analytics
- Popular destinations data
- Monthly trends
- Export reports

## 🔧 Setup Commands

```bash
# Initialize all test accounts
npm run init-db

# Start development server
npm run dev

# Check setup status
npm run check-setup
```

---

**Note**: All accounts are pre-verified and ready for immediate testing!
