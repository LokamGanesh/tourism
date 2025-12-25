import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
})

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Payment configuration
export const PAYMENT_CONFIG = {
  currency: 'inr',
  payment_method_types: ['card'],
  mode: 'payment' as const,
}

// Helper function to format amount for Stripe (convert to smallest currency unit)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100) // Convert to paise for INR
}

// Helper function to format amount for display
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100 // Convert from paise to rupees
}
