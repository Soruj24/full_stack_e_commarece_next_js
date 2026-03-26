import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { amount, currency = "usd", metadata } = await req.json();

    if (!stripe) {
      return NextResponse.json({ 
        success: false, 
        error: "Stripe is not configured correctly. Please replace the placeholder keys in your .env.local file with real keys from the Stripe Dashboard." 
      }, { status: 503 });
    }

    if (!amount || amount < 0.5) {
      return NextResponse.json(
        { success: false, error: "Amount must be at least $0.50" },
        { status: 400 },
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata: {
        ...metadata,
        userId: session.user.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    );
  }
}
