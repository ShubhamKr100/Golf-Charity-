'use client';

export default function HowItWorks() {
  const steps = [
    { 
      title: "Join", 
      desc: "Sign up as a Hero and select a charity that resonates with your values." 
    },
    { 
      title: "Play", 
      desc: "Enter your latest 5 Stableford rounds. Our system tracks your rolling performance." 
    },
    { 
      title: "Contribute", 
      desc: "10% of your monthly subscription fee goes directly to your chosen cause." 
    },
    { 
      title: "Win", 
      desc: "Every month, we draw winners: 40% (1st), 35% (2nd), and 25% (3rd) of the prize pool." 
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 md:p-24 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* --- HEADER SECTION --- */}
        <header className="space-y-6 text-center md:text-left animate-in fade-in duration-1000">
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
            The Hero Manual
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
            How it <span className="text-emerald-500 border-b-8 border-emerald-500/20">Works</span>
          </h1>
          <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl leading-relaxed font-medium">
            Welcome to a new era of golf tracking. We combine your passion for the game 
            with meaningful charitable impact and high-stakes monthly rewards.
          </p>
        </header>

        {/* --- THE BLUEPRINT (4-STEP GRID) --- */}
        <section className="space-y-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 text-center">
            The 4-Step Blueprint
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="group bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 hover:border-emerald-500/30 transition-all relative overflow-hidden h-full">
                <span className="text-8xl font-black text-emerald-500/5 absolute -right-4 -bottom-4 group-hover:text-emerald-500/10 transition-colors italic">
                  {i + 1}
                </span>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-black text-emerald-500 uppercase italic tracking-tighter">
                    {s.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-200 transition-colors">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- THE MISSION SECTION --- */}
        <section className="relative overflow-hidden bg-zinc-900/30 p-10 md:p-16 rounded-[3.5rem] border border-zinc-800">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -z-10 rounded-full"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                The <br />
                <span className="text-emerald-500">Mission</span>
              </h2>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <p className="text-zinc-200 text-xl leading-relaxed font-medium">
                Our platform is more than just a score tracker; it’s a global community driven by purpose. 
                By joining, you turn every round of golf into a force for good.
              </p>
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <p className="text-emerald-400 font-bold leading-relaxed">
                  We guarantee that 10% of every single subscription fee is sent directly 
                  to the charity you choose during signup. No hidden fees, just pure impact.
                </p>
              </div>
              <p className="text-zinc-500 leading-relaxed text-sm">
                This ensures a sustainable flow of funding to critical causes, allowing golfers to 
                support environmental sustainability, youth talent development, and physical 
                rehabilitation through the sport they love.
              </p>
            </div>
          </div>
        </section>

        {/* --- DETAILED FEATURE GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rolling Scores */}
          <div className="p-10 bg-zinc-900/80 rounded-[3rem] border border-zinc-800 hover:border-emerald-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8">
                <span className="text-emerald-500 font-black text-xl italic">R5</span>
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Rolling Performance</h3>
              <p className="text-zinc-400 text-lg leading-relaxed group-hover:text-zinc-300 transition-colors">
                Simplicity is at our core. You only need to maintain your last 5 Stableford scores. 
                Our smart system automatically replaces your oldest round whenever you enter a new one, 
                keeping your performance profile fresh and up-to-date.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Format: Stableford 1-45</span>
            </div>
          </div>

          {/* Monthly Draws */}
          <div className="p-10 bg-zinc-900/80 rounded-[3rem] border border-zinc-800 hover:border-blue-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8">
                <span className="text-blue-500 font-black text-xl italic">$$</span>
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Monthly Prize Draws</h3>
              <p className="text-zinc-400 text-lg leading-relaxed group-hover:text-zinc-300 transition-colors">
                Every active subscriber is automatically entered into our monthly prize pool. 
                Winnings are distributed across three competitive tiers based on number matches, 
                with our massive 5-number Jackpot rolling over if no winner is found.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Tiers: 40% / 35% / 25%</span>
            </div>
          </div>
        </section>

        {/* --- FOOTER CTA FEEL --- */}
        <footer className="text-center pt-20 border-t border-zinc-900">
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Ready to start your mission?</h2>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.5em] font-black">
              Play for Purpose <span className="text-emerald-500 mx-2">•</span> Win for Impact
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// export default function About() {
//   return (
//     <div className="min-h-screen bg-zinc-950 text-white p-8 md:p-24 font-sans">
//       <div className="max-w-4xl mx-auto space-y-16">
        
//         {/* Header Section */}
//         <div className="space-y-4 text-center md:text-left">
//           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-emerald-500 uppercase italic">
//             How it Works
//           </h1>
//           <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">
//             Welcome to a new era of golf tracking. We combine your passion for the game 
//             with meaningful charitable impact and high-stakes monthly rewards.
//           </p>
//         </div>
        
//         {/* Detailed Mission Section */}
//         <section className="space-y-8 bg-zinc-900/30 p-10 rounded-[3rem] border border-zinc-800">
//           <h2 className="text-3xl font-bold tracking-tight border-b border-zinc-800 pb-4">
//             The Mission
//           </h2>
//           <div className="space-y-6">
//             <p className="text-zinc-300 text-lg leading-relaxed">
//               Our platform is more than just a score tracker; it’s a global community driven by purpose. 
//               By joining, you turn every round of golf into a force for good. We guarantee that 
//               <span className="text-emerald-500 font-bold"> 10% of every single subscription fee </span> 
//               is sent directly to the charity you choose during signup.
//             </p>
//             <p className="text-zinc-400 leading-relaxed">
//               This ensures a sustainable flow of funding to critical causes, allowing golfers to 
//               support environmental sustainability, youth talent development, and physical 
//               rehabilitation through the sport they love.
//             </p>
//           </div>
//         </section>

//         {/* Feature Grid */}
//         <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Rolling Scores */}
//           <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 hover:border-emerald-500/50 transition-all group">
//             <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
//               <span className="text-emerald-500 font-black">01</span>
//             </div>
//             <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Rolling Performance</h3>
//             <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
//               Simplicity is at our core. You only need to maintain your last 5 Stableford scores. 
//               Our smart system automatically replaces your oldest round whenever you enter a new one, 
//               keeping your performance profile fresh and up-to-date.
//             </p>
//           </div>

//           {/* Monthly Draws */}
//           <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 hover:border-blue-500/50 transition-all group">
//             <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
//               <span className="text-blue-500 font-black">02</span>
//             </div>
//             <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Monthly Prize Draws</h3>
//             <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
//               Every active subscriber is automatically entered into our monthly prize pool. 
//               Winnings are distributed across three competitive tiers based on number matches, 
//               with our massive 5-number Jackpot rolling over if no winner is found.
//             </p>
//           </div>
//         </section>

//         {/* Bottom CTA Feel */}
//         <div className="text-center pt-10">
//           <p className="text-zinc-500 text-sm uppercase tracking-[0.3em] font-bold">
//             Play for Purpose • Win for Impact
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
 