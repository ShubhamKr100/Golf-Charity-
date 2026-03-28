'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Signup() {
  const [charities, setCharities] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedCharity, setSelectedCharity] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = 'mrshubham103912@gmail.com';

  // Fetch charities
  useEffect(() => {
    const fetchCharities = async () => {
      const { data, error } = await supabase.from('charities').select('*');

      if (error) {
        console.log("❌ Charity error:", error.message);
      } else {
        setCharities(data || []);
      }
    };

    fetchCharities();
  }, []);

  // Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      return alert("All fields are required");
    }

    if (!selectedCharity) {
      return alert("Please select a charity");
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Create user
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");

      // 2. Role decide
      const role =
        cleanEmail === ADMIN_EMAIL.toLowerCase()
          ? 'admin'
          : 'subscriber';

      // 3. Insert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName.trim(),
          email: cleanEmail,
          charity_id: selectedCharity,
          role: role,
          subscription_status: 'inactive',
        });

      if (profileError) throw profileError;

      alert(role === 'admin' ? 'Welcome Admin!' : 'Signup successful!');

      // 4. Redirect
      window.location.href = '/dashboard';

    } catch (err: any) {
      console.log("❌ Signup error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
      <form
        onSubmit={handleSignup}
        className="max-w-md w-full space-y-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
      >
        <h1 className="text-3xl font-bold text-center">
          Join Mission
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800"
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800"
            onChange={(e) => setSelectedCharity(e.target.value)}
            required
          >
            <option value="">Choose Charity</option>
            {charities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 rounded-lg font-bold"
        >
          {loading ? 'Processing...' : 'Signup'}
        </button>
      </form>
    </div>
  );
}