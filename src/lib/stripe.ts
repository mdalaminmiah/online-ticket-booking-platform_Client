import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { env } from '@/config/env';

let stripePromise: Promise<Stripe | null> | null = null;

/** Singleton Stripe.js loader. */
export function getStripePromise(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = env.stripePublishableKey
      ? loadStripe(env.stripePublishableKey)
      : Promise.resolve(null);
  }
  return stripePromise;
}
