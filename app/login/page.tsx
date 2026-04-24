"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard?login=success`,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard?login=success";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <div className="hidden md:block">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Welcome back
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-950">
            Login to manage your work faster.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Post needs, apply to opportunities, track applications and unlock
            contacts from one clean dashboard.
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
              Welcome to NeedMatch
            </h2>
            <p className="mt-2 text-slate-600">
              Login to continue your workspace.
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
            placeholder="Enter your password"
            className="mb-6 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500">or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-bold text-blue-600 hover:underline"
            >
              Create account
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}