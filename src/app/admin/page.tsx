'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [winners, setWinners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, prizePool: 0, charityTotal: 0 });
  const [loading, setLoading] = useState(false);
  
  // States for Editing Data
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userScores, setUserScores] = useState<any[]>([]);
  // ✅ NEW: Temporary state for scores before saving
  const [tempScores, setTempScores] = useState<{ [key: string]: number }>({}); 

  const router = useRouter();

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
      const [{ data: win }, { data: usr }, { data: allUsers }] = await Promise.all([
        supabase.from('winners').select('*, profiles(full_name, email), draws(draw_date)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('full_name', { ascending: true }),
        supabase.from('profiles').select('subscription_status')
      ]);
      
      setWinners(win || []);
      setUsers(usr || []);

      const activeCount = allUsers?.filter(u => u.subscription_status === 'active').length || 0;
      setStats({
        totalUsers: allUsers?.length || 0,
        prizePool: activeCount * 50,
        charityTotal: activeCount * 10 
      });

    } catch (err: any) {
      console.error("❌ Fetch error:", err.message);
    }
  };

  // --- USER DATA CONTROL LOGIC ---

  const openUserEditor = async (user: any) => {
    setEditingUser(user);
    const { data } = await supabase
      .from('golf_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false });
    
    setUserScores(data || []);

    // ✅ NEW: Initialize tempScores map when editor opens
    const scoresMap: { [key: string]: number } = {};
    data?.forEach(s => {
      scoresMap[s.id] = s.score;
    });
    setTempScores(scoresMap);
  };

  // ✅ NEW: Individual Click-to-Save Logic with Validation
  const handleScoreUpdate = async (scoreId: string) => {
    const newScore = tempScores[scoreId];
    
    // PRD Score Validation: 1-45 
    if (newScore < 1 || newScore > 45) {
      return alert("Score must be between 1 and 45");
    }

    const { error } = await supabase
      .from('golf_scores')
      .update({ score: newScore })
      .eq('id', scoreId);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("✅ Score Updated Successfully!");
      // Refresh local data
      fetchAdminData();
    }
  };

  const updateProfileField = async (field: string, value: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', editingUser.id);
    
    if (!error) {
      alert("Profile Updated!");
      fetchAdminData();
      setEditingUser(null);
    }
  };

  // --- DRAW LOGIC ---

  const calculatePrdPayout = (avgScore: number) => {
    if (avgScore >= 40) return { money: 400, tier: 5 };
    if (avgScore >= 35) return { money: 350, tier: 4 };
    if (avgScore >= 30) return { money: 250, tier: 3 };
    return { money: 0, tier: 0 };
  };

  const executeMonthlyDraw = async () => {
    setLoading(true);
    try {
      const { data: activeUsers } = await supabase.from('profiles').select('id, full_name').eq('subscription_status', 'active');
      if (!activeUsers?.length) return alert("No active users found.");

      let { data: draw } = await supabase.from('draws').select('id').eq('status', 'open').maybeSingle();
      if (!draw) {
        const { data: nDraw } = await supabase.from('draws').insert({ status: 'open' }).select().single();
        draw = nDraw;
      }

      if (!draw) throw new Error("Draw Init Failed");

      for (const u of activeUsers) {
        const { data: scs } = await supabase.from('golf_scores').select('score').eq('user_id', u.id).limit(5);
        if (!scs?.length) continue;

        const avg = scs.reduce((acc, curr) => acc + curr.score, 0) / scs.length;
        const res = calculatePrdPayout(avg);

        if (res.money > 0) {
          await supabase.from('winners').insert({
            user_id: u.id,
            draw_id: draw.id,
            prize_amount: res.money,
            match_tier: res.tier,
            status: 'Pending'
          });
        }
      }
      await supabase.from('draws').update({ status: 'completed' }).eq('id', draw.id);
      alert("✅ Draw Completed!");
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (id: string, approve: boolean) => {
    const newStatus = approve ? 'Paid' : 'Rejected';
    const { error } = await supabase.from('winners').update({ status: newStatus }).eq('id', id);
    if (!error) fetchAdminData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30 relative">
      
      {/* USER DATA EDITOR MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] max-w-2xl w-full space-y-8 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Edit Hero: {editingUser.full_name}</h2>
              <button onClick={() => setEditingUser(null)} className="text-zinc-500 hover:text-white font-bold text-xl">✕</button>
            </div>

            {/* Profile Management Section  */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Core Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm"
                  placeholder="Update Full Name"
                  onBlur={(e) => updateProfileField('full_name', e.target.value)}
                  defaultValue={editingUser.full_name}
                />
                <select 
                  className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm"
                  onChange={(e) => updateProfileField('subscription_status', e.target.value)}
                  value={editingUser.subscription_status}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Golf Score Management Section */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Golf Scores (Rolling 5)</h3>
              <div className="space-y-3">
                {userScores.map((s) => (
                  <div key={s.id} className="flex gap-4 items-center bg-zinc-950 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase flex-1">{new Date(s.recorded_at).toLocaleDateString()}</span>
                    
                    {/* ✅ Updated Input: Uses tempScores state */}
                    <input 
                      type="number"
                      className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl w-24 font-black text-xl text-emerald-500 outline-none focus:ring-1 focus:ring-emerald-500"
                      value={tempScores[s.id] || ''}
                      onChange={(e) => setTempScores({...tempScores, [s.id]: parseInt(e.target.value) || 0})}
                    />

                    {/* ✅ NEW: Save Button for explicit update */}
                    <button 
                      onClick={() => handleScoreUpdate(s.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Save
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* --- KEY STATS / ANALYTICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Mission Heroes</p>
            <h2 className="text-4xl font-black italic text-white">{stats.totalUsers}</h2>
          </div>
          <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Live Prize Pool</p>
            <h2 className="text-4xl font-black italic text-emerald-500">£{stats.prizePool}</h2>
          </div>
          <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Charity Impact Total</p>
            <h2 className="text-4xl font-black italic text-blue-500">£{stats.charityTotal}</h2>
          </div>
        </div>

        {/* --- HEADER --- */}
        <div className="flex justify-between items-center bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Control <span className="text-emerald-500">Center</span></h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Administrative Privilege: Active</p>
          </div>
          <button 
            onClick={executeMonthlyDraw} 
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            {loading ? 'Processing...' : 'Run Monthly Draw'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* --- USER MANAGEMENT --- */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-4">User Management Control</h2>
            <div className="space-y-4">
              {users.map(u => (
                <div key={u.id} className="p-6 bg-zinc-900/80 rounded-[2rem] border border-zinc-800 hover:border-zinc-700 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black italic text-lg leading-none group-hover:text-emerald-500 transition-colors">{u.full_name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{u.email}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase border ${u.subscription_status === 'active' ? 'border-emerald-500/20 text-emerald-400' : 'border-red-500/20 text-red-400'}`}>{u.subscription_status}</span>
                  </div>
                  <button 
                    onClick={() => openUserEditor(u)}
                    className="w-full py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                  >
                    Manage User Data & Scores
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* --- WINNER VERIFICATION MODULE --- */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] ml-4">Winner Payout Audit</h2>
            <div className="space-y-4">
              {winners.map(w => (
                <div key={w.id} className="p-6 bg-zinc-900/80 rounded-[2.5rem] border border-zinc-800 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-3xl font-black text-emerald-500 italic leading-none">£{w.prize_amount}</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Hero: {w.profiles?.full_name}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${w.status === 'Paid' ? 'border-emerald-500/30 text-emerald-500' : 'border-blue-500/30 text-blue-500'}`}>
                      {w.status}
                    </span>
                  </div>

                  {w.status === 'Pending' && (
                    <div className="pt-4 border-t border-zinc-800 flex flex-col gap-4">
                      <div className="flex gap-3">
                        <button onClick={() => handleVerification(w.id, true)} className="flex-1 py-3 bg-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all">Approve Payout</button>
                        <button onClick={() => handleVerification(w.id, false)} className="flex-1 py-3 bg-zinc-800 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-900 transition-all">Reject</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// 'use client';
// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';

// export default function AdminPanel() {
//   const [winners, setWinners] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [stats, setStats] = useState({ totalUsers: 0, prizePool: 0, charityTotal: 0 });
//   const [loading, setLoading] = useState(false);
  
//   // States for Editing Data
//   const [editingUser, setEditingUser] = useState<any>(null);
//   const [userScores, setUserScores] = useState<any[]>([]);
//   // const [tempScores, setTempScores] = useState<{ [key: string]: number }>({}); /////////////////////
//   const router = useRouter();

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
//       const [{ data: win }, { data: usr }, { data: allUsers }] = await Promise.all([
//         supabase.from('winners').select('*, profiles(full_name, email), draws(draw_date)').order('created_at', { ascending: false }),
//         supabase.from('profiles').select('*').order('full_name', { ascending: true }),
//         supabase.from('profiles').select('subscription_status')
//       ]);
      
//       setWinners(win || []);
//       setUsers(usr || []);

//       const activeCount = allUsers?.filter(u => u.subscription_status === 'active').length || 0;
//       setStats({
//         totalUsers: allUsers?.length || 0,
//         prizePool: activeCount * 50,
//         charityTotal: activeCount * 10 
//       });

//     } catch (err: any) {
//       console.error("❌ Fetch error:", err.message);
//     }
//   };

//   // --- USER DATA CONTROL LOGIC ---

//   const openUserEditor = async (user: any) => {
//     setEditingUser(user);
//     const { data } = await supabase
//       .from('golf_scores')
//       .select('*')
//       .eq('user_id', user.id)
//       .order('recorded_at', { ascending: false });
//     setUserScores(data || []);
//   };

//   const updateIndividualScore = async (scoreId: string, newScore: number) => {
//     const { error } = await supabase
//       .from('golf_scores')
//       .update({ score: newScore })
//       .eq('id', scoreId);
    
//     if (!error) {
//       alert("Score Updated!");
//       openUserEditor(editingUser);
//     }
//   };

//   const updateProfileField = async (field: string, value: string) => {
//     const { error } = await supabase
//       .from('profiles')
//       .update({ [field]: value })
//       .eq('id', editingUser.id);
    
//     if (!error) {
//       alert("Profile Updated!");
//       fetchAdminData();
//       setEditingUser(null);
//     }
//   };

//   // --- DRAW LOGIC ---

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

//       if (!draw) throw new Error("Draw Init Failed");

//       for (const u of activeUsers) {
//         const { data: scs } = await supabase.from('golf_scores').select('score').eq('user_id', u.id).limit(5);
//         if (!scs?.length) continue;

//         const avg = scs.reduce((acc, curr) => acc + curr.score, 0) / scs.length;
//         const res = calculatePrdPayout(avg);

//         if (res.money > 0) {
//           await supabase.from('winners').insert({
//             user_id: u.id,
//             draw_id: draw.id,
//             prize_amount: res.money,
//             match_tier: res.tier,
//             status: 'Pending'
//           });
//         }
//       }
//       await supabase.from('draws').update({ status: 'completed' }).eq('id', draw.id);
//       alert("✅ Draw Completed!");
//       fetchAdminData();
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerification = async (id: string, approve: boolean) => {
//     const newStatus = approve ? 'Paid' : 'Rejected';
//     const { error } = await supabase.from('winners').update({ status: newStatus }).eq('id', id);
//     if (!error) fetchAdminData();
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30 relative">
      
//       {/* USER DATA EDITOR MODAL */}
//       {editingUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
//           <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] max-w-2xl w-full space-y-8 overflow-y-auto max-h-[90vh]">
//             <div className="flex justify-between items-center">
//               <h2 className="text-2xl font-black uppercase italic">Edit Hero: {editingUser.full_name}</h2>
//               <button onClick={() => setEditingUser(null)} className="text-zinc-500 hover:text-white font-bold text-xl">✕</button>
//             </div>

//             {/* Profile Management Section  */}
//             <div className="space-y-4">
//               <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Core Profile</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input 
//                   className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm"
//                   placeholder="Update Full Name"
//                   onBlur={(e) => updateProfileField('full_name', e.target.value)}
//                   defaultValue={editingUser.full_name}
//                 />
//                 <select 
//                   className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm"
//                   onChange={(e) => updateProfileField('subscription_status', e.target.value)}
//                   value={editingUser.subscription_status}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>

//             {/* Golf Score Management Section [cite: 100] */}
//             <div className="space-y-4">
//               <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Golf Scores (Rolling 5)</h3>
//               <div className="space-y-2">
//                 {userScores.map((s) => (
//                   <div key={s.id} className="flex gap-4 items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
//                     <span className="text-[10px] font-bold text-zinc-500 uppercase">{new Date(s.recorded_at).toLocaleDateString()}</span>
//                     <input 
//                       type="number"
//                       className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded w-20 font-bold text-emerald-500"
//                       defaultValue={s.score}
//                       onBlur={(e) => updateIndividualScore(s.id, parseInt(e.target.value))}
//                     />
//                     <span className="text-[10px] text-zinc-600 italic">Admin Correction Mode</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto space-y-10">
//         {/* STATS OVERVIEW [cite: 113-116] */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
//             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Mission Heroes</p>
//             <h2 className="text-4xl font-black italic">{stats.totalUsers}</h2>
//           </div>
//           <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
//             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Live Prize Pool</p>
//             <h2 className="text-4xl font-black italic text-emerald-500">£{stats.prizePool}</h2>
//           </div>
//           <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
//             <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Charity Impact Total</p>
//             <h2 className="text-4xl font-black italic text-blue-500">£{stats.charityTotal}</h2>
//           </div>
//         </div>

//         {/* CONTROL PANEL HEADER */}
//         <div className="flex justify-between items-center bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
//           <h1 className="text-5xl font-black italic uppercase tracking-tighter">Control <span className="text-emerald-500">Center</span></h1>
//           <button onClick={executeMonthlyDraw} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
//             {loading ? 'Processing...' : 'Run Monthly Draw'}
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//           {/* USER MANAGEMENT SECTION [cite: 98] */}
//           <section className="space-y-6">
//             <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-4">Hero Directory Control</h2>
//             <div className="space-y-4">
//               {users.map(u => (
//                 <div key={u.id} className="p-6 bg-zinc-900/80 rounded-[2rem] border border-zinc-800 hover:border-zinc-700 transition-all">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <p className="font-black italic text-lg leading-none">{u.full_name}</p>
//                       <p className="text-xs text-zinc-600 mt-1">{u.email}</p>
//                     </div>
//                     <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase border ${u.subscription_status === 'active' ? 'border-emerald-500/20 text-emerald-500' : 'border-red-500/20 text-red-500'}`}>{u.subscription_status}</span>
//                   </div>
//                   <button 
//                     onClick={() => openUserEditor(u)}
//                     className="w-full py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
//                   >
//                     Manage User Data & Scores
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* REWARD VERIFICATION SECTION [cite: 109, 111, 112] */}
//           <section className="space-y-6">
//             <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] ml-4">Winner Payout Audit</h2>
//             <div className="space-y-4">
//               {winners.map(w => (
//                 <div key={w.id} className="p-6 bg-zinc-900/80 rounded-[2.5rem] border border-zinc-800 space-y-4">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-3xl font-black text-emerald-500 italic">£{w.prize_amount}</p>
//                       <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Winner: {w.profiles?.full_name}</p>
//                     </div>
//                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${w.status === 'Paid' ? 'border-emerald-500/30 text-emerald-400' : 'border-blue-500/30 text-blue-400'}`}>{w.status}</span>
//                   </div>
//                   {w.status === 'Pending' && (
//                     <div className="flex gap-3">
//                       <button onClick={() => handleVerification(w.id, true)} className="flex-1 py-3 bg-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all">Approve</button>
//                       <button onClick={() => handleVerification(w.id, false)} className="flex-1 py-3 bg-zinc-800 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-900 transition-all">Reject</button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

// // 'use client';
// // import { useState, useEffect } from 'react';
// // import { supabase } from '@/lib/supabase';
// // import { useRouter } from 'next/navigation';

// // export default function AdminPanel() {
// //   const [winners, setWinners] = useState<any[]>([]);
// //   const [users, setUsers] = useState<any[]>([]);
// //   const [stats, setStats] = useState({ totalUsers: 0, prizePool: 0, charityTotal: 0 });
// //   const [loading, setLoading] = useState(false);
// //   const router = useRouter();

// //   // ✅ SECURITY CHECK & DATA FETCH
// //   useEffect(() => {
// //     const checkAdmin = async () => {
// //       const { data: { session } } = await supabase.auth.getSession();
// //       if (!session) return router.push('/login');

// //       const { data: profile } = await supabase
// //         .from('profiles')
// //         .select('role')
// //         .eq('id', session.user.id)
// //         .single();

// //       if (profile?.role !== 'admin') {
// //         router.push('/dashboard');
// //       } else {
// //         fetchAdminData();
// //       }
// //     };
// //     checkAdmin();
// //   }, [router]);

// //   const fetchAdminData = async () => {
// //     try {
// //       const [{ data: win }, { data: usr }, { data: allUsers }] = await Promise.all([
// //         supabase.from('winners').select('*, profiles(full_name, email), draws(draw_date)').order('created_at', { ascending: false }),
// //         supabase.from('profiles').select('*').order('full_name', { ascending: true }),
// //         supabase.from('profiles').select('subscription_status')
// //       ]);
      
// //       setWinners(win || []);
// //       setUsers(usr || []);

// //       // ✅ ADMIN ANALYTICS (Section 11)
// //       const activeCount = allUsers?.filter(u => u.subscription_status === 'active').length || 0;
// //       setStats({
// //         totalUsers: allUsers?.length || 0,
// //         prizePool: activeCount * 50, // Example: £50 per sub goes to pool
// //         charityTotal: activeCount * 10 // Example: £10 per sub goes to charity
// //       });

// //     } catch (err: any) {
// //       console.error("❌ Fetch error:", err.message);
// //     }
// //   };

// //   // ✅ USER MANAGEMENT (Section 11)
// //   const toggleStatus = async (userId: string, currentStatus: string) => {
// //     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
// //     await supabase.from('profiles').update({ subscription_status: newStatus }).eq('id', userId);
// //     fetchAdminData();
// //   };

// //   const calculatePrdPayout = (avgScore: number) => {
// //     if (avgScore >= 40) return { money: 400, tier: 5 };
// //     if (avgScore >= 35) return { money: 350, tier: 4 };
// //     if (avgScore >= 30) return { money: 250, tier: 3 };
// //     return { money: 0, tier: 0 };
// //   };

// //   // ✅ DRAW EXECUTION (Section 06)
// //   const executeMonthlyDraw = async () => {
// //     setLoading(true);
// //     try {
// //       const { data: activeUsers } = await supabase.from('profiles').select('id, full_name').eq('subscription_status', 'active');
// //       if (!activeUsers?.length) return alert("No active users found.");

// //       let { data: draw } = await supabase.from('draws').select('id').eq('status', 'open').maybeSingle();
// //       if (!draw) {
// //         const { data: nDraw } = await supabase.from('draws').insert({ status: 'open' }).select().single();
// //         draw = nDraw;
// //       }

// //       if (!draw) throw new Error("Draw Init Failed");

// //       for (const u of activeUsers) {
// //         const { data: scs } = await supabase.from('golf_scores').select('score').eq('user_id', u.id).limit(5);
// //         if (!scs?.length) continue;

// //         const avg = scs.reduce((acc, curr) => acc + curr.score, 0) / scs.length;
// //         const res = calculatePrdPayout(avg);

// //         if (res.money > 0) {
// //           await supabase.from('winners').insert({
// //             user_id: u.id,
// //             draw_id: draw.id,
// //             prize_amount: res.money,
// //             match_tier: res.tier,
// //             status: 'Pending'
// //           });
// //         }
// //       }
// //       await supabase.from('draws').update({ status: 'completed' }).eq('id', draw.id);
// //       alert("✅ Draw Completed!");
// //       fetchAdminData();
// //     } catch (err: any) {
// //       alert(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ WINNER VERIFICATION LOGIC (Section 09 & 11)
// //   const handleVerification = async (id: string, approve: boolean) => {
// //     const newStatus = approve ? 'Paid' : 'Rejected';
// //     const { error } = await supabase
// //       .from('winners')
// //       .update({ status: newStatus })
// //       .eq('id', id);
    
// //     if (!error) fetchAdminData();
// //   };

// //   return (
// //     <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30">
// //       <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
// //         {/* --- SECTION 11: KEY STATS / ANALYTICS --- */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
// //             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Mission Heroes</p>
// //             <h2 className="text-4xl font-black italic text-white">{stats.totalUsers}</h2>
// //           </div>
// //           <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
// //             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Live Prize Pool</p>
// //             <h2 className="text-4xl font-black italic text-emerald-500">£{stats.prizePool}</h2>
// //           </div>
// //           <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
// //             <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Charity Impact Total</p>
// //             <h2 className="text-4xl font-black italic text-blue-500">£{stats.charityTotal}</h2>
// //           </div>
// //         </div>

// //         {/* --- HEADER --- */}
// //         <div className="flex justify-between items-center bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
// //           <div>
// //             <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Control <span className="text-emerald-500">Center</span></h1>
// //             <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Administrative Privilege: Active</p>
// //           </div>
// //           <button 
// //             onClick={executeMonthlyDraw} 
// //             disabled={loading}
// //             className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
// //           >
// //             {loading ? 'Processing...' : 'Run Monthly Draw'}
// //           </button>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
// //           {/* --- USER MANAGEMENT --- */}
// //           <section className="space-y-6">
// //             <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-4">User Management Control</h2>
// //             <div className="space-y-4">
// //               {users.map(u => (
// //                 <div key={u.id} className="flex justify-between items-center p-6 bg-zinc-900/80 rounded-[2rem] border border-zinc-800 hover:border-zinc-700 transition-all group">
// //                   <div>
// //                     <p className="font-black italic text-lg leading-none group-hover:text-emerald-500 transition-colors">{u.full_name}</p>
// //                     <p className="text-xs text-zinc-500 mt-1">{u.email}</p>
// //                   </div>
// //                   <button 
// //                     onClick={() => toggleStatus(u.id, u.subscription_status)} 
// //                     className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${u.subscription_status === 'active' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-red-500/20 text-red-400 bg-red-500/5'}`}
// //                   >
// //                     {u.subscription_status}
// //                   </button>
// //                 </div>
// //               ))}
// //             </div>
// //           </section>

// //           {/* --- SECTION 09: WINNER VERIFICATION MODULE --- */}
// //           <section className="space-y-6">
// //             <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] ml-4">Winner Payout Audit</h2>
// //             <div className="space-y-4">
// //               {winners.map(w => (
// //                 <div key={w.id} className="p-6 bg-zinc-900/80 rounded-[2.5rem] border border-zinc-800 space-y-4">
// //                   <div className="flex justify-between items-start">
// //                     <div>
// //                       <p className="text-3xl font-black text-emerald-500 italic leading-none">£{w.prize_amount}</p>
// //                       <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Hero: {w.profiles?.full_name}</p>
// //                     </div>
// //                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${w.status === 'Paid' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-blue-500/30 text-blue-500 bg-blue-500/5'}`}>
// //                       {w.status}
// //                     </span>
// //                   </div>

// //                   {/* Proof Viewer logic */}
// //                   {w.status === 'Pending' && (
// //                     <div className="pt-4 border-t border-zinc-800 flex flex-col gap-4">
// //                       {w.proof_url ? (
// //                         <a href={w.proof_url} target="_blank" className="text-[10px] font-black text-blue-400 uppercase underline tracking-widest">View Score Proof Screenshot →</a>
// //                       ) : (
// //                         <p className="text-[10px] text-zinc-600 italic">Proof not uploaded by winner yet.</p>
// //                       )}
                      
// //                       <div className="flex gap-3">
// //                         <button onClick={() => handleVerification(w.id, true)} className="flex-1 py-3 bg-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all">Approve Payout</button>
// //                         <button onClick={() => handleVerification(w.id, false)} className="flex-1 py-3 bg-zinc-800 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-900 transition-all">Reject</button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           </section>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // 'use client';
// // // import { useState, useEffect } from 'react';
// // // import { supabase } from '@/lib/supabase';
// // // import { useRouter } from 'next/navigation';

// // // export default function AdminPanel() {
// // //   const [winners, setWinners] = useState<any[]>([]);
// // //   const [users, setUsers] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const router = useRouter();

// // //   // ✅ SECURITY CHECK
// // //   useEffect(() => {
// // //     const checkAdmin = async () => {
// // //       const { data: { session } } = await supabase.auth.getSession();
// // //       if (!session) return router.push('/login');

// // //       const { data: profile } = await supabase
// // //         .from('profiles')
// // //         .select('role')
// // //         .eq('id', session.user.id)
// // //         .single();

// // //       if (profile?.role !== 'admin') {
// // //         router.push('/dashboard');
// // //       } else {
// // //         fetchAdminData();
// // //       }
// // //     };
// // //     checkAdmin();
// // //   }, [router]);

// // //   const fetchAdminData = async () => {
// // //     try {
// // //       const [{ data: win }, { data: usr }] = await Promise.all([
// // //         supabase.from('winners').select('*, profiles(full_name, email), draws(draw_date)').order('created_at', { ascending: false }),
// // //         supabase.from('profiles').select('*').order('full_name', { ascending: true })
// // //       ]);
// // //       setWinners(win || []);
// // //       setUsers(usr || []);
// // //     } catch (err: any) {
// // //       console.error("❌ Fetch error:", err.message);
// // //     }
// // //   };

// // //   const toggleStatus = async (userId: string, currentStatus: string) => {
// // //     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
// // //     await supabase.from('profiles').update({ subscription_status: newStatus }).eq('id', userId);
// // //     fetchAdminData();
// // //   };

// // //   const calculatePrdPayout = (avgScore: number) => {
// // //     if (avgScore >= 40) return { money: 400, tier: 5 };
// // //     if (avgScore >= 35) return { money: 350, tier: 4 };
// // //     if (avgScore >= 30) return { money: 250, tier: 3 };
// // //     return { money: 0, tier: 0 };
// // //   };

// // //   // ✅ FIXED EXECUTE DRAW (Build Error Fixed Here)
// // //   const executeMonthlyDraw = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const { data: activeUsers } = await supabase.from('profiles').select('id, full_name').eq('subscription_status', 'active');
// // //       if (!activeUsers?.length) return alert("No active users found.");

// // //       // Fetch or Create Draw
// // //       let { data: draw } = await supabase.from('draws').select('id').eq('status', 'open').maybeSingle();
// // //       if (!draw) {
// // //         const { data: nDraw } = await supabase.from('draws').insert({ status: 'open' }).select().single();
// // //         draw = nDraw;
// // //       }

// // //       // CRITICAL: Double check that 'draw' is not null for TypeScript
// // //       if (!draw) {
// // //         setLoading(false);
// // //         return alert("Failed to initialize draw.");
// // //       }

// // //       for (const u of activeUsers) {
// // //         const { data: scs } = await supabase.from('golf_scores').select('score').eq('user_id', u.id).limit(5);
// // //         if (!scs?.length) continue;

// // //         const avg = scs.reduce((acc, curr) => acc + curr.score, 0) / scs.length;
// // //         const res = calculatePrdPayout(avg);

// // //         if (res.money > 0) {
// // //           await supabase.from('winners').insert({
// // //             user_id: u.id,
// // //             draw_id: draw.id, // Now safe from null
// // //             prize_amount: res.money,
// // //             match_tier: res.tier,
// // //             status: 'Pending'
// // //           });
// // //         }
// // //       }

// // //       await supabase.from('draws').update({ status: 'completed' }).eq('id', draw.id);
// // //       alert("✅ Draw Completed based on Performance!");
// // //       fetchAdminData();
// // //     } catch (err: any) {
// // //       alert(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const verifyPayout = async (id: string) => {
// // //     await supabase.from('winners').update({ status: 'Paid' }).eq('id', id);
// // //     fetchAdminData();
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans">
// // //       <div className="max-w-7xl mx-auto space-y-12">
// // //         <div className="flex justify-between items-center bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
// // //           <h1 className="text-5xl font-black italic uppercase tracking-tighter">Admin Control</h1>
// // //           <button 
// // //             onClick={executeMonthlyDraw} 
// // //             disabled={loading}
// // //             className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
// // //           >
// // //             {loading ? 'Processing...' : 'Execute Monthly Draw'}
// // //           </button>
// // //         </div>

// // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
// // //           <section className="space-y-4">
// // //             <h2 className="text-emerald-500 font-bold uppercase tracking-widest">User Management</h2>
// // //             {users.map(u => (
// // //               <div key={u.id} className="flex justify-between p-5 bg-zinc-900 rounded-3xl border border-zinc-800">
// // //                 <div>
// // //                   <p className="font-bold italic">{u.full_name}</p>
// // //                   <p className="text-xs text-zinc-500">{u.email}</p>
// // //                 </div>
// // //                 <button onClick={() => toggleStatus(u.id, u.subscription_status)} className="px-4 py-1 rounded-xl bg-zinc-800 text-[10px] font-bold uppercase tracking-widest">
// // //                   {u.subscription_status}
// // //                 </button>
// // //               </div>
// // //             ))}
// // //           </section>

// // //           <section className="space-y-4">
// // //             <h2 className="text-blue-500 font-bold uppercase tracking-widest">Reward Verification</h2>
// // //             {winners.map(w => (
// // //               <div key={w.id} className="flex justify-between p-5 bg-zinc-900 rounded-3xl border border-zinc-800">
// // //                 <div>
// // //                   <p className="text-2xl font-black text-emerald-500 italic">£{w.prize_amount}</p>
// // //                   <p className="text-sm font-bold uppercase tracking-tighter text-zinc-400">{w.profiles?.full_name}</p>
// // //                 </div>
// // //                 {w.status === 'Pending' ? (
// // //                   <button onClick={() => verifyPayout(w.id)} className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Verify</button>
// // //                 ) : (
// // //                   <span className="text-emerald-500 font-black uppercase tracking-widest">Paid ✓</span>
// // //                 )}
// // //               </div>
// // //             ))}
// // //           </section>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
 