'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CharityProfile() {
  const { id } = useParams();
  const [charity, setCharity] = useState<any>(null);

  useEffect(() => {
    const fetchCharity = async () => {
      const { data } = await supabase.from('charities').select('*').eq('id', id).single();
      setCharity(data);
    };
    fetchCharity();
  }, [id]);

  if (!charity) return <div className="p-20 text-center animate-pulse">Loading Mission Details...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-20 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Banner Image [cite: 82] */}
        <div className="h-64 md:h-96 bg-zinc-900 rounded-[3rem] border border-zinc-800 overflow-hidden relative">
          {charity.cover_image ? (
            <img src={charity.cover_image} alt={charity.name} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-900/20 to-zinc-900 flex items-center justify-center text-emerald-500 font-black italic text-4xl uppercase tracking-tighter">Impact Vision</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-emerald-500 leading-none">{charity.name}</h1>
            <p className="text-zinc-400 text-xl leading-relaxed">{charity.description}</p>
            
            {/* Upcoming Events [cite: 82] */}
            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Upcoming Golf Events</h2>
              <div className="space-y-4">
                {charity.events?.length > 0 ? charity.events.map((ev: any, i: number) => (
                  <div key={i} className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                    <div>
                      <p className="text-emerald-500 font-bold text-xs uppercase">{ev.date}</p>
                      <h4 className="font-bold text-lg">{ev.title}</h4>
                    </div>
                    <button className="bg-zinc-800 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">Join Day</button>
                  </div>
                )) : <p className="text-zinc-600 italic text-sm">No live events scheduled.</p>}
              </div>
            </section>
          </div>

          {/* Independent Donation  */}
          <aside className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 h-fit space-y-6 sticky top-32">
            <h3 className="font-black italic uppercase tracking-tight text-xl">Direct Impact</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Not ready to subscribe? You can still fuel the mission with a one-time contribution.</p>
            <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">Donate Now</button>
          </aside>
        </div>
      </div>
    </div>
  );
}