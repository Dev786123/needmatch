"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("provider");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !role) {
      setMessage("Please fill email, password and role");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // ✅ STEP 1: Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // ❌ already exists case
    if (data.user?.identities?.length === 0) {
      setMessage("Account already exists. Please login.");
      setLoading(false);
      return;
    }

    // ✅ STEP 2: Insert profile (NO UPSERT)
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            user_id: data.user.id, // 🔥 MUST MATCH auth.uid()
            role,
          },
        ]);

      if (profileError) {
        setMessage(profileError.message);
        setLoading(false);
        return;
      }
    }

    setMessage("Account created successfully! Please login now.");
    setEmail("");
    setPassword("");
    setRole("provider");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <div className="rounded-3xl border bg-white/90 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-slate-950">
              Create your account
            </h2>
            <p className="mt-2 text-slate-600">
              Select your role and start using NeedMatch.
            </p>
          </div>

          {message && (
            <p className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              {message}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="mb-4 w-full rounded-xl border p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="mb-4 w-full rounded-xl border p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="mb-6 w-full rounded-xl border p-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="client">Client</option>
            <option value="provider">Provider</option>
          </select>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </section>
    </main>
  );
}