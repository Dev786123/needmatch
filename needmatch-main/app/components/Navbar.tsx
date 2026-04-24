"use client";

import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-bold text-xl">NeedMatch</h1>

      <div className="flex gap-4">
        <a href="/dashboard">Dashboard</a>
        <a href="/needs">Needs</a>
        <a href="/my-needs">My Needs</a>
        <a href="/my-applications">My Applications</a>

        <button onClick={handleLogout} className="text-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
}