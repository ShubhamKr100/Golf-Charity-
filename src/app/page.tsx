// import Link from 'next/link';

// // --- Stylized Logo Component ---
// const Logo = () => (
//   <div className="flex items-center gap-2 group cursor-pointer">
//     <div className="relative w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
//       <span className="text-zinc-950 font-black text-xl italic mt-0.5 ml-0.5">G</span>
//       <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-zinc-950">
//         <span className="text-zinc-950 font-black text-[10px]">4</span>
//       </div>
//     </div>
//     <span className="text-xl font-black tracking-tighter uppercase italic text-white">
//       Golf <span className="text-emerald-500 underline decoration-2 underline-offset-4">4</span> Charity
//     </span>
//   </div>
// );

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 overflow-hidden relative">
      
//       {/* Background Glows */}
//       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full -z-10"></div>
//       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full -z-10"></div>

//       {/* --- NAVBAR --- */}
//       <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
//         <Logo />
//         <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
//           <Link href="/charities" className="hover:text-emerald-500 transition-colors">Causes</Link>
//           <Link href="/how-it-works" className="hover:text-emerald-500 transition-colors">How it works</Link>
//           <Link href="/signup" className="bg-white text-zinc-950 px-6 py-2.5 rounded-full hover:bg-emerald-500 transition-all shadow-lg">Join Mission</Link>
//         </div>
//       </nav>

//       {/* --- HERO SECTION --- */}
//       <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center relative z-10">
        
//         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-bounce">
//           <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
//           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">The Future of Golf Philanthropy</span>
//         </div>

//         <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.85] mb-8">
//           Golf for <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700">Glory.</span><br />
//           Golf for <span className="text-white underline decoration-emerald-500/50">Good.</span>
//         </h1>

//         <p className="max-w-2xl text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
//           The modern platform where your performance on the green fuels global change. Track scores, support causes, and win life-changing prizes.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-6">
//           <Link href="/signup" className="px-12 py-6 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black uppercase tracking-[0.2em] italic transition-all shadow-[0_20px_40px_rgba(16,185,129,0.25)] active:scale-95 text-center">
//             Join the Mission
//           </Link>
//           <Link href="/charities" className="px-12 py-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl font-black uppercase tracking-[0.2em] italic transition-all active:scale-95 text-center">
//             View Impact Causes
//           </Link>
//         </div>

//         {/* --- STATS SECTION --- */}
//         <div className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-zinc-900 pt-16 w-full">
//           <div>
//             <p className="text-4xl font-black text-white italic mb-1">10%</p>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Guaranteed Impact</p>
//           </div>
//           <div>
//             <p className="text-4xl font-black text-white italic mb-1">£2.5k+</p>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Monthly Prize Pool</p>
//           </div>
//           <div className="col-span-2 md:col-span-1">
//             <p className="text-4xl font-black text-emerald-500 italic mb-1">50+</p>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Active Charities</p>
//           </div>
//         </div>
//       </section>

//       {/* Decorative Golf Ball Image or Icon at bottom */}
//       <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 opacity-20 blur-sm pointer-events-none">
//         <div className="w-[400px] h-[400px] border-[40px] border-zinc-900 rounded-full"></div>
//       </div>
//     </main>
//   );
// }


'use client';
import Link from 'next/link';


export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* --- BACKGROUND DECORATION --- */}
      {/* Version 2 ke Emerald aur Blue glows ko use kiya hai for better depth */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 blur-[140px] rounded-full"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 z-10 py-20">
        
        {/* Version 1 ka Label style */}
        <div className="inline-block px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          The Future of Golf Charity
        </div>

        {/* Version 1 & 2 ka Combined Heading (Bold, Italic, Uppercase) */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter italic uppercase leading-[0.85] mb-6">
          Turn your game <br />
          <span className="text-emerald-500">Into a force</span> <br />
          For <span className="text-blue-500">Good.</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
          The modern platform where your golf performance fuels global change. 
          Track scores, support causes, and win life-changing prizes.
        </p>

        {/* Version 2 ke high-contrast buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link 
            href="/signup" 
            className="group relative px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
          >
            Join the Mission
          </Link>
          <Link 
            href="/charities" 
            className="px-10 py-5 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-2xl font-black uppercase tracking-widest transition-all border border-zinc-800 hover:border-zinc-700"
          >
            View Causes
          </Link>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      {/* Version 2 ka 3-column grid design */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full z-10 pb-20">
        
        <div className="group p-10 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800 backdrop-blur-md hover:border-emerald-500/30 transition-all text-left">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-black mb-6 group-hover:scale-110 transition-transform">10%</div>
          <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight italic">Guaranteed Impact</h3>
          <p className="text-zinc-500 leading-relaxed">Every subscription directly supports a charity you choose personally. Play with purpose.</p>
        </div>

        <div className="group p-10 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800 backdrop-blur-md hover:border-blue-500/30 transition-all text-left">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 font-black mb-6 group-hover:scale-110 transition-transform">R5</div>
          <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight italic">Rolling Performance</h3>
          <p className="text-zinc-500 leading-relaxed">Enter your latest 5 Stableford scores. Simple, fast, and competitive tracking for heroes.</p>
        </div>

        <div className="group p-10 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800 backdrop-blur-md hover:border-white/20 transition-all text-left">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black mb-6 group-hover:scale-110 transition-transform">$$</div>
          <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight italic">Monthly Jackpots</h3>
          <p className="text-zinc-500 leading-relaxed">Match your performance to win. No winner? The pool rolls over, making the stakes higher.</p>
        </div>

      </section>
    </main>
  );
}
 