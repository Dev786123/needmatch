"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setLoginSuccess(params.get("login") === "success");

    const loadDashboard = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/login";
        return;
      }

      // ✅ STEP 1: GET PROFILE
      let { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userData.user.id)
        .limit(1);

      let profile =
        profiles && profiles.length > 0 ? profiles[0] : null;

      // 🔥 STEP 2: GOOGLE USER FIX (AUTO CREATE PROFILE)
      if (!profile) {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: userData.user.id,
              role: "provider", // default role
            },
          ])
          .select("*");

        profile =
          newProfile && newProfile.length > 0 ? newProfile[0] : null;
      }

      const userRole = profile?.role || "provider";
      const isProfileComplete =
        profile?.name && profile?.city && profile?.phone;

      setRole(userRole);
      setName(profile?.name || "there");
      setShowProfilePopup(!isProfileComplete);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {showProfilePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl">
            <h2 className="text-2xl font-black text-slate-950">
              Complete your profile
            </h2>

            <p className="mt-3 text-slate-600">
              Please complete your profile details before using NeedMatch.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => (window.location.href = "/profile")}
                className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white"
              >
                Complete Profile
              </button>

              <button
                onClick={() => setShowProfilePopup(false)}
                className="rounded-xl border px-5 py-3 font-bold text-slate-700"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="px-6 py-16">
        <h1 className="text-4xl font-black">
          Welcome {name}
        </h1>
      </section>
    </main>
  );
}