import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   // apiVersion: '2025-01-27.acacia', // Updated for 2026 stability
//   apiVersion: '2026-03-25.dahlia',
// });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2026-03-25.dahlia',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ PRD Logic: Handle Payment Success
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId) {
      const endDate = new Date();
      if (plan === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);
      else endDate.setMonth(endDate.getMonth() + 1);

      // Update Database
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_status: 'active',
          plan_type: plan,
          subscription_end_date: endDate.toISOString()
        })
        .eq('id', userId);

      if (error) console.error("DB Update Error:", error);
    }
  }

  return NextResponse.json({ received: true });
}