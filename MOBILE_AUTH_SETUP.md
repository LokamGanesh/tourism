# Mobile Authentication with SMS Verification - Setup Instructions

## 🚀 Quick Start Guide

Follow these steps to run the Jharkhand Tourism platform with mobile authentication and SMS verification.

### Step 1: Install Dependencies

```bash
npm install
```

The Twilio package has already been added to package.json.

### Step 2: Set Up Environment Variables

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your `.env.local` file:**
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/jharkhand-tourism

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # Twilio Configuration (Get these from Twilio Console)
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### Step 3: Set Up Twilio Account

1. **Create Twilio Account:**
   - Go to https://www.twilio.com
   - Sign up for a free account
   - Verify your email and phone number

2. **Get Credentials:**
   - **Account SID & Auth Token:** From Twilio Console Dashboard
   - **Verify Service:** Go to Verify > Services, create new service
   - **Phone Number:** Go to Phone Numbers > Manage (for manual SMS fallback)

3. **For Testing (Free Account):**
   - Add your test phone numbers to verified numbers in Twilio Console
   - Use international format: +91xxxxxxxxxx for India

### Step 4: Set Up MongoDB

```bash
# Make sure MongoDB is running
mongod

# Initialize default users (optional)
npm run init-db
```

### Step 5: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3001` (or 3000 if available).

## 🔧 New Authentication Flow

### For Users Signing Up:
1. **Enter mobile number** (required)
2. **Enter email** (optional)
3. **Choose role** (Tourist/Travel Guide)
4. **Fill additional details** (name, password, etc.)
5. **Click "Send OTP & Sign Up"**
6. **Enter 6-digit OTP** received via SMS
7. **Click "Verify OTP"** to complete registration

### For Users Logging In:
1. **Enter mobile number** (no email required)
2. **Click "Send OTP"**
3. **Enter 6-digit OTP** received via SMS
4. **Click "Verify OTP"** to login

## 📱 Features Implemented

### ✅ Mobile-First Authentication
- Mobile number is now the primary identifier
- Email is optional for signup
- No password required for login (OTP-based)

### ✅ SMS Verification
- Automatic OTP generation and sending
- 10-minute OTP expiry
- Resend OTP functionality with 60-second cooldown
- Fallback to manual SMS if Verify Service fails

### ✅ Enhanced Security
- OTP-based authentication
- Rate limiting on OTP requests
- Secure token-based sessions

### ✅ User Experience
- Clean, intuitive UI
- Real-time form validation
- Loading states and error handling
- Mobile-responsive design

## 🗃️ Database Changes

### Updated User Model:
```typescript
{
  mobile: string (required, unique)
  email?: string (optional)
  password: string (for signup only)
  otp?: string (temporary)
  otpExpiry?: Date (temporary)
  // ... other fields
}
```

## 🔗 API Endpoints

### New Endpoints:
- `POST /api/auth/send-otp` - Send OTP to mobile number
- `POST /api/auth/verify-otp` - Verify OTP and authenticate

### Updated Endpoints:
- Login/Signup now use mobile-based authentication

## 🧪 Testing

### Test Credentials (After Setup):
```
Mobile: +91xxxxxxxxxx (your verified number)
OTP: Will be sent via SMS
```

### Admin/Government Access:
These roles still use the original email-based system for now. You can access them directly:
- Admin: admin@jharkhand-tourism.gov.in / Admin@2024
- Government: gov@jharkhand.gov.in / Gov@2024

## 🚨 Important Notes

### For Development:
- Use your own verified phone number for testing
- Twilio free account has limitations (verified numbers only)
- Check Twilio Console logs for debugging

### For Production:
- Upgrade Twilio account to remove limitations
- Implement additional rate limiting
- Set up proper monitoring and logging
- Consider SMS costs for your user base

## 📋 Troubleshooting

### Common Issues:

1. **OTP not received:**
   - Check if phone number is verified in Twilio Console
   - Verify Twilio credentials in .env.local
   - Check Twilio Console logs

2. **"User already exists" error:**
   - The mobile number is already registered
   - Try logging in instead of signing up

3. **Database connection error:**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env.local

4. **Twilio errors:**
   - Verify Account SID and Auth Token
   - Check Verify Service SID
   - Ensure sufficient Twilio balance

## 📞 Support

- **Twilio Setup:** See `TWILIO_SETUP_GUIDE.md`
- **General Issues:** Check console logs and network tab
- **Database Issues:** Verify MongoDB connection

## 🎯 Next Steps

1. **Test the complete flow** with your mobile number
2. **Configure Twilio** with your credentials
3. **Customize OTP message** in `lib/twilio.ts`
4. **Add rate limiting** for production use
5. **Set up monitoring** for SMS delivery

The mobile authentication system is now ready to use! 🎉
