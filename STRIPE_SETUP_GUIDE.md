# Stripe Payment Integration Setup Guide

This guide explains how to set up Stripe payment integration for the Jharkhand Tourism platform.

## Prerequisites

1. **Stripe Account**: Create a free Stripe account at [stripe.com](https://stripe.com)
2. **API Keys**: Get your publishable and secret keys from the Stripe dashboard

## Environment Variables Setup

Add the following environment variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Getting Your Stripe Keys

1. **Login to Stripe Dashboard**: Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Navigate to API Keys**: Click on "Developers" → "API keys"
3. **Copy Keys**:
   - **Publishable key** (starts with `pk_test_`) → Use for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (starts with `sk_test_`) → Use for `STRIPE_SECRET_KEY`

## Features Implemented

### 1. Travel Booking Payments
- **Location**: `/app/travel/[id]/page.tsx`
- **Features**:
  - Secure card payment processing
  - Real-time cost calculation
  - Payment confirmation with booking ID
  - Transport selection with pricing
  - Guest and authenticated user support

### 2. Event Ticket Payments
- **Location**: `/app/components/EventTicketModal.tsx`
- **Features**:
  - Free and paid event support
  - Multiple ticket booking
  - Attendee details collection
  - Payment processing for paid events
  - Instant booking for free events

### 3. Payment Components
- **PaymentForm**: Reusable Stripe payment form
- **EventTicketModal**: Event booking with payment
- **API Routes**: Secure payment processing

## API Endpoints

### Payment Processing
- `POST /api/create-payment-intent` - Creates Stripe payment intent
- `POST /api/confirm-payment` - Confirms payment and updates booking
- `POST /api/event-bookings` - Creates event bookings
- `GET /api/event-bookings` - Retrieves event bookings

## Security Features

1. **Server-side Validation**: All payments validated on server
2. **Secure Keys**: Secret keys never exposed to client
3. **Payment Confirmation**: Double verification of payment status
4. **Error Handling**: Comprehensive error handling and user feedback

## Testing

### Test Card Numbers
Use these test card numbers in development:

- **Successful Payment**: `4242 4242 4242 4242`
- **Declined Payment**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Details
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3-digit number (e.g., 123)
- **ZIP**: Any 5-digit number (e.g., 12345)

## Payment Flow

### Travel Bookings
1. User selects travel package and transport
2. Fills booking form with personal details
3. Reviews booking summary
4. Clicks "Proceed to Payment"
5. Enters card details in secure Stripe form
6. Payment processed and booking confirmed
7. Booking ID generated and email sent

### Event Tickets
1. User clicks "Book Tickets" on event
2. Selects number of tickets
3. Enters attendee details
4. For paid events: proceeds to payment
5. For free events: instant booking confirmation
6. Ticket confirmation with booking details

## Error Handling

- **Payment Failures**: User-friendly error messages
- **Network Issues**: Retry mechanisms
- **Validation Errors**: Clear field-level feedback
- **Server Errors**: Graceful degradation

## Production Deployment

1. **Switch to Live Keys**: Replace test keys with live keys from Stripe
2. **Webhook Setup**: Configure webhooks for payment confirmations
3. **SSL Certificate**: Ensure HTTPS is enabled
4. **Domain Verification**: Add your domain to Stripe settings

## Support

For payment-related issues:
1. Check Stripe dashboard for payment logs
2. Review server logs for API errors
3. Test with different card numbers
4. Verify environment variables are set correctly

## Currency Support

- **Primary Currency**: Indian Rupees (INR)
- **Amount Format**: Amounts stored in smallest currency unit (paise)
- **Display Format**: Formatted with proper currency symbols

## Compliance

- **PCI DSS**: Stripe handles PCI compliance
- **Data Security**: Card details never stored on your servers
- **Privacy**: Payment data encrypted in transit and at rest
