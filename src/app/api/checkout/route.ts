import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Updated to latest stable version for 2026
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   // apiVersion: '2025-01-27.acacia',
//   apiVersion: '2026-03-25.dahlia',
// });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2026-03-25.dahlia',
});


export async function POST(req: Request) {
  try {
    const { plan, userId, email } = await req.json();

    // ✅ PRD Logic: Select Price ID based on Plan (Monthly vs Yearly)
    // Note: Replace these with actual IDs from your Stripe Dashboard
    const priceId = plan === 'yearly' 
      ? 'price_1TG0R2B8DmAiBNWUuacbRPbE'  // £100/year
      : 'price_1TFsSkB8DmAiBNWUyANGHC7w'; // £10/month (Default)

    // 1. Create the Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      // URL configuration (using NEXT_PUBLIC_BASE_URL for consistency)
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscribe`,
      metadata: { 
        userId: userId,
        plan: plan,
      },
    });

    // 2. Return BOTH sessionId and URL (Important for frontend redirect)
    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });

  } catch (err: any) {
    console.error("Stripe Session Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';

// // API Version fixed to avoid 'Invalid Version' error
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-12-18.acacia' as any,
// });

// export async function POST(req: Request) {
//   try {
//     const { userId, email } = await req.json();

//     // 1. Create the Stripe Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price: process.env.STRIPE_PRICE_ID, // Ensure this is in your .env
//           quantity: 1,
//         },
//       ],
//       mode: 'subscription',
//       // Success aur Cancel URLs configuration
//       success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
//       metadata: { userId },
//       customer_email: email,
//     });

//     // 2. Return BOTH sessionId and URL (Important for Clover/New Stripe JS)
//     return NextResponse.json({ 
//       sessionId: session.id, 
//       url: session.url 
//     });

//   } catch (err: any) {
//     console.error("Stripe Session Error:", err.message);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


// // import { NextResponse } from 'next/server';
// // import Stripe from 'stripe';

// // // Version ko '2024-12-18.acacia' kar dein ya usey hata hi dein 
// // // taaki wo aapke account ki default version use kare.
// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// //   apiVersion: '2024-12-18.acacia' as any, // Is date ko use karein
// // });

// // export async function POST(req: Request) {
// //   try {
// //     const { userId, email } = await req.json();

// //     const session = await stripe.checkout.sessions.create({
// //       payment_method_types: ['card'],
// //       line_items: [
// //         {
// //           price: process.env.STRIPE_PRICE_ID,
// //           quantity: 1,
// //         },
// //       ],
// //       mode: 'subscription',
// //       // Ensure NEXT_PUBLIC_SITE_URL is set in .env or use localhost for testing
// //       success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
// //       cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
// //       metadata: { userId },
// //       customer_email: email,
// //     });

// //     // Is file mein sirf return statement ko update karein
// // try {
// //   const session = await stripe.checkout.sessions.create({
// //     // ... aapka puraana code same rahega
// //   });

// //   // AB YEH BHEJEIN: sessionId ke saath URL bhi
// //   return NextResponse.json({ 
// //     sessionId: session.id, 
// //     url: session.url // Yeh sabse zaroori hai
// //   });
// // } catch (err: any) {
// //       console.error("Stripe Session Error:", err.message);

// //   return NextResponse.json({ error: err.message }, { status: 500 });
// // }
    
// // //     return NextResponse.json({ sessionId: session.id });
// // //   } catch (err: any) {
// // //     console.error("Stripe Session Error:", err.message);
// // //     return NextResponse.json({ error: err.message }, { status: 500 });
// // //   }
// // // }