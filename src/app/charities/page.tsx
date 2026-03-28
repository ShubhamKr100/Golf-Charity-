'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link'; // ✅ Required for connection

export default function CharityDirectory() {
  const [charities, setCharities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const { data } = await supabase.from('charities').select('*');
        if (data) setCharities(data);
      } catch (err) {
        console.error("Error fetching charities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 md:p-16 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-1000">
        
        {/* --- Header Section --- */}
        <header className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Our <span className="text-emerald-500">Impact</span> Partners
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-medium">
            Every score you enter fuels change. <span className="text-emerald-500 font-black">10% of all proceeds</span> are distributed to these verified causes. 
          </p>

          <div className="relative max-w-xl mx-auto mt-8">
            <input 
              type="text" 
              placeholder="Search causes..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-zinc-200"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* --- Charity Grid --- */}
        {loading ? (
          <div className="text-center py-20 animate-pulse text-zinc-500 font-black uppercase tracking-widest italic">Loading Hero Partners...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCharities.map(c => (
              <div key={c.id} className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 hover:border-emerald-500/30 transition-all group flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform text-emerald-500 text-2xl">♥</div>
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-500">Verified Partner</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-emerald-400 transition-colors uppercase italic leading-none">{c.name}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">{c.description}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-emerald-500">10% Allocation</span>
                    <span className="text-zinc-400 hover:text-white cursor-pointer">Read Story →</span>
                  </div>
                  
                  {/* ✅ Dynamic Link connected to Step 2 Profile Page */}
                  <Link href={`/charities/${c.id}`} className="block w-full text-center py-4 bg-zinc-950 group-hover:bg-emerald-600 border border-zinc-800 group-hover:border-emerald-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                    View Profile & Events 
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Upcoming Events --- */}
        <section className="mt-20 space-y-8 pb-10">
          <h2 className="text-2xl font-black uppercase tracking-widest italic border-l-4 border-emerald-500 pl-4">Upcoming Golf Events </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800 flex justify-between items-center group hover:border-zinc-700 transition-all">
              <div>
                <p className="text-emerald-500 font-bold text-xs uppercase italic">15th April 2026</p>
                <h4 className="font-black text-lg mt-1 group-hover:text-emerald-400 transition-colors italic">Green Fairways Open Day</h4>
                <p className="text-zinc-500 text-sm font-medium">Royal Golf Club, London</p>
              </div>
              <button className="bg-zinc-800 hover:bg-emerald-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all">Join Event</button>
            </div>
            {/* Repeat for other events... */}
          </div>
        </section>
      </div>
    </div>
  );
}

 