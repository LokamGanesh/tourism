# Twilio SMS Verification Setup Guide

This guide will help you set up Twilio SMS verification for the Jharkhand Tourism platform.

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com)
2. A verified phone number for testing
3. Node.js and npm installed

## Step 1: Create Twilio Account

1. Go to https://www.twilio.com and sign up for a free account
2. Verify your email and phone number
3. Complete the account setup process

## Step 2: Get Twilio Credentials

1. **Account SID and Auth Token:**
   - Go to your Twilio Console Dashboard
   - Copy your `Account SID` and `Auth Token`

2. **Phone Number (for manual SMS):**
   - Go to Phone Numbers > Manage > Active numbers
   - If you don't have one, buy a phone number
   - Copy the phone number (format: +1234567890)

3. **Verify Service SID (recommended):**
   - Go to Verify > Services in the Twilio Console
   - Create a new Verify Service
   - Copy the Service SID

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the Twilio configuration in `.env.local`:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```

## Step 4: Install Dependencies

```bash
npm install twilio
```

## Step 5: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Go to the authentication page and try to sign up with your phone number
3. You should receive an SMS with the OTP code

## Twilio Verify Service vs Manual SMS

The application supports two methods:

### Method 1: Twilio Verify Service (Recommended)
- Automatically handles OTP generation and verification
- Built-in rate limiting and security features
- Easier to implement and maintain
- Uses `TWILIO_VERIFY_SERVICE_SID`

### Method 2: Manual SMS
- Custom OTP generation and storage in database
- More control over the process
- Fallback when Verify Service fails
- Uses `TWILIO_PHONE_NUMBER`

## Testing with Free Account

Twilio free accounts have limitations:
- Can only send SMS to verified phone numbers
- Limited number of messages per month
- Add your test phone numbers to the verified list in Twilio Console

## Production Considerations

1. **Upgrade Twilio Account:** Remove free account limitations
2. **Rate Limiting:** Implement additional rate limiting for OTP requests
3. **Security:** Use environment-specific credentials
4. **Monitoring:** Set up Twilio webhooks for delivery status
5. **Compliance:** Ensure compliance with SMS regulations in your region

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error:**
   - Check your Account SID and Auth Token
   - Ensure no extra spaces in environment variables

2. **"Phone number not verified" error:**
   - Add your phone number to verified numbers in Twilio Console
   - Use the correct international format (+91xxxxxxxxxx for India)

3. **SMS not received:**
   - Check if the phone number is correct
   - Verify your Twilio account has sufficient balance
   - Check Twilio logs in the Console

4. **"Service not found" error:**
   - Verify the Verify Service SID is correct
   - Ensure the service is active in Twilio Console

## Support

- Twilio Documentation: https://www.twilio.com/docs
- Twilio Support: https://support.twilio.com
- Verify API Docs: https://www.twilio.com/docs/verify/api

## Cost Estimation

- Verify Service: ~$0.05 per verification attempt
- SMS: ~$0.0075 per message (varies by country)
- India SMS rates: ~$0.0035 per message

For production use, estimate your monthly user registrations and logins to calculate costs.
