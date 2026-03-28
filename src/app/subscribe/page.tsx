'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan);
    
    // 1. Current user fetch karein (Secure way)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return window.location.href = '/login';
    }

    try {
      // 2. Stripe Session create karne ke liye backend API call
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan, 
          userId: user.id, 
          email: user.email 
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 3. ✅ CLOVER 2026 UPDATE: 
      // redirectToCheckout ki jagah direct URL use karein jo backend se aaya hai
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe Checkout URL missing from response");
      }

    } catch (err: any) {
      console.error("Payment Error:", err.message);
      alert("Payment Error: " + err.message);
      setLoading(null); // Error aane par loading stop karein
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 md:p-20 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Choose Your <span className="text-emerald-500">Hero Plan</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
            Fuel charity through your golf performance
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* --- MONTHLY PLAN --- */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3rem] space-y-8 hover:border-zinc-700 transition-all">
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase italic">Monthly Hero</h3>
              <p className="text-4xl font-black italic">
                £10<span className="text-lg text-zinc-500">/mo</span>
              </p>
            </div>
            <ul className="space-y-4 text-zinc-400 text-sm font-medium">
              <li>✓ Monthly Prize Draw Entry</li>
              <li>✓ 10% Charity Contribution</li>
              <li>✓ Rolling 5 Score Tracking</li>
            </ul>
            <button 
              onClick={() => handleCheckout('monthly')}
              disabled={!!loading}
              className="w-full py-4 bg-zinc-100 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
            >
              {loading === 'monthly' ? 'Connecting Stripe...' : 'Select Monthly'}
            </button>
          </div>

          {/* --- YEARLY PLAN (DISCOUNTED) --- */}
          <div className="bg-emerald-950/10 border-2 border-emerald-500/30 p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
            <div className="absolute top-6 right-6 bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase italic shadow-lg">
              Save 20%
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase italic text-emerald-500">Yearly Hero</h3>
              <p className="text-4xl font-black italic">
                £100<span className="text-lg text-zinc-500">/yr</span>
              </p>
            </div>
            <ul className="space-y-4 text-zinc-400 text-sm font-medium">
              <li>✓ All Monthly Features</li>
              <li>✓ Priority Support</li>
              <li>✓ Exclusive Yearly Hero Badge</li>
              <li className="text-emerald-400">✓ Get 2 Months Free</li>
            </ul>
            <button 
              onClick={() => handleCheckout('yearly')}
              disabled={!!loading}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              {loading === 'yearly' ? 'Connecting Stripe...' : 'Select Yearly'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 'use client';
// import { useState } from 'react';
// import { supabase } from '@/lib/supabase';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// export default function SubscribePage() {
//   const [loading, setLoading] = useState<string | null>(null);

//   const handleCheckout = async (plan: 'monthly' | 'yearly') => {
//     setLoading(plan);
//     const { data: { session } } = await supabase.auth.getSession();
    
//     if (!session) return window.location.href = '/login';

//     // API call to create Stripe Session
//     const res = await fetch('/api/checkout', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         plan, 
//         userId: session.user.id,
//         email: session.user.email 
//       }),
//     });

//     const { sessionId } = await res.json();
//     const stripe = await stripePromise;
//     await stripe?.redirectToCheckout({ sessionId });
//     setLoading(null);
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white p-8 md:p-20 font-sans">
//       <div className="max-w-5xl mx-auto space-y-16">
//         <header className="text-center space-y-4">
//           <h1 className="text-5xl font-black italic uppercase tracking-tighter">Choose Your <span className="text-emerald-500">Hero Plan</span></h1>
//           <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Fuel charity through your golf performance</p>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* MONTHLY PLAN */}
//           <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3rem] space-y-8 hover:border-zinc-700 transition-all">
//             <div className="space-y-2">
//               <h3 className="text-xl font-black uppercase italic">Monthly Hero</h3>
//               <p className="text-4xl font-black italic">£10<span className="text-lg text-zinc-500">/mo</span></p>
//             </div>
//             <ul className="space-y-4 text-zinc-400 text-sm font-medium">
//               <li>✓ Monthly Prize Draw Entry</li>
//               <li>✓ 10% Charity Contribution</li>
//               <li>✓ Rolling 5 Score Tracking</li>
//             </ul>
//             <button 
//               onClick={() => handleCheckout('monthly')}
//               disabled={!!loading}
//               className="w-full py-4 bg-zinc-100 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
//             >
//               {loading === 'monthly' ? 'Loading...' : 'Select Monthly'}
//             </button>
//           </div>

//           {/* YEARLY PLAN (DISCOUNTED) */}
//           <div className="bg-emerald-950/10 border-2 border-emerald-500/30 p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
//             <div className="absolute top-6 right-6 bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase italic shadow-lg">Save 20%</div>
//             <div className="space-y-2">
//               <h3 className="text-xl font-black uppercase italic text-emerald-500">Yearly Hero</h3>
//               <p className="text-4xl font-black italic">£100<span className="text-lg text-zinc-500">/yr</span></p>
//             </div>
//             <ul className="space-y-4 text-zinc-400 text-sm font-medium">
//               <li>✓ All Monthly Features</li>
//               <li>✓ Priority Support</li>
//               <li>✓ Exclusive Yearly Hero Badge</li>
//               <li className="text-emerald-400">✓ Get 2 Months Free</li>
//             </ul>
//             <button 
//               onClick={() => handleCheckout('yearly')}
//               disabled={!!loading}
//               className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
//             >
//               {loading === 'yearly' ? 'Loading...' : 'Select Yearly'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }