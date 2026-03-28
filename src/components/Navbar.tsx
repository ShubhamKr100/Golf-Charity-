'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// --- Stylized Logo Component (Consistency with Landing Page) ---
const Logo = () => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className="relative w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
      <span className="text-zinc-950 font-black text-lg italic mt-0.5 ml-0.5">G</span>
      <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-zinc-950">
        <span className="text-zinc-950 font-black text-[8px]">4</span>
      </div>
    </div>
    <span className="text-lg font-black tracking-tighter uppercase italic text-white hidden sm:block">
      Golf <span className="text-emerald-500 underline decoration-2 underline-offset-4">4</span> Charity
    </span>
  </div>
);

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUserAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    getUserAndRole();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    // Hard refresh to clear all states and redirect
    window.location.href = '/login';
  };

  return (
    <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50 p-4 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">

        {/* --- BRAND LOGO --- */}
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo />
        </Link>

        {/* --- NAVIGATION LINKS --- */}
        <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
          <Link href="/dashboard" className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-emerald-500 transition-colors">
            MY DASHBOARD
          </Link>
          <Link href="/charities" className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-emerald-500 transition-colors">
            Impact Partners
          </Link>
          <Link href="/about" className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-emerald-500 transition-colors">
            HOW IT WORKS
          </Link>

          {/* Admin Control Link */}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-black bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all uppercase tracking-[0.2em] italic"
            >
              Admin Access
            </Link>
          )}
        </div>

        {/* --- AUTH ACTIONS --- */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-black text-sm uppercase tracking-widest border border-zinc-800 transition-all active:scale-95 italic"
            >
             LOGOUT
            </button>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="px-5 py-2.5 rounded-xl text-zinc-400 font-black text-sm uppercase tracking-widest transition-all hover:text-white">
                Login
              </Link>
              <Link href="/signup" className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 italic">
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-emerald-500 font-black text-[9px] uppercase tracking-widest italic">Menu</span>
        </div>
      </div>
    </nav>
  );
}

// 'use client';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';

// export default function Navbar() {
//   const router = useRouter();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     // 1. Session check for Login/Logout state
//     const getUserAndRole = async () => {
//       const { data: { session } } = await supabase.auth.getSession();

//       if (session) {
//         setUser(session.user);

//         // 2. Role check from profiles (PRD Security)
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('role')
//           .eq('id', session.user.id)
//           .single();

//         if (profile?.role === 'admin') {
//           setIsAdmin(true);
//         }
//       }
//     };

//     getUserAndRole();
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setIsAdmin(false);
//     router.push('/login');
//   };

//   return (
//     <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 p-4 font-sans selection:bg-emerald-500/30">
//       <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">

//         {/* Brand Logo */}
//         <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
//           <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-black text-sm italic">DH</div>
//           <span className="font-black tracking-tighter text-xl uppercase italic">Digital Heroes</span>
//         </Link>

//         {/* Navigation Links (PRD Layout) */}
//         <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
//           <Link href="/dashboard" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
//             My Dashboard
//           </Link>
//           <Link href="/charities" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
//             Our Partners
//           </Link>
//           <Link href="/about" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
//             How it Works
//           </Link>

//           {/* Conditional Admin Button: Only for verified admins */}
//           {/* {isAdmin && (
//             <Link 
//               href="/admin" 
//               className="text-[11px] font-black bg-emerald-950/50 text-emerald-500 border border-emerald-900/50 px-5 py-2 rounded-full hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all uppercase tracking-[0.2em]"
//             >
//               Control Center
//             </Link>
//           )} */}
//           {isAdmin && (
//             <Link
//               href="/admin"
//               className="text-[12px] font-black bg-red-950/50 text-red-500 border border-red-900/50 px-4 py-1.5 rounded-full hover:text-white hover:bg-red-900 hover:border-red-700 transition-all uppercase tracking-[0.2em]"
//             >
//               Admin
//             </Link>
//           )}
          
//         </div>
//         {/* Auth Action (Login / Logout logic) */}
//         <div className="flex items-center gap-4">
//           {user ? (
//             <button
//               onClick={handleLogout}
//               className="px-6 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-widest border border-zinc-800 transition-all active:scale-95"
//             >
//               Logout Mission
//             </button>
//           ) : (
//             <div className="flex gap-3">
//               <Link href="/login" className="px-6 py-2 rounded-xl bg-zinc-900 text-white font-black text-xs uppercase tracking-widest transition-all hover:bg-zinc-800 border border-zinc-800">
//                 Login
//               </Link>
//               <Link href="/signup" className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-900/20">
//                 Join
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Mobile menu indicator */}
//         <div className="md:hidden">
//           <span className="text-emerald-500 font-bold text-xs uppercase">Menu</span>
//         </div>
//       </div>
//     </nav>
//   );
// }
// // 'use client';

// // import Link from "next/link";
// // import { supabase } from '@/lib/supabase';
// // import { useEffect, useState } from 'react';

// // export default function Navbar() {
// //   const [user, setUser] = useState<any>(null);
// //   const [role, setRole] = useState<string | null>(null);
// //   const [mounted, setMounted] = useState(false);

// //   const fetchRole = async (id: string) => {
// //     const { data } = await supabase
// //       .from('profiles')
// //       .select('role')
// //       .eq('id', id)
// //       .maybeSingle();

// //     setRole(data?.role || 'subscriber');
// //   };

// //   useEffect(() => {
// //     setMounted(true);

// //     supabase.auth.getUser().then(({ data: { user } }) => {
// //       setUser(user);
// //       if (user) fetchRole(user.id);
// //     });

// //     const { data: { subscription } } =
// //       supabase.auth.onAuthStateChange((_event, session) => {
// //         setUser(session?.user || null);
// //         if (session?.user) fetchRole(session.user.id);
// //         else setRole(null);
// //       });

// //     return () => subscription.unsubscribe();
// //   }, []);

// //   if (!mounted) return <div className="h-[60px]" />;

// //   return (
// //     <nav className="bg-zinc-950 border-b border-zinc-900 p-4 text-white">
// //       <div className="max-w-7xl mx-auto flex justify-between">

// //         <Link href="/">DIGITAL HEROES</Link>

// //         <div className="flex gap-5">
// //           <Link href="/charities">Charities</Link>

// //           {user ? (
// //             <>
// //               <Link href="/dashboard">Dashboard</Link>

// //               {role === 'admin' && (
// //                 <Link href="/admin" className="text-red-500">Admin</Link>
// //               )}

// //               <button onClick={async () => {
// //                 await supabase.auth.signOut();
// //                 window.location.href = '/';
// //               }}>
// //                 Logout
// //               </button>
// //             </>
// //           ) : (
// //             <Link href="/login">Login</Link>
// //           )}
// //         </div>

// //       </div>
// //     </nav>
// //   );
// // }
 