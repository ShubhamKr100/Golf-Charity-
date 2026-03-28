'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [winners, setWinners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ SECURITY CHECK
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/dashboard');
      } else {
        fetchAdminData();
      }
    };
    checkAdmin();
  }, [router]);

  const fetchAdminData = async () => {
    try {
      const [{ data: win }, { data: usr }] = await Promise.all([
        supabase.from('winners').select('*, profiles(full_name, email), draws(draw_date)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('full_name', { ascending: true })
      ]);
      setWinners(win || []);
      setUsers(usr || []);
    } catch (err: any) {
      console.error("❌ Fetch error:", err.message);
    }
  };

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await supabase.from('profiles').update({ subscription_status: newStatus }).eq('id', userId);
    fetchAdminData();
  };

  const calculatePrdPayout = (avgScore: number) => {
    if (avgScore >= 40) return { money: 400, tier: 5 };
    if (avgScore >= 35) return { money: 350, tier: 4 };
    if (avgScore >= 30) return { money: 250, tier: 3 };
    return { money: 0, tier: 0 };
  };

  // ✅ FIXED EXECUTE DRAW (Build Error Fixed Here)
  const executeMonthlyDraw = async () => {
    setLoading(true);
    try {
      const { data: activeUsers } = await supabase.from('profiles').select('id, full_name').eq('subscription_status', 'active');
      if (!activeUsers?.length) return alert("No active users found.");

      // Fetch or Create Draw
      let { data: draw } = await supabase.from('draws').select('id').eq('status', 'open').maybeSingle();
      if (!draw) {
        const { data: nDraw } = await supabase.from('draws').insert({ status: 'open' }).select().single();
        draw = nDraw;
      }

      // CRITICAL: Double check that 'draw' is not null for TypeScript
      if (!draw) {
        setLoading(false);
        return alert("Failed to initialize draw.");
      }

      for (const u of activeUsers) {
        const { data: scs } = await supabase.from('golf_scores').select('score').eq('user_id', u.id).limit(5);
        if (!scs?.length) continue;

        const avg = scs.reduce((acc, curr) => acc + curr.score, 0) / scs.length;
        const res = calculatePrdPayout(avg);

        if (res.money > 0) {
          await supabase.from('winners').insert({
            user_id: u.id,
            draw_id: draw.id, // Now safe from null
            prize_amount: res.money,
            match_tier: res.tier,
            status: 'Pending'
          });
        }
      }

      await supabase.from('draws').update({ status: 'completed' }).eq('id', draw.id);
      alert("✅ Draw Completed based on Performance!");
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayout = async (id: string) => {
    await supabase.from('winners').update({ status: 'Paid' }).eq('id', id);
    fetchAdminData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-center bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Admin Control</h1>
          <button 
            onClick={executeMonthlyDraw} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
          >
            {loading ? 'Processing...' : 'Execute Monthly Draw'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="space-y-4">
            <h2 className="text-emerald-500 font-bold uppercase tracking-widest">User Management</h2>
            {users.map(u => (
              <div key={u.id} className="flex justify-between p-5 bg-zinc-900 rounded-3xl border border-zinc-800">
                <div>
                  <p className="font-bold italic">{u.full_name}</p>
                  <p className="text-xs text-zinc-500">{u.email}</p>
                </div>
                <button onClick={() => toggleStatus(u.id, u.subscription_status)} className="px-4 py-1 rounded-xl bg-zinc-800 text-[10px] font-bold uppercase tracking-widest">
                  {u.subscription_status}
                </button>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-blue-500 font-bold uppercase tracking-widest">Reward Verification</h2>
            {winners.map(w => (
              <div key={w.id} className="flex justify-between p-5 bg-zinc-900 rounded-3xl border border-zinc-800">
                <div>
                  <p className="text-2xl font-black text-emerald-500 italic">£{w.prize_amount}</p>
                  <p className="text-sm font-bold uppercase tracking-tighter text-zinc-400">{w.profiles?.full_name}</p>
                </div>
                {w.status === 'Pending' ? (
                  <button onClick={() => verifyPayout(w.id)} className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Verify</button>
                ) : (
                  <span className="text-emerald-500 font-black uppercase tracking-widest">Paid ✓</span>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

// 'use client';
// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation'; // ✅ FIX: Added missing import

// export default function AdminPanel() {
//   const [winners, setWinners] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // ✅ PRD SECURITY Check
//   useEffect(() => {
//     const checkAdmin = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) return router.push('/login');

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', session.user.id)
//         .single();

//       if (profile?.role !== 'admin') {
//         router.push('/dashboard');
//       } else {
//         fetchAdminData();
//       }
//     };
//     checkAdmin();
//   }, [router]);

//   const fetchAdminData = async () => {
//     try {
//       const [{ data: win }, { data: usr }] = await Promise.all([
//         supabase.from('winners').select('*, profiles(full_name, email), draws(draw_date)').order('created_at', { ascending: false }),
//         supabase.from('profiles').select('*').order('full_name', { ascending: true })
//       ]);
//       setWinners(win || []);
//       setUsers(usr || []);
//     } catch (err: any) {
//       console.error("❌ Fetch error:", err.message);
//     }
//   };

//   const toggleStatus = async (userId: string, currentStatus: string) => {
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//     await supabase.from('profiles').update({ subscription_status: newStatus }).eq('id', userId);
//     fetchAdminData();
//   };

//   // ✅ PRD Logic: High Score = High Money
//   const calculatePrdPayout = (avgScore: number) => {
//     if (avgScore >= 40) return { money: 400, tier: 5 };
//     if (avgScore >= 35) return { money: 350, tier: 4 };
//     if (avgScore >= 30) return { money: 250, tier: 3 };
//     return { money: 0, tier: 0 };
//   };

//   const executeMonthlyDraw = async () => {
//     setLoading(true);
//     try {
//       const { data: activeUsers } = await supabase.from('profiles').select('id, full_name').eq('subscription_status', 'active');
//       if (!activeUsers?.length) return alert("No active users found.");

//       let { data: draw } = await supabase.from('draws').select('id').eq('status', 'open').maybeSingle();
//       if (!draw) {
//         const { data: nDraw } = await supabase.from('draws').insert({ status: 'open' }).select().single();
//         draw = nDraw;
//       }
//         // Is block ko replace karein (jahan loop ke andar insert ho raha hai)
// for (const u of activeUsers) {
//   const { data: scs } = await supabase.from('golf_scores').select('score').eq('user_id', u.id).limit(5);
//   if (!scs?.length) continue;

//   const avg = scs.reduce((acc, curr) => acc + curr.score, 0) / scs.length;
//   const res = calculatePrdPayout(avg);

//   // ✅ FIX: Added null check for 'draw' and proper object structure
//   if (res.money > 0 && draw) {
//     await supabase.from('winners').insert({
//       user_id: u.id,
//       draw_id: draw.id, 
//       prize_amount: res.money,
//       match_tier: res.tier,
//       status: 'Pending'
//     });
//   }
// }
// //       for (const u of activeUsers) {
// //         const { data: scs } = await supabase.from('golf_scores').select('score').eq('user_id', u.id).limit(5);
// //         if (!scs?.length) continue;

// //         const avg = scs.reduce((acc, curr) => acc + curr.score, 0) / scs.length;
// //         const res = calculatePrdPayout(avg);

// //         if (res.money > 0) {
// //           await supabase.from('winners').insert({
// //             user_id: u.id,
// //             // draw_id: draw.id,
// //             if (!draw) return alert("Error: Draw could not be initialized.");

// // // await supabase.from('winners').insert({
// //   // user_id: u.id,
// //   draw_id: draw.id, // Ab TypeScript error nahi dega
   

// //             prize_amount: res.money,
// //             match_tier: res.tier,
// //             status: 'Pending'
// //           });
// //         }
// //       }
//       await supabase.from('draws').update({ status: 'completed' }).eq('id', draw.id);
//       alert("✅ Draw Completed based on Performance!");
//       fetchAdminData();
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyPayout = async (id: string) => {
//     await supabase.from('winners').update({ status: 'Paid' }).eq('id', id);
//     fetchAdminData();
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans">
//       <div className="max-w-7xl mx-auto space-y-12">
//         {/* HEADER with RED Background Button */}
//         <div className="flex justify-between items-center bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
//           <h1 className="text-5xl font-black italic uppercase italic tracking-tighter">Admin Control</h1>
//           <button 
//             onClick={executeMonthlyDraw} 
//             disabled={loading}
//             className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
//           >
//             {loading ? 'Processing...' : 'Execute Monthly Draw'}
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//           <section className="space-y-4">
//             <h2 className="text-emerald-500 font-bold uppercase tracking-widest">User Management</h2>
//             {users.map(u => (
//               <div key={u.id} className="flex justify-between p-5 bg-zinc-900 rounded-3xl border border-zinc-800">
//                 <div>
//                   <p className="font-bold italic">{u.full_name}</p>
//                   <p className="text-xs text-zinc-500">{u.email}</p>
//                 </div>
//                 <button onClick={() => toggleStatus(u.id, u.subscription_status)} className="px-4 py-1 rounded-xl bg-zinc-800 text-[10px] font-bold uppercase tracking-widest">
//                   {u.subscription_status}
//                 </button>
//               </div>
//             ))}
//           </section>

//           <section className="space-y-4">
//             <h2 className="text-blue-500 font-bold uppercase tracking-widest">Reward Verification</h2>
//             {winners.map(w => (
//               <div key={w.id} className="flex justify-between p-5 bg-zinc-900 rounded-3xl border border-zinc-800">
//                 <div>
//                   <p className="text-2xl font-black text-emerald-500 italic">£{w.prize_amount}</p>
//                   <p className="text-sm font-bold uppercase tracking-tighter text-zinc-400">{w.profiles?.full_name}</p>
//                 </div>
//                 {w.status === 'Pending' ? (
//                   <button onClick={() => verifyPayout(w.id)} className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Verify</button>
//                 ) : (
//                   <span className="text-emerald-500 font-black uppercase tracking-widest">Paid ✓</span>
//                 )}
//               </div>
//             ))}
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

// // 'use client';
// // import { useState, useEffect } from 'react';
// // import { supabase } from '@/lib/supabase';

// // export default function AdminPanel() {
// //   const [winners, setWinners] = useState<any[]>([]);
// //   const [users, setUsers] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);

// //   // ✅ FETCH DATA
// //   const fetchAdminData = async () => {
// //     try {
// //       const { data: win } = await supabase
// //         .from('winners')
// //         .select('*, profiles(full_name, email), draws(draw_date)')
// //         .order('created_at', { ascending: false });

// //       const { data: usr } = await supabase
// //         .from('profiles')
// //         .select('*')
// //         .order('full_name', { ascending: true });

// //       setWinners(win || []);
// //       setUsers(usr || []);
// //     } catch (err: any) {
// //       console.log("❌ Fetch error:", err.message);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAdminData();
// //   }, []);

// //   // // ✅ TOGGLE USER STATUS
// //   // const toggleStatus = async (userId: string, currentStatus: string) => {
// //   //   const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

// //   //   await supabase
// //   //     .from('profiles')
// //   //     .update({ subscription_status: newStatus })
// //   //     .eq('id', userId);

// //   //   fetchAdminData();
// //   // };
// // // Admin panel mein user list render karte waqt status change logic
// // const toggleStatus = async (userId: string, currentStatus: string) => {
// //   const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  
// //   const { error } = await supabase
// //     .from('profiles')
// //     .update({ subscription_status: newStatus })
// //     .eq('id', userId);

// //   if (!error) fetchAdminData(); // Refresh list
// // };





// //   // // ✅ EXECUTE DRAW (FINAL FIXED)

// //   const executeMonthlyDraw = async () => {
// //   setLoading(true);
// //   const prizePool = 1000; // Example fixed pool or calculate based on subscribers [cite: 71]

// //   try {
// //     // 1. Sirf 'active' subscribers ko select karein
// //     const { data: activeUsers } = await supabase
// //       .from('profiles')
// //       .select('id')
// //       .eq('subscription_status', 'active');

// //     if (!activeUsers?.length) return alert("No active users to draw from!");

// //     // 2. Randomly 3 winners pick karein (Tiers ke liye)
// //     const shuffled = [...activeUsers].sort(() => 0.5 - Math.random());
// //     const tiers = [
// //       { tier: 5, percent: 0.40 }, // Jackpot [cite: 70]
// //       { tier: 4, percent: 0.35 },
// //       { tier: 3, percent: 0.25 }
// //     ];

// //     for (let i = 0; i < Math.min(shuffled.length, 3); i++) {
// //       await supabase.from('winners').insert({
// //         user_id: shuffled[i].id,
// //         prize_amount: prizePool * tiers[i].percent,
// //         match_tier: tiers[i].tier,
// //         status: 'Pending' // Initial state [cite: 85]
// //       });
// //     }
// //     alert("Draw Completed!");
// //     fetchAdminData();
// //   } catch (err) {
// //     console.error(err);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   // const executeMonthlyDraw = async () => {
// //   //   setLoading(true);
// //   //   const prizePool = 1000;

// //   //   try {
// //   //     // 1. Active users
// //   //     const { data: activeUsers } = await supabase
// //   //       .from('profiles')
// //   //       .select('id')
// //   //       .eq('subscription_status', 'active');

// //   //     if (!activeUsers || activeUsers.length === 0) {
// //   //       alert("No active users!");
// //   //       return;
// //   //     }

// //   //     // 2. Get or create draw
// //   //     let { data: draw } = await supabase
// //   //       .from('draws')
// //   //       .select('id')
// //   //       .eq('status', 'open')
// //   //       .maybeSingle();

// //   //     if (!draw) {
// //   //       const { data: newDraw } = await supabase
// //   //         .from('draws')
// //   //         .insert({
// //   //           draw_date: new Date().toISOString(),
// //   //           status: 'open',
// //   //         })
// //   //         .select()
// //   //         .single();

// //   //       draw = newDraw;
// //   //     }

// //   //     // 3. Pick winners
// //   //     const shuffled = [...activeUsers].sort(() => 0.5 - Math.random());
// //   //     const winnersSelected = shuffled.slice(0, 3);

// //   //     const percentages = [0.4, 0.35, 0.25];
// //   //     const matchTiers = [5, 4, 3];

// //   //     // 4. Insert winners
// //   //     for (let i = 0; i < winnersSelected.length; i++) {
// //   //       await supabase.from('winners').insert({
// //   //         user_id: winnersSelected[i].id,
// //   //         draw_id: draw.id, // ✅ IMPORTANT FIX
// //   //         prize_amount: prizePool * percentages[i],
// //   //         match_tier: matchTiers[i],
// //   //         status: 'Pending',
// //   //       });
// //   //     }

// //   //     // 5. Close draw
// //   //     await supabase
// //   //       .from('draws')
// //   //       .update({ status: 'completed' })
// //   //       .eq('id', draw.id);

// //   //     alert("✅ Draw Completed!");
// //   //     fetchAdminData();

// //   //   } catch (err: any) {
// //   //     console.log("❌ Draw error:", err.message);
// //   //     alert(err.message);
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };

// //   // ✅ VERIFY PAYOUT
// //   const verifyPayout = async (id: string) => {
// //     await supabase
// //       .from('winners')
// //       .update({ status: 'Paid' })
// //       .eq('id', id);

// //     fetchAdminData();
// //   };

// //   return (
// //     <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
// //       <div className="max-w-7xl mx-auto space-y-12">

// //         {/* HEADER */}
// //         <div className="flex justify-between items-center">
// //           <h1 className="text-5xl font-black italic">ADMIN CONTROL</h1>

// //           <button
// //             onClick={executeMonthlyDraw}
// //             disabled={loading}
// //             className="bg-emerald-500 px-8 py-4 rounded-xl font-black text-black"
// //           >
// //             {loading ? 'Processing...' : 'Execute Monthly Draw'}
// //           </button>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

// //           {/* USERS */}
// //           <div className="space-y-4">
// //             <h2 className="text-emerald-500 font-bold">User Management</h2>

// //             {users.map(u => (
// //               <div key={u.id} className="flex justify-between p-4 bg-zinc-900 rounded-xl">
// //                 <div>
// //                   <p className="font-bold">{u.full_name || 'User'}</p>
// //                   <p className="text-xs text-zinc-500">{u.email}</p>
// //                 </div>

// //                 <button
// //                   onClick={() => toggleStatus(u.id, u.subscription_status)}
// //                   className="px-4 py-1 rounded bg-zinc-800"
// //                 >
// //                   {u.subscription_status}
// //                 </button>
// //               </div>
// //             ))}
// //           </div>

// //           {/* WINNERS */}
// //           <div className="space-y-4">
// //             <h2 className="text-blue-500 font-bold">Reward Verification</h2>

// //             {winners.map(w => (
// //               <div key={w.id} className="flex justify-between p-4 bg-zinc-900 rounded-xl">
// //                 <div>
// //                   <p className="text-2xl font-bold">£{w.prize_amount}</p>
// //                   <p className="text-sm">{w.profiles?.full_name}</p>
// //                   <p className="text-xs text-zinc-500">
// //                     {w.draws?.draw_date
// //                       ? new Date(w.draws.draw_date).toLocaleDateString()
// //                       : 'No Date'}
// //                   </p>
// //                 </div>

// //                 {w.status === 'Pending' ? (
// //                   <button
// //                     onClick={() => verifyPayout(w.id)}
// //                     className="bg-blue-600 px-3 py-1 rounded"
// //                   >
// //                     Verify
// //                   </button>
// //                 ) : (
// //                   <span className="text-emerald-500">Paid ✓</span>
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // }