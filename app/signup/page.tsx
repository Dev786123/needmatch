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
      setMessage("Please enter email, password and role");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert([
        {
          user_id: data.user.id,
          role,
        },
      ]);
    }

    setMessage("Signup successful! Please login now.");
    setEmail("");
    setPassword("");
    setRole("provider");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <div className="hidden md:block">
          <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            Get started
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-950">
            Create your NeedMatch account.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Choose your role: client to post work, or provider to apply for work.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-xl">
          <h2 className="text-3xl font-extrabold text-slate-950">Sign Up</h2>

          <p className="mt-2 text-slate-600">
            Create your account and choose your role.
          </p>

          {message && (
            <p className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              {message}
            </p>
          )}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Create password"
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              I want to join as
            </label>
            <select
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="client">Client - I want to post work</option>
              <option value="provider">Provider - I want to get work</option>
            </select>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-blue-600">
              Login
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}