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
    setMessage("");

    if (!email || !password || !role) {
      setMessage("Please fill email, password and role");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
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

    if (data.user?.identities?.length === 0) {
      setMessage("Account already exists. Please login.");
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: data.user.id,
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
        <div className="hidden md:block">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Create account
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-950">
            Join NeedMatch with the right role.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Choose Client if you want to post work. Choose Provider if you want
            to find work and apply to needs.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm">
              <h3 className="font-bold text-slate-900">Client flow</h3>
              <p className="text-sm text-slate-600">
                Post needs, manage applicants and unlock provider contacts.
              </p>
            </div>

            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm">
              <h3 className="font-bold text-slate-900">Provider flow</h3>
              <p className="text-sm text-slate-600">
                Browse needs, apply with proposals and track status.
              </p>
            </div>
          </div>
        </div>

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

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="mb-4 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Create password"
            className="mb-4 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Join as
          </label>
          <select
            className="mb-6 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="client">Client - I want to post work</option>
            <option value="provider">Provider - I want to get work</option>
          </select>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="font-bold text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}