'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [scores, setScores] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [upcomingDraws, setUpcomingDraws] = useState<any[]>([]);
  const [winnings, setWinnings] = useState<any[]>([]);
  const [newScore, setNewScore] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ PRD Logic: Percentage Update Function 
  const updateCharityPercentage = async (newVal: number) => {
    if (newVal < 10) return alert("Minimum contribution is 10%");

    const { error } = await supabase
      .from('profiles')
      .update({ charity_percentage: newVal })
      .eq('id', profile.id);

    if (error) alert(error.message);
    else {
      setProfile({ ...profile, charity_percentage: newVal });
    }
  };

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/signup');
      return;
    }

    try {
      const [prof, sco, drw, win] = await Promise.all([
        supabase.from('profiles').select('*, charities(name)').eq('id', user.id).single(),
        supabase.from('golf_scores').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(5),
        supabase.from('draws').select('*').filter('status', 'eq', 'open').limit(2),
        supabase.from('winners').select('*, draws(draw_date)').eq('user_id', user.id)
      ]);

      setProfile(prof.data);
      setScores(sco.data || []);
      setUpcomingDraws(drw.data || []);
      setWinnings(win.data || []);
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = parseInt(newScore);

    if (scoreVal < 1 || scoreVal > 45) return alert("Score must be between 1 and 45");
    setIsUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Rolling 5 Logic 
      if (scores.length >= 5) {
        const oldestScoreId = scores[scores.length - 1].id;
        await supabase.from('golf_scores').delete().eq('id', oldestScoreId);
      }

      const { error } = await supabase.from('golf_scores').insert({
        user_id: user.id,
        score: scoreVal,
        recorded_at: new Date().toISOString()
      });

      if (error) throw error;

      setNewScore('');
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-black uppercase tracking-[0.3em] animate-pulse">
      Authenticating Hero Systems...
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-10 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-1000">
        
        {/* --- HEADER SECTION --- */}
        <header className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-10"></div>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
              Hero: <span className="text-emerald-500">{profile?.full_name || 'Golfer'}</span>
            </h1>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">
              Impact Partner: {profile?.charities?.name || 'Pending Selection'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${profile?.subscription_status === 'active' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-red-500/30 text-red-400 bg-red-500/5 animate-pulse'}`}>
              Plan: {profile?.subscription_status || 'Inactive'}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* --- LEFT COLUMN: WINNINGS & IMPACT --- */}
          <div className="space-y-10">
            {/* Winnings Overview  */}
            <section className="bg-zinc-900/60 p-8 rounded-[2.5rem] border border-zinc-800 space-y-6">
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Winnings Overview</h2>
              <div className="space-y-4">
                {winnings.length > 0 ? winnings.map(w => (
                  <div key={w.id} className="p-5 bg-zinc-950 rounded-3xl border border-zinc-800 flex justify-between items-center hover:border-emerald-500/30 transition-all">
                    <div>
                      <p className="text-2xl font-black text-emerald-500 tracking-tighter italic">£{w.prize_amount}</p>
                      <p className="text-[9px] text-zinc-600 uppercase font-bold mt-1">Tier: {w.match_tier}-Match</p>
                    </div>
                    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border transition-colors ${w.status?.toLowerCase() === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                      {w.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                )) : (
                  <p className="text-zinc-600 italic text-xs text-center py-4">No victories recorded yet.</p>
                )}
              </div>
            </section>

            {/* ✅ UPDATED MISSION ALLOCATION SLIDER  */}
            <section className="bg-emerald-950/20 p-8 rounded-[2.5rem] border border-emerald-900/30 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-emerald-500 uppercase tracking-widest italic">Mission Allocation</h2>
                <span className="text-[10px] font-black bg-emerald-500 text-black px-2 py-0.5 rounded-md italic">
                  {profile?.charity_percentage || 10}%
                </span>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="range" min="10" max="100" step="5"
                  value={profile?.charity_percentage || 10}
                  onChange={(e) => updateCharityPercentage(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                  <span>10% (Default)</span>
                  <span>100% (Pure Hero)</span>
                </div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase text-center leading-relaxed">
                  Voluntarily increase your contribution above. 
                </p>
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: PERFORMANCE TRACKER --- */}
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 space-y-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Performance Entry</h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Latest Stableford Score (1-45)</p>
                </div>
                <div className="px-4 py-1.5 bg-zinc-950 border border-zinc-800 rounded-full text-[9px] font-black text-emerald-500 tracking-[0.2em] uppercase">
                    Rolling 5 Active
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddScore} className="flex flex-col sm:flex-row gap-4 relative z-10">
                <input 
                  type="number" 
                  value={newScore} 
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="Round Score" 
                  className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-[2rem] p-6 outline-none focus:ring-2 focus:ring-emerald-500/20 font-black text-2xl text-emerald-500 transition-all placeholder:text-zinc-800"
                  required
                />
                <button 
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-30 active:scale-95"
                >
                  {isUpdating ? 'Logging...' : 'Update Round'}
                </button>
              </form>

              {/* Rolling 5 Display   */}
              <div className="space-y-8">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Your Rolling 5 Rounds</h3>
                <div className="flex flex-wrap gap-6">
                  {scores.length > 0 ? scores.map((s, index) => (
                    <div key={s.id} className="relative group">
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-500 z-20">
                        #{index + 1}
                      </span>
                      <div className={`w-28 h-28 rounded-[2.5rem] border flex items-center justify-center text-5xl font-black italic transition-all ${index === 0 ? 'bg-zinc-950 border-emerald-500/40 text-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                        {s.score}
                      </div>
                      {index === 0 && (
                        <div className="absolute -bottom-6 left-0 w-full text-center">
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10 italic">Latest</span>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="w-full py-16 text-center border-2 border-dashed border-zinc-800/50 rounded-[2rem]">
                      <p className="text-zinc-600 italic text-sm">No rounds recorded. Start impacting now.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tip box */}
              <div className="p-6 bg-zinc-950/30 rounded-3xl border border-zinc-800/50">
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                    PRD LOGIC: Our system maintains only your last 5 Rounds. Entering a new score will automatically replace the oldest round to keep your performance profile current. 
                  </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
