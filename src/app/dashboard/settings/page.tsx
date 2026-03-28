'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSettingsData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      // Fetch Profile and Charities list
      const [prof, chars] = await Promise.all([
        supabase.from('profiles').select('*, charities(name)').eq('id', user.id).single(),
        supabase.from('charities').select('*')
      ]);

      setProfile(prof.data);
      setCharities(chars.data || []);
      setLoading(false);
    };

    fetchSettingsData();
  }, [router]);

  // ✅ ACTIVE LOGIC: Update Charity Partner
  const updateCharity = async (newCharityId: string) => {
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('profiles')
      .update({ charity_id: newCharityId })
      .eq('id', user?.id);

    if (error) {
      alert(error.message);
    } else {
      setProfile({ ...profile, charity_id: newCharityId });
      alert("Mission Updated: Your future impact is now redirected! ");
    }
    setUpdating(false);
  };

  if (loading) return <div className="p-20 text-center text-zinc-500 font-black uppercase italic animate-pulse">Accessing Secure Settings...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-20 font-sans selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        <header className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Account <span className="text-emerald-500">Settings</span></h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Manage your hero profile and impact mission [cite: 29]</p>
        </header>

        {/* Charity Selection Module */}
        <section className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-emerald-500/10 pointer-events-none italic font-black text-6xl">01</div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase italic tracking-tight">Mission Partner</h2>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">Select the cause that will receive 10% of your performance-driven subscription fee[cite: 15, 77].</p>
          </div>

          <div className="space-y-4">
            <select 
              value={profile?.charity_id || ''} 
              onChange={(e) => updateCharity(e.target.value)}
              disabled={updating}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="" disabled>Select your impact partner...</option>
              {charities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <p className="text-[10px] text-zinc-600 italic">Current Partner: <span className="text-emerald-500 font-black uppercase">{profile?.charities?.name || 'None Selected'}</span></p>
          </div>
        </section>

        {/* Subscription Info (PRD Section 10) */}
        <section className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="font-black uppercase italic tracking-tight">Subscription Status</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Current Plan: {profile?.subscription_status || 'Inactive'} [cite: 89]</p>
          </div>
          <button className="bg-zinc-800 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">Manage Billing</button>
        </section>

      </div>
    </div>
  );
}

// const updateCharity = async (newCharityId: string) => {
//   const { data: { user } } = await supabase.auth.getUser();
//   const { error } = await supabase
//     .from('profiles')
//     .update({ charity_id: newCharityId })
//     .eq('id', user?.id);

//   if (error) alert(error.message);
//   else alert("Charity updated successfully! Your future impact will go here.");
// };
