"use client";

import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
  <img src="/logo.png" alt="NeedMatch" className="h-9 w-auto" />
</a>

        <div className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
          <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
          <a href="/needs" className="hover:text-blue-600">Needs</a>
          <a href="/my-needs" className="hover:text-blue-600">My Needs</a>
          <a href="/my-applications" className="hover:text-blue-600">Applications</a>
          <a href="/profile" className="hover:text-blue-600">Profile</a>
          <a href="/credits" className="hover:text-blue-600">Credits</a>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}