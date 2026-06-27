import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Check if it's a real key or the placeholder
const isValidKey = stripeSecretKey && !stripeSecretKey.includes("your_secret_key");

export const stripe = isValidKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover" as const,
      typescript: true,
    })
  : null;
