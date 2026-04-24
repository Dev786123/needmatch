"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
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
    } else {
      setMessage("Login successful!");
      window.location.href = "/dashboard";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <div className="hidden md:block">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Welcome back
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-950">
            Manage your needs and applications.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Login to post needs, apply to opportunities, manage applicants, and
            unlock provider contacts using credits.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-xl">
          <h2 className="text-3xl font-extrabold text-slate-950">Login</h2>
          <p className="mt-2 text-slate-600">
            Continue to your NeedMatch account.
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
              placeholder="Enter password"
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-semibold text-blue-600">
              Sign up
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}