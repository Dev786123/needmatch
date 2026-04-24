"use client";

import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="NeedMatch"
            className="h-15 w-auto object-contain"
          />
        </a>

        {/* Links */}
        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
          <a href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </a>
          <a href="/needs" className="hover:text-blue-600">
            Needs
          </a>
          <a href="/my-needs" className="hover:text-blue-600">
            My Needs
          </a>
          <a href="/my-applications" className="hover:text-blue-600">
            Applications
          </a>
          <a href="/credits" className="hover:text-blue-600">
            Credits
          </a>
          <a href="/profile" className="hover:text-blue-600">
            Profile
          </a>
        </div>

        {/* Action */}
        <button
          onClick={handleLogout}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}