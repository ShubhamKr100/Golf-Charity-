import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // New Import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Heroes | Turn Performance into Purpose",
  description: "Global community fueled by purpose. By joining, you turn every round of golf into a force for good.",
};

export default function RootLayout({
  children,
  }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark selection:bg-emerald-500/30`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white selection:bg-emerald-500/30">
        
        {/* Updated Navbar (PRD Fixed Conditional Rendering & Auth) */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
// isko dekha kya updated h sara 

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Link from "next/link";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Digital Heroes | Performance & Charity",
//   description: "Impact through every swing.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
//     >
//       <body className="min-h-full flex flex-col bg-zinc-950 text-white">
//         {/* --- Navbar Section --- */}
//         <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 p-4">
//           <div className="max-w-7xl mx-auto flex justify-between items-center">
            
//             {/* Brand Logo */}
//             <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
//               <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-black text-sm">DH</div>
//               <span className="font-black tracking-tighter text-xl uppercase">Digital Heroes</span>
//             </Link>

//             {/* Navigation Links */}
//             <div className="hidden md:flex items-center gap-10">
//               <Link href="/dashboard" className="text-base font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
//                 Dashboard
//               </Link>
//               <Link href="/charities" className="text-base font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
//                 Charities
//               </Link>
//               <Link href="/about" className="text-base font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
//                 How it Works
//               </Link>
              
//               {/* Updated Admin Link: Dark Red Background & High White Hover */}
//               <Link 
//                 href="/admin" 
//                 className="text-[12px] font-black bg-red-950/50 text-red-500 border border-red-900/50 px-4 py-1.5 rounded-full hover:text-white hover:bg-red-900 hover:border-red-700 transition-all uppercase tracking-[0.2em]"
//               >
//                 Admin
//               </Link>
//             </div>

//             {/* Mobile Indicator */}
//             <div className="md:hidden">
//                <span className="text-emerald-500 font-bold text-xs uppercase">Menu</span>
//             </div>
//           </div>
//         </nav>

//         {/* Page Content */}
//         <main className="flex-1">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }

// // import type { Metadata } from "next";
// // import { Geist, Geist_Mono } from "next/font/google";
// // import "./globals.css";
// // import Link from "next/link"; // Link import karna zaroori hai

// // const geistSans = Geist({
// //   variable: "--font-geist-sans",
// //   subsets: ["latin"],
// // });

// // const geistMono = Geist_Mono({
// //   variable: "--font-geist-mono",
// //   subsets: ["latin"],
// // });

// // export const metadata: Metadata = {
// //   title: "Digital Heroes | Performance & Charity",
// //   description: "Impact through every swing.",
// // };

// // export default function RootLayout({
// //   children,
// // }: Readonly<{
// //   children: React.ReactNode;
// // }>) {
// //   return (
// //     <html
// //       lang="en"
// //       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
// //     >
// //       <body className="min-h-full flex flex-col bg-zinc-950 text-white">
// //         {/* --- Navbar Section Start --- */}
// //         <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 p-4">
// //           <div className="max-w-7xl mx-auto flex justify-between items-center">
            
// //             {/* Brand Logo Section */}
// //             <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
// //               <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-black text-sm">DH</div>
// //               <span className="font-black tracking-tighter text-xl uppercase">Digital Heroes</span>
// //             </Link>

// //             {/* Navigation Links - Updated Word Size & Spacing */}
// //             <div className="hidden md:flex items-center gap-10">
// //               <Link href="/dashboard" className="text-base font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
// //                 Dashboard
// //               </Link>
// //               <Link href="/charities" className="text-base font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
// //                 Charities
// //               </Link>
// //               <Link href="/about" className="text-base font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
// //                 How it Works
// //               </Link>
              
// //               {/* Special Styled Admin Link */}
// //               <Link 
// //                 href="/admin" 
// //                 className="text-[12px] font-black text-zinc-500 border border-zinc-800 px-4 py-1.5 rounded-full hover:border-emerald-500/50 hover:text-emerald-400 transition-all uppercase tracking-[0.2em]"
// //               >
// //                 Admin
// //               </Link>

// //               <Link 
// //   href="/admin" 
// //   className="text-[12px] font-black text-red-700 border border-red-900/30 px-4 py-1.5 rounded-full hover:border-red-500/50 hover:text-red-500 transition-all uppercase tracking-[0.2em]"
// // >
// //   Admin
// // </Link>
// // {/* Updated Admin Link: Dark Red Background & High White Hover */}
// //               <Link 
// //                 href="/admin" 
// //                 className="text-[12px] font-black bg-red-950/50 text-red-500 border border-red-900/50 px-4 py-1.5 rounded-full hover:text-white hover:bg-red-900 hover:border-red-700 transition-all uppercase tracking-[0.2em]"
// //               >
// //                 Admin
// //               </Link>
// //             </div>

// //             {/* Optional: Mobile Logout/Action (Since links are hidden on mobile) */}
// //             <div className="md:hidden">
// //                <span className="text-emerald-500 font-bold text-xs uppercase">Menu</span>
// //             </div>
// //           </div>
// //         </nav>
// //         {/* --- Navbar Section End --- */}

// //         {/* Page Content */}
// //         <main className="flex-1">
// //           {children}
// //         </main>
// //       </body>
// //     </html>
// //   );
// // }
 