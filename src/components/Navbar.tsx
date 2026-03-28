'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Session check for Login/Logout state
    const getUserAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);

        // 2. Role check from profiles (PRD Security)
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
    router.push('/login');
  };

  return (
    <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 p-4 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-black text-sm italic">DH</div>
          <span className="font-black tracking-tighter text-xl uppercase italic">Digital Heroes</span>
        </Link>

        {/* Navigation Links (PRD Layout) */}
        <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
          <Link href="/dashboard" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            My Dashboard
          </Link>
          <Link href="/charities" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Our Partners
          </Link>
          <Link href="/about" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            How it Works
          </Link>

          {/* Conditional Admin Button: Only for verified admins */}
          {/* {isAdmin && (
            <Link 
              href="/admin" 
              className="text-[11px] font-black bg-emerald-950/50 text-emerald-500 border border-emerald-900/50 px-5 py-2 rounded-full hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all uppercase tracking-[0.2em]"
            >
              Control Center
            </Link>
          )} */}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-[12px] font-black bg-red-950/50 text-red-500 border border-red-900/50 px-4 py-1.5 rounded-full hover:text-white hover:bg-red-900 hover:border-red-700 transition-all uppercase tracking-[0.2em]"
            >
              Admin
            </Link>
          )}
          
        </div>
        {/* Auth Action (Login / Logout logic) */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-widest border border-zinc-800 transition-all active:scale-95"
            >
              Logout Mission
            </button>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="px-6 py-2 rounded-xl bg-zinc-900 text-white font-black text-xs uppercase tracking-widest transition-all hover:bg-zinc-800 border border-zinc-800">
                Login
              </Link>
              <Link href="/signup" className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-900/20">
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu indicator */}
        <div className="md:hidden">
          <span className="text-emerald-500 font-bold text-xs uppercase">Menu</span>
        </div>
      </div>
    </nav>
  );
}
// 'use client';

// import Link from "next/link";
// import { supabase } from '@/lib/supabase';
// import { useEffect, useState } from 'react';

// export default function Navbar() {
//   const [user, setUser] = useState<any>(null);
//   const [role, setRole] = useState<string | null>(null);
//   const [mounted, setMounted] = useState(false);

//   const fetchRole = async (id: string) => {
//     const { data } = await supabase
//       .from('profiles')
//       .select('role')
//       .eq('id', id)
//       .maybeSingle();

//     setRole(data?.role || 'subscriber');
//   };

//   useEffect(() => {
//     setMounted(true);

//     supabase.auth.getUser().then(({ data: { user } }) => {
//       setUser(user);
//       if (user) fetchRole(user.id);
//     });

//     const { data: { subscription } } =
//       supabase.auth.onAuthStateChange((_event, session) => {
//         setUser(session?.user || null);
//         if (session?.user) fetchRole(session.user.id);
//         else setRole(null);
//       });

//     return () => subscription.unsubscribe();
//   }, []);

//   if (!mounted) return <div className="h-[60px]" />;

//   return (
//     <nav className="bg-zinc-950 border-b border-zinc-900 p-4 text-white">
//       <div className="max-w-7xl mx-auto flex justify-between">

//         <Link href="/">DIGITAL HEROES</Link>

//         <div className="flex gap-5">
//           <Link href="/charities">Charities</Link>

//           {user ? (
//             <>
//               <Link href="/dashboard">Dashboard</Link>

//               {role === 'admin' && (
//                 <Link href="/admin" className="text-red-500">Admin</Link>
//               )}

//               <button onClick={async () => {
//                 await supabase.auth.signOut();
//                 window.location.href = '/';
//               }}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link href="/login">Login</Link>
//           )}
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

// //   const fetchRole = async (userId: string) => {
// //     const { data } = await supabase
// //       .from('profiles')
// //       .select('role')
// //       .eq('id', userId)
// //       .maybeSingle();

// //     setRole(data?.role || 'subscriber');
// //   };

// //   useEffect(() => {
// //     supabase.auth.getUser().then(({ data: { user } }) => {
// //       setUser(user);
// //       if (user) fetchRole(user.id);
// //     });

// //     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
// //       setUser(session?.user || null);
// //       if (session?.user) fetchRole(session.user.id);
// //       else setRole(null);
// //     });

// //     return () => subscription.unsubscribe();
// //   }, []);

// //   const handleLogout = async () => {
// //     await supabase.auth.signOut();
// //     window.location.href = '/';
// //   };

// //   return (
// //     <nav className="border-b border-zinc-900 bg-zinc-950/80 p-4 text-white">
// //       <div className="max-w-7xl mx-auto flex justify-between items-center">

// //         <Link href="/" className="font-black text-xl uppercase">
// //           Digital Heroes
// //         </Link>

// //         <div className="flex gap-6 items-center">
// //           <Link href="/charities">Charities</Link>

// //           {user ? (
// //             <>
// //               <Link href="/dashboard" className="text-emerald-500">
// //                 Dashboard
// //               </Link>

// //               {role === 'admin' && (
// //                 <Link href="/admin" className="text-red-500">
// //                   Admin
// //                 </Link>
// //               )}

// //               <button onClick={handleLogout}>
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
