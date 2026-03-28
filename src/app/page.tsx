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
// // import Image from "next/image";

// // export default function Home() {
// //   return (
// //     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
// //       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
// //         <Image
// //           className="dark:invert"
// //           src="/next.svg"
// //           alt="Next.js logo"
// //           width={100}
// //           height={20}
// //           priority
// //         />
// //         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
// //           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
// //             To get started, edit the page.tsx file.
// //           </h1>
// //           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
// //             Looking for a starting point or more instructions? Head over to{" "}
// //             <a
// //               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //               className="font-medium text-zinc-950 dark:text-zinc-50"
// //             >
// //               Templates
// //             </a>{" "}
// //             or the{" "}
// //             <a
// //               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //               className="font-medium text-zinc-950 dark:text-zinc-50"
// //             >
// //               Learning
// //             </a>{" "}
// //             center.
// //           </p>
// //         </div>
// //         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
// //           <a
// //             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
// //             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             <Image
// //               className="dark:invert"
// //               src="/vercel.svg"
// //               alt="Vercel logomark"
// //               width={16}
// //               height={16}
// //             />
// //             Deploy Now
// //           </a>
// //           <a
// //             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
// //             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             Documentation
// //           </a>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }


// import Link from 'next/link';

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
//       {/* Background decoration - Avoiding Golf Clichés */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
//         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 blur-[120px] rounded-full"></div>
//         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[120px] rounded-full"></div>
//       </div>

//       {/* Hero Section */}
//       <section className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
//         <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
//           Play for <span className="text-emerald-500">Purpose.</span> <br />
//           Win for <span className="text-blue-500">Impact.</span>
//         </h1>
        
//         <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
//           The modern platform where your golf performance fuels global change. 
//           Track your scores, support your favorite charity, and enter monthly 
//           prizes that change lives—starting with yours.
//         </p>

//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
//           <Link href="/signup" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
//             Start Impacting Today
//           </Link>
//           <Link href="/about" className="px-8 py-4 bg-transparent border border-zinc-700 hover:bg-zinc-900 rounded-full font-semibold text-lg transition-all">
//             How the Draw Works
//           </Link>
//         </div>
//       </section>

//       {/* Stats/Features Section */}
//       <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
//         <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
//           <h3 className="text-2xl font-bold mb-2">10% Guaranteed</h3>
//           <p className="text-zinc-400">Every subscription directly supports a charity you choose personally.</p>
//         </div>
//         <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
//           <h3 className="text-2xl font-bold mb-2">Rolling Performance</h3>
//           <p className="text-zinc-400">Enter your latest 5 Stableford scores. Simple. Fast. Emotional.</p>
//         </div>
//         <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
//           <h3 className="text-2xl font-bold mb-2">Monthly Jackpots</h3>
//           <p className="text-zinc-400">Match 5 numbers to win. No winner? The pool rolls over to next month.</p>
//         </div>
//       </section>
//     </main>
//   );
// }