"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const [role, setRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLoggedIn(false);
      setRole("");
      setLoading(false);
      return;
    }

    setLoggedIn(true);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userData.user.id)
      .limit(1);

    const profile = profiles && profiles.length > 0 ? profiles[0] : null;

    setRole(profile?.role || "");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="NeedMatch"
            className="h-14 w-auto object-contain"
          />
        </a>

        {!loading && loggedIn && (
          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            <a href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </a>

            {role === "client" && (
              <>
                <a href="/post-need" className="hover:text-blue-600">
                  Post Need
                </a>

                <a href="/my-needs" className="hover:text-blue-600">
                  My Needs
                </a>

                <a href="/credits" className="hover:text-blue-600">
                  Credits
                </a>
              </>
            )}

            {role === "provider" && (
              <>
                <a href="/needs" className="hover:text-blue-600">
                  Browse Needs
                </a>

                <a href="/my-applications" className="hover:text-blue-600">
                  My Applications
                </a>
              </>
            )}

            <a href="/profile" className="hover:text-blue-600">
              Profile
            </a>
          </div>
        )}

        {!loading && loggedIn ? (
          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Logout
          </button>
        ) : (
          <a
            href="/login"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}