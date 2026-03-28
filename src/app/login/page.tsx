'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else window.location.href = '/dashboard';
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <form onSubmit={handleLogin} className="max-w-md w-full space-y-6 bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase text-center">Hero Login</h1>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800 outline-none focus:ring-2 focus:ring-emerald-500" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800 outline-none focus:ring-2 focus:ring-emerald-500" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black uppercase tracking-widest transition-all">
          {loading ? 'Entering...' : 'Login to Mission'}
        </button>
      </form>
    </div>
  );
}